from django.db import models
from django.utils.text import slugify


class PersonalProject(models.Model):
    STATUS_CHOICES = [
        ('live',     'Live'),
        ('wip',      'In Progress'),
        ('archived', 'Archived'),
    ]
    MEDIA_TYPE_CHOICES = [
        ('none',  'No media'),
        ('image', 'Image upload'),
        ('video', 'Video URL'),
    ]

    slug          = models.SlugField(unique=True, blank=True)
    title         = models.CharField(max_length=200)
    tagline       = models.CharField(max_length=300, help_text='Short one-liner shown under the title')
    description   = models.TextField()
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='live')
    color         = models.CharField(max_length=7, default='#6FE3D2', help_text='Hex accent colour, e.g. #6FE3D2')
    year          = models.PositiveSmallIntegerField(default=2025)

    github_url    = models.URLField(blank=True)
    live_url      = models.URLField(blank=True)
    demo_url      = models.URLField(blank=True)

    media_type      = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='none')
    media_image     = models.ImageField(upload_to='personal_projects/', blank=True, null=True,
                                        help_text='Upload a screenshot or banner (media_type must be "image")')
    media_video_url = models.URLField(blank=True,
                                      help_text='Direct .mp4 URL (media_type must be "video")')

    order      = models.PositiveSmallIntegerField(default=0, help_text='Lower = shown first')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-year']
        verbose_name = 'Personal Project'
        verbose_name_plural = 'Personal Projects'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class PersonalProjectTechnology(models.Model):
    project = models.ForeignKey(PersonalProject, on_delete=models.CASCADE, related_name='technologies')
    name    = models.CharField(max_length=100)
    order   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Technology'
        verbose_name_plural = 'Technologies'

    def __str__(self):
        return f'{self.project.title} — {self.name}'
