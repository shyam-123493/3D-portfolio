from rest_framework import serializers
from .models import Project, ProjectContribution, ProjectTechnology, ProjectArchitectureLayer


class ProjectContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectContribution
        fields = ['text']


class ProjectTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTechnology
        fields = ['name', 'category']


class ProjectArchitectureLayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectArchitectureLayer
        fields = ['label', 'color', 'items']


class ProjectListSerializer(serializers.ModelSerializer):
    technologies = ProjectTechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'role', 'domain', 'description',
            'technologies', 'color', 'featured',
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    contributions = serializers.SerializerMethodField()
    technologies = ProjectTechnologySerializer(many=True, read_only=True)
    architecture = ProjectArchitectureLayerSerializer(many=True, read_only=True, source='architecture_layers')

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'role', 'domain', 'description',
            'contributions', 'technologies', 'architecture',
            'challenge', 'solution', 'color', 'featured',
            'github_url', 'live_url',
        ]

    def get_contributions(self, obj):
        return list(obj.contributions.values_list('text', flat=True))
