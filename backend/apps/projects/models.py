from django.db import models
from django.utils.text import slugify


class TechnologyCategory(models.TextChoices):
    FRONTEND = 'frontend', 'Frontend'
    BACKEND = 'backend', 'Backend'
    INFRA = 'infra', 'Infrastructure'
    ANALYTICS = 'analytics', 'Analytics'
    MOBILE = 'mobile', 'Mobile'
    TOOLING = 'tooling', 'Tooling'


class Project(models.Model):
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=200)
    role = models.CharField(max_length=100)
    domain = models.CharField(max_length=200)
    description = models.TextField()
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#00D4FF', help_text='Hex color code')
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProjectContribution(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contributions')
    text = models.TextField()
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.project.title} — {self.text[:60]}'


class ProjectTechnology(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='technologies')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=TechnologyCategory.choices, default=TechnologyCategory.FRONTEND)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Project Technologies'

    def __str__(self):
        return f'{self.project.title} — {self.name}'


class ProjectArchitectureLayer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='architecture_layers')
    label = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#00D4FF')
    items = models.JSONField(default=list, help_text='List of strings')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.project.title} — {self.label}'
