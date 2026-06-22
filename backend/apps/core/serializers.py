from rest_framework import serializers
from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'name', 'tagline', 'email', 'phone', 'location',
            'linkedin_url', 'github_url', 'resume_url',
            'years_experience', 'available_for_work',
        ]

    def get_resume_url(self, obj):
        request = self.context.get('request')
        if obj.resume_file and request:
            return request.build_absolute_uri(obj.resume_file.url)
        return None
