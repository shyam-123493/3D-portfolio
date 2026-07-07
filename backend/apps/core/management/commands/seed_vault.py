from django.core.management.base import BaseCommand

from apps.vault.models import VaultSection, VaultItem

# Bootstrap content only — the vault is edited live through the UI, so this
# command must never overwrite an existing vault. That is also why vault data
# is NOT in fixtures/initial_data.json: loaddata runs on every boot and would
# resurrect items the user deleted.
SECTIONS = [
    dict(slug='extensions', label='Extensions', emoji='🧩', order=1, items=[
        dict(title='Redux DevTools', url='https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd', tags=['Chrome', 'React', 'Debug']),
        dict(title='React Developer Tools', url='https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi', tags=['Chrome', 'React']),
        dict(title='Angular DevTools', url='https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh', tags=['Chrome', 'Angular']),
        dict(title='Wappalyzer', url='https://www.wappalyzer.com/', tags=['Chrome', 'Recon'], notes='Detect tech stack of any site'),
        dict(title='JSON Formatter', url='https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa', tags=['Chrome', 'API']),
        dict(title='Pesticide', url='https://chrome.google.com/webstore/detail/pesticide-for-chrome-with/neonnmdfbnmpaldkpadhljgklajlmhkc', tags=['Chrome', 'CSS', 'Debug'], notes='Outline all elements for layout debugging'),
        dict(title='VisBug', url='https://chrome.google.com/webstore/detail/visbug/cdockenadnadldjbbgcallicgledbeoc', tags=['Chrome', 'Design'], notes='Design tools directly in the browser'),
        dict(title='uBlock Origin', url='https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm', tags=['Chrome', 'Privacy']),
    ]),
    dict(slug='certs', label='Certificates', emoji='📜', order=2, items=[
        dict(title='Java Fundamentals', value='IBM — 2022', tags=['Java', 'IBM']),
        dict(title='Full Stack Developer Certification', value='I.T Vedant Institute — 2022', tags=['Full Stack']),
    ]),
    dict(slug='shortcuts', label='Shortcuts', emoji='⌨️', order=3, items=[
        dict(title='VS Code — Format Document', value='Shift + Alt + F', tags=['VSCode']),
        dict(title='VS Code — Open Terminal', value='Ctrl + `', tags=['VSCode']),
        dict(title='VS Code — Multi-cursor', value='Ctrl + Alt + ↑/↓', tags=['VSCode']),
        dict(title='VS Code — Rename Symbol', value='F2', tags=['VSCode']),
        dict(title='VS Code — Go to Definition', value='F12', tags=['VSCode']),
        dict(title='VS Code — Quick Fix', value='Ctrl + .', tags=['VSCode']),
        dict(title='VS Code — Toggle Sidebar', value='Ctrl + B', tags=['VSCode']),
        dict(title='Chrome — Open DevTools', value='F12 / Ctrl+Shift+I', tags=['Chrome']),
        dict(title='Chrome — Network tab throttle', value='DevTools → Network', tags=['Chrome']),
        dict(title='Git — Amend last commit msg', value='git commit --amend', tags=['Git']),
        dict(title='Git — Stash with message', value='git stash push -m "msg"', tags=['Git']),
        dict(title='Git — Interactive rebase', value='git rebase -i HEAD~N', tags=['Git']),
        dict(title='Windows — Snap left/right', value='Win + ←/→', tags=['Windows']),
        dict(title='Windows — Virtual desktop', value='Win + Ctrl + D', tags=['Windows']),
    ]),
    dict(slug='repos', label='Git Repos', emoji='📦', order=4, items=[
        dict(title='3D Portfolio', url='https://github.com/shyam-123493', value='main', notes='This project — React + Django', tags=['Personal']),
    ]),
    dict(slug='links', label='Links', emoji='🔗', order=5, items=[
        dict(title='TailwindCSS Docs', url='https://tailwindcss.com/docs', tags=['CSS']),
        dict(title='React Three Fiber', url='https://docs.pmnd.rs/react-three-fiber', tags=['3D']),
        dict(title='Framer Motion API', url='https://www.framer.com/motion/', tags=['Animation']),
        dict(title='GSAP Docs', url='https://gsap.com/docs/v3/', tags=['Animation']),
        dict(title='Three.js Examples', url='https://threejs.org/examples/', tags=['3D']),
        dict(title='Lucide Icons', url='https://lucide.dev/icons/', tags=['Icons']),
        dict(title='Coolors Palette', url='https://coolors.co/', tags=['Design']),
        dict(title='Can I Use', url='https://caniuse.com/', tags=['CSS']),
        dict(title='Bundlephobia', url='https://bundlephobia.com/', tags=['Perf']),
        dict(title='regex101', url='https://regex101.com/', tags=['Tools']),
        dict(title='JWT Decoder', url='https://jwt.io/', tags=['Auth', 'Tools']),
        dict(title='TanStack Query Docs', url='https://tanstack.com/query/latest/docs', tags=['React']),
        dict(title='Zustand Docs', url='https://docs.pmnd.rs/zustand/getting-started/introduction', tags=['React']),
        dict(title='MDN Web Docs', url='https://developer.mozilla.org/', tags=['Reference']),
        dict(title='shadcn/ui Components', url='https://ui.shadcn.com/docs/components', tags=['UI']),
    ]),
    dict(slug='notes', label='Notes', emoji='📝', order=6, items=[
        dict(title='Local dev ports', value='Frontend: 5173 | Backend: 8000', notes='npm run dev  |  python manage.py runserver 0.0.0.0:8000', tags=['Dev']),
        dict(title='Render deploy', notes='Push to main → Render auto-deploys backend', tags=['Deploy']),
        dict(title='Vercel deploy', notes='Push to main → Vercel auto-deploys frontend', tags=['Deploy']),
    ]),
]


class Command(BaseCommand):
    help = 'Seed the vault with starter sections/items — skipped when the vault already has sections.'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true',
                            help='Delete existing vault content and reseed.')

    def handle(self, *args, **options):
        if VaultSection.objects.exists():
            if not options['force']:
                self.stdout.write('Vault already has sections — skipping (use --force to reseed).')
                return
            VaultSection.objects.all().delete()

        for section_data in SECTIONS:
            items = section_data.pop('items')
            section = VaultSection.objects.create(**section_data)
            for order, item in enumerate(items):
                VaultItem.objects.create(section=section, order=order, **item)
            self.stdout.write(f'  OK {section.emoji} {section.label} — {len(items)} items')
        self.stdout.write(self.style.SUCCESS('Vault seeded.'))
