from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.core.models import SiteSettings
from apps.projects.models import Project


class Command(BaseCommand):
    help = (
        'Load fixtures/initial_data.json only when the database is empty. '
        'Runs at container start so a fresh database gets content, while an '
        'existing one is left alone — the Django admin is the source of truth '
        'for live content, and an unconditional loaddata would resurrect rows '
        'deleted through the admin on every deploy.'
    )

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true',
                            help='Load the fixture even if content already exists '
                                 '(overwrites rows sharing the fixture\'s primary keys).')

    def handle(self, *args, **options):
        has_content = Project.objects.exists() or SiteSettings.objects.exists()
        if has_content and not options['force']:
            self.stdout.write('Database already has content — skipping fixture load (use --force to reload).')
            return
        call_command('loaddata', 'fixtures/initial_data.json')
        self.stdout.write(self.style.SUCCESS('Fixture loaded.'))
