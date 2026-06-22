from django.contrib import admin
from .models import Experience


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('date', 'title', 'organization', 'entry_type', 'order')
    list_editable = ('order',)
    list_filter = ('entry_type',)
    search_fields = ('title', 'organization', 'description')
    ordering = ('order',)
    fieldsets = (
        ('Entry', {
            'fields': ('date', 'title', 'organization', 'entry_type', 'order'),
        }),
        ('Content', {
            'fields': ('description', 'tags'),
        }),
    )
