from django.contrib import admin
from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'location', 'available_for_work', 'updated_at')
    fieldsets = (
        ('Identity', {'fields': ('name', 'tagline', 'years_experience', 'available_for_work')}),
        ('Contact', {'fields': ('email', 'phone', 'location')}),
        ('Links', {'fields': ('linkedin_url', 'github_url', 'resume_file')}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
