from django.contrib import admin
from .models import VaultSection, VaultItem


class VaultItemInline(admin.StackedInline):
    model  = VaultItem
    extra  = 1
    fields = ('title', 'value', 'url', 'notes', 'tags', 'order')


@admin.register(VaultSection)
class VaultSectionAdmin(admin.ModelAdmin):
    list_display  = ('emoji', 'label', 'slug', 'order', 'item_count')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('label',)}
    inlines = [VaultItemInline]

    @admin.display(description='Items')
    def item_count(self, obj):
        return obj.items.count()


@admin.register(VaultItem)
class VaultItemAdmin(admin.ModelAdmin):
    list_display  = ('section', 'title', 'value', 'url', 'order')
    list_filter   = ('section',)
    search_fields = ('title', 'value', 'notes')
    list_editable = ('order',)
