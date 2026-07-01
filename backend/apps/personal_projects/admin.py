from django.contrib import admin
from django.utils.html import format_html
from .models import PersonalProject, PersonalProjectTechnology


class TechnologyInline(admin.TabularInline):
    model = PersonalProjectTechnology
    extra = 3
    fields = ('name', 'order')


@admin.register(PersonalProject)
class PersonalProjectAdmin(admin.ModelAdmin):
    list_display  = ('title', 'tagline', 'status', 'year', 'color_swatch', 'order', 'updated_at')
    list_editable = ('status', 'order')
    list_filter   = ('status', 'year')
    search_fields = ('title', 'tagline', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TechnologyInline]

    fieldsets = (
        ('Identity', {
            'fields': ('title', 'slug', 'tagline', 'color', 'status', 'year', 'order'),
        }),
        ('Content', {
            'fields': ('description',),
        }),
        ('Media', {
            'description': 'Choose media_type first, then upload image OR paste video URL.',
            'fields': ('media_type', 'media_image', 'media_video_url'),
        }),
        ('Links', {
            'fields': ('github_url', 'live_url', 'demo_url'),
        }),
    )

    @admin.display(description='Colour')
    def color_swatch(self, obj):
        return format_html(
            '<span style="display:inline-block;width:18px;height:18px;border-radius:4px;'
            'background:{};border:1px solid #0003;vertical-align:middle"></span> {}',
            obj.color, obj.color,
        )
