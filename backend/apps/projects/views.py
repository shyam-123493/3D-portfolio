from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Project
from .serializers import ProjectDetailSerializer


# Full objects, not a summary: the frontend renders contributions, challenge/
# solution and architecture straight from this list (cards + detail side panel)
# and never refetches per-slug. Only ~5 projects, so payload size is a non-issue.
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.prefetch_related(
        'contributions', 'technologies', 'architecture_layers'
    ).all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [AllowAny]


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related('contributions', 'technologies', 'architecture_layers').all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
