from django.contrib import admin
from .models import Project, ProjectContribution, ProjectTechnology, ProjectArchitectureLayer


class ProjectContributionInline(admin.TabularInline):
    model = ProjectContribution
    extra = 1
    fields = ('text', 'order')


class ProjectTechnologyInline(admin.TabularInline):
    model = ProjectTechnology
    extra = 2
    fields = ('name', 'category', 'order')


class ProjectArchitectureLayerInline(admin.StackedInline):
    model = ProjectArchitectureLayer
    extra = 0
    fields = ('label', 'color', 'items', 'order')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'role', 'domain', 'featured', 'order', 'updated_at')
    list_editable = ('featured', 'order')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'domain')
    list_filter = ('featured',)
    inlines = [ProjectContributionInline, ProjectTechnologyInline, ProjectArchitectureLayerInline]
    fieldsets = (
        ('Identity', {'fields': ('title', 'slug', 'role', 'domain', 'color', 'featured', 'order')}),
        ('Content', {'fields': ('description', 'challenge', 'solution')}),
        ('Links', {'fields': ('github_url', 'live_url')}),
    )
