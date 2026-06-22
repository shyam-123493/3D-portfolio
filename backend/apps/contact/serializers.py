from rest_framework import serializers
from .models import ContactSubmission


class ContactSubmissionSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'company', 'message', 'website']
        extra_kwargs = {
            'company': {'required': False, 'allow_blank': True},
        }

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Name must be at least 2 characters.')
        return value.strip()

    def validate_message(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError('Message must be at least 20 characters.')
        return value.strip()

    def validate(self, attrs):
        # Honeypot — silently mark as spam if website field filled
        if attrs.get('website'):
            attrs['is_spam'] = True
        attrs.pop('website', None)
        return attrs

    def create(self, validated_data):
        is_spam = validated_data.pop('is_spam', False)
        instance = ContactSubmission.objects.create(**validated_data, is_spam=is_spam)
        return instance
