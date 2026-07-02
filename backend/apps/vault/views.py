import hmac

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from .models import VaultSection, VaultItem
from .serializers import VaultSectionSerializer, VaultItemSerializer


def _pin_matches(submitted: str) -> bool:
    vault_pin = str(getattr(settings, 'VAULT_PIN', '2025')).strip()
    return hmac.compare_digest(str(submitted).strip(), vault_pin)


class VaultUnlockThrottle(AnonRateThrottle):
    # 10 unlock attempts per minute — prevents brute-force
    rate = '10/minute'
    scope = 'vault_unlock'


class VaultMutateThrottle(AnonRateThrottle):
    # Item add/delete — generous for normal editing, still brute-force safe
    rate = '30/minute'
    scope = 'vault_mutate'


class VaultUnlockView(APIView):
    permission_classes = [AllowAny]
    throttle_classes   = [VaultUnlockThrottle]

    def post(self, request):
        if not _pin_matches(request.data.get('pin', '')):
            return Response({'detail': 'Invalid PIN.'}, status=status.HTTP_401_UNAUTHORIZED)

        sections = VaultSection.objects.prefetch_related('items').order_by('order')
        data = VaultSectionSerializer(sections, many=True).data
        return Response(data)


class VaultItemCreateView(APIView):
    """Create an item in a section. PIN required via X-Vault-Pin header."""
    permission_classes = [AllowAny]
    throttle_classes   = [VaultMutateThrottle]

    def post(self, request):
        if not _pin_matches(request.headers.get('X-Vault-Pin', '')):
            return Response({'detail': 'Invalid PIN.'}, status=status.HTTP_401_UNAUTHORIZED)

        section = VaultSection.objects.filter(slug=request.data.get('section', '')).first()
        if section is None:
            return Response({'detail': 'Unknown section.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = VaultItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(section=section)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VaultItemDeleteView(APIView):
    """Delete an item by id. PIN required via X-Vault-Pin header."""
    permission_classes = [AllowAny]
    throttle_classes   = [VaultMutateThrottle]

    def delete(self, request, item_id):
        if not _pin_matches(request.headers.get('X-Vault-Pin', '')):
            return Response({'detail': 'Invalid PIN.'}, status=status.HTTP_401_UNAUTHORIZED)

        deleted, _ = VaultItem.objects.filter(id=item_id).delete()
        if not deleted:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
