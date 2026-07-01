from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import PersonalProject
from .serializers import PersonalProjectSerializer


class PersonalProjectListView(generics.ListAPIView):
    queryset = PersonalProject.objects.prefetch_related('technologies').all()
    serializer_class = PersonalProjectSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx
