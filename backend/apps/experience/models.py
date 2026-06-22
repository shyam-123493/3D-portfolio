from django.db import models


class EntryType(models.TextChoices):
    EDUCATION = 'education', 'Education'
    WORK = 'work', 'Work'
    ACHIEVEMENT = 'achievement', 'Achievement'
    FUTURE = 'future', 'Roadmap'


class Experience(models.Model):
    date = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    entry_type = models.CharField(max_length=20, choices=EntryType.choices, default=EntryType.WORK)
    tags = models.JSONField(default=list, help_text='List of tag strings')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Experience Entries'

    def __str__(self):
        return f'{self.date} — {self.title}'
