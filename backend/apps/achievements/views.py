from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Achievement, Certification
from .serializers import AchievementSerializer, CertificationSerializer


class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class CertificationListView(generics.ListAPIView):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]
    pagination_class = None
