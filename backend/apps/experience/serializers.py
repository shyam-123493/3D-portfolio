from rest_framework import serializers
from .models import Experience


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'date', 'title', 'organization', 'description', 'entry_type', 'tags']
