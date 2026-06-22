from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Experience
from .serializers import ExperienceSerializer


class ExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    pagination_class = None
