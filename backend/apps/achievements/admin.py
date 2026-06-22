from django.contrib import admin
from .models import Achievement, Certification


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'highlight', 'order')
    list_editable = ('order',)
    list_filter = ('category',)
    search_fields = ('title', 'description', 'highlight')
    ordering = ('order',)
    fieldsets = (
        ('Achievement', {'fields': ('title', 'category', 'highlight', 'order')}),
        ('Content', {'fields': ('description',)}),
    )


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'date', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'issuer')
    ordering = ('order',)
    fieldsets = (
        ('Certification', {'fields': ('title', 'issuer', 'date', 'order')}),
        ('Link', {'fields': ('credential_url',), 'classes': ('collapse',)}),
    )
