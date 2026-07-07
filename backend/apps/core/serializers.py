import re
from datetime import date

from rest_framework import serializers

from apps.experience.models import Experience
from .models import SiteSettings

_MONTHS = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
}


def _parse_entry_date(raw):
    """Best-effort parse of the free-text Experience.date field.

    Handles "Aug 2022", "August 2022" and bare "2022" (assumed January).
    Returns None when nothing parseable is found.
    """
    m = re.search(r'([a-z]{3,9})\.?\s+(\d{4})', raw, re.IGNORECASE)
    if m:
        month = _MONTHS.get(m.group(1).lower()[:3])
        if month:
            return date(int(m.group(2)), month, 1)
    m = re.search(r'\d{4}', raw)
    if m:
        return date(int(m.group()), 1, 1)
    return None


def compute_years_experience():
    """Full years elapsed since the earliest work-type timeline entry.

    Derived from the Experience table so adding/removing entries in the
    admin or fixtures updates the number everywhere it is displayed.
    Returns None when no work entry has a parseable date.
    """
    starts = [
        parsed
        for raw in Experience.objects.filter(entry_type='work').values_list('date', flat=True)
        if (parsed := _parse_entry_date(raw))
    ]
    if not starts:
        return None
    days = (date.today() - min(starts)).days
    return max(int(days / 365.25), 0)


class SiteSettingsSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    years_experience = serializers.SerializerMethodField()

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

    def get_years_experience(self, obj):
        computed = compute_years_experience()
        # Stored value acts as the fallback until work entries exist
        return computed if computed is not None else obj.years_experience
