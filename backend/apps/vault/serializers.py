from rest_framework import serializers
from .models import VaultSection, VaultItem


class VaultItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaultItem
        fields = ['id', 'title', 'value', 'url', 'notes', 'tags', 'order']


class VaultSectionSerializer(serializers.ModelSerializer):
    items = VaultItemSerializer(many=True, read_only=True)

    class Meta:
        model = VaultSection
        fields = ['id', 'slug', 'label', 'emoji', 'order', 'items']
