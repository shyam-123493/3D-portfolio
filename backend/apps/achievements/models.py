from django.db import models


class AchievementCategory(models.TextChoices):
    TECHNICAL = 'technical', 'Technical'
    DELIVERY = 'delivery', 'Delivery'
    ANALYTICS = 'analytics', 'Analytics'
    ARCHITECTURE = 'architecture', 'Architecture'
    COLLABORATION = 'collaboration', 'Collaboration'


class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=AchievementCategory.choices)
    highlight = models.CharField(max_length=100, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Certification(models.Model):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=100)
    date = models.CharField(max_length=50)
    credential_url = models.URLField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.title} — {self.issuer}'
