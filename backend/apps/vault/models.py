from django.db import models
from django.utils.text import slugify


class VaultSection(models.Model):
    slug  = models.SlugField(unique=True, blank=True,
                              help_text='Auto-filled from label. Used as the tab id.')
    label = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='📁')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Vault Section'
        verbose_name_plural = 'Vault Sections'

    def __str__(self):
        return f'{self.emoji} {self.label}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.label)
        super().save(*args, **kwargs)


class VaultItem(models.Model):
    section = models.ForeignKey(VaultSection, on_delete=models.CASCADE, related_name='items')
    title   = models.CharField(max_length=200)
    value   = models.CharField(max_length=500, blank=True,
                                help_text='Short copyable value — shortcut key, cert ID, port, etc.')
    url     = models.URLField(blank=True, help_text='Opens in new tab when clicked')
    notes   = models.TextField(blank=True, help_text='Extra hint shown below the title')
    tags    = models.JSONField(default=list,
                               help_text='List of short label strings, e.g. ["Chrome", "Debug"]')
    order   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Vault Item'
        verbose_name_plural = 'Vault Items'

    def __str__(self):
        return f'{self.section.label} › {self.title}'
