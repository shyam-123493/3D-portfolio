from django.db import models


class SiteSettings(models.Model):
    name = models.CharField(max_length=100, default='Ghanshyam Desale')
    tagline = models.TextField(default='Engineering high-performance digital products.')
    email = models.EmailField(default='ghanshyamdesale1421@gmail.com')
    phone = models.CharField(max_length=20, default='+91 7498770064')
    location = models.CharField(max_length=100, default='Mumbai, India')
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    resume_file = models.FileField(upload_to='resume/', blank=True, null=True)
    years_experience = models.PositiveSmallIntegerField(default=3)
    available_for_work = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return f'Site Settings — {self.name}'

    def save(self, *args, **kwargs):
        # Singleton pattern
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
