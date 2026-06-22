from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer


class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.prefetch_related('technologies').all()
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related('contributions', 'technologies', 'architecture_layers').all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
