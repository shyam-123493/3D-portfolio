from rest_framework import serializers
from .models import PersonalProject, PersonalProjectTechnology


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalProjectTechnology
        fields = ['name']


class PersonalProjectSerializer(serializers.ModelSerializer):
    technologies  = TechnologySerializer(many=True, read_only=True)
    media_image_url = serializers.SerializerMethodField()

    class Meta:
        model = PersonalProject
        fields = [
            'id', 'slug', 'title', 'tagline', 'description',
            'status', 'color', 'year',
            'github_url', 'live_url', 'demo_url',
            'media_type', 'media_image_url', 'media_video_url',
            'technologies',
        ]

    def get_media_image_url(self, obj):
        if not obj.media_image:
            return None
        request = self.context.get('request')
        url = obj.media_image.url
        return request.build_absolute_uri(url) if request else url
