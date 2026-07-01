from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from .models import VaultSection
from .serializers import VaultSectionSerializer


class VaultUnlockThrottle(AnonRateThrottle):
    # 10 unlock attempts per minute — prevents brute-force
    rate = '10/minute'
    scope = 'vault_unlock'


class VaultUnlockView(APIView):
    permission_classes = [AllowAny]
    throttle_classes   = [VaultUnlockThrottle]

    def post(self, request):
        submitted_pin = str(request.data.get('pin', '')).strip()
        vault_pin     = str(getattr(settings, 'VAULT_PIN', '2025')).strip()

        if submitted_pin != vault_pin:
            return Response({'detail': 'Invalid PIN.'}, status=status.HTTP_401_UNAUTHORIZED)

        sections = VaultSection.objects.prefetch_related('items').order_by('order')
        data = VaultSectionSerializer(sections, many=True).data
        return Response(data)
