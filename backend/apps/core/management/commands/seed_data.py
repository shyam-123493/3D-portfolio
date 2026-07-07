from django.core.management.base import BaseCommand
from apps.core.models import SiteSettings
from apps.projects.models import Project, ProjectContribution, ProjectTechnology, ProjectArchitectureLayer
from apps.experience.models import Experience
from apps.achievements.models import Achievement, Certification


class Command(BaseCommand):
    help = 'Seed the database with initial portfolio data'

    def handle(self, *args, **kwargs):
        self._seed_settings()
        self._seed_projects()
        self._seed_experience()
        self._seed_achievements()
        self._seed_certifications()
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

    def _seed_settings(self):
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults=dict(
                name='Ghanshyam Desale',
                tagline='Engineering high-performance digital products for fintech and enterprise platforms.',
                email='ghanshyamdesale1421@gmail.com',
                phone='+91 7498770064',
                location='Mumbai, India',
                linkedin_url='https://linkedin.com/in/ghanshyam-desale',
                github_url='https://github.com/shyam-123493',
                years_experience=3,
                available_for_work=True,
            ),
        )
        self.stdout.write('  OK SiteSettings')

    def _seed_projects(self):
        PROJECTS = [
            dict(
                slug='bajaj-finserv-pwa',
                title='Bajaj Finserv Bill Payment Platform',
                role='Angular Developer',
                domain='Fintech · Enterprise PWA',
                description=(
                    "Enterprise-scale Angular Progressive Web App for bill payments and financial services, "
                    "handling complex offline scenarios, native bridge integrations, and high-fidelity analytics "
                    "for one of India's leading fintech platforms."
                ),
                challenge=(
                    'Maintaining analytics continuity across Angular PWA, native Android, and iOS app contexts '
                    'while handling complex offline/online state transitions for payment flows.'
                ),
                solution=(
                    'Designed a bridge-aware event schema that serializes analytics payloads before handoff, '
                    'with a local queue that flushes when connectivity is restored.'
                ),
                color='#00D4FF',
                featured=True,
                order=1,
                contributions=[
                    'Built scalable Angular PWA features aligned with fintech compliance requirements',
                    'Implemented offline storage and caching architecture using IndexedDB for resilient payment flows',
                    'Engineered hybrid communication layer between Angular PWA and native Android/iOS apps via JS bridge',
                    'Led Autopay Module development end-to-end — from requirement analysis to production release',
                    'Instrumented CleverTap, GA4, and GTM analytics with precisely designed event payloads',
                    'Improved performance through lazy loading, route-based code splitting, and strategic caching',
                    'Implemented AWS S3 deployment pipeline with dynamic environment and version loading',
                ],
                technologies=[
                    ('Angular', 'frontend'), ('TypeScript', 'frontend'), ('PWA', 'frontend'),
                    ('IndexedDB', 'frontend'), ('CleverTap', 'analytics'), ('GA4', 'analytics'),
                    ('GTM', 'analytics'), ('AWS S3', 'infra'), ('REST APIs', 'backend'), ('CI/CD', 'tooling'),
                ],
                architecture=[
                    ('Angular PWA Layer', ['Service Worker', 'IndexedDB Cache', 'App Shell'], '#00D4FF', 0),
                    ('Native Bridge', ['Android JS Bridge', 'iOS WKWebView Bridge', 'Event Bus'], '#0EA5E9', 1),
                    ('Analytics', ['CleverTap SDK', 'GA4', 'GTM Datastream'], '#F59E0B', 2),
                    ('Infrastructure', ['AWS S3', 'CloudFront CDN', 'Dynamic Config'], '#10B981', 3),
                ],
            ),
            dict(
                slug='merchant-platform',
                title='Merchant Platform',
                role='Angular Developer',
                domain='Merchant Onboarding · Payment Management',
                description='End-to-end merchant onboarding and payment management platform with complex business validation workflows, reusable component libraries, and secure API integrations.',
                challenge='Standardizing diverse merchant onboarding flows with complex validation rules across different merchant categories.',
                solution='Abstracted business rules into a configurable validation engine with a reusable form component library that adapts to merchant type.',
                color='#7C3AED',
                featured=True,
                order=2,
                contributions=[
                    'Developed merchant onboarding workflows handling multi-step validation',
                    'Built complete payment journey flows with secure REST API integration',
                    'Implemented complex business validation rules with real-time feedback',
                    'Created reusable Angular UI component library shared across multiple product modules',
                ],
                technologies=[
                    ('Angular', 'frontend'), ('TypeScript', 'frontend'), ('JavaScript', 'frontend'),
                    ('REST APIs', 'backend'), ('HTML/CSS', 'frontend'), ('Git', 'tooling'),
                ],
                architecture=[],
            ),
            dict(
                slug='branches-platform',
                title='Branches Platform',
                role='Angular Developer',
                domain='Bill Payment · Service Management',
                description='Branch-based bill payment and service management platform with dynamic configuration, version-controlled feature rollouts, and optimized navigation.',
                challenge='Managing feature parity and version consistency across hundreds of branches with different configuration requirements.',
                solution='Built a dynamic configuration loader that fetches branch-specific feature flags and version manifests at runtime.',
                color='#10B981',
                featured=False,
                order=3,
                contributions=[
                    'Developed branch-based biller and payment feature modules',
                    'Implemented dynamic configuration and version loading for branch-specific rollouts',
                    'Optimized Angular routing and navigation performance for large branch networks',
                ],
                technologies=[
                    ('Angular', 'frontend'), ('TypeScript', 'frontend'), ('REST APIs', 'backend'),
                    ('Angular Router', 'frontend'), ('Dynamic Config', 'infra'), ('Git', 'tooling'),
                ],
                architecture=[],
            ),
            dict(
                slug='myashiyana',
                title='MyAshiyana Management System',
                role='Angular Developer',
                domain='Society Management · Resident Services',
                description='Comprehensive society management platform for resident management, facility tracking, and real-time service coordination.',
                challenge='Providing real-time facility status and resident communication in a system serving multi-tower residential complexes.',
                solution='Implemented polling-based real-time updates with optimistic UI updates and smart cache invalidation.',
                color='#F59E0B',
                featured=False,
                order=4,
                contributions=[
                    'Developed resident management components for profile, facilities, and service requests',
                    'Integrated REST APIs with proper pagination, error handling, and state management',
                    'Built facility status tracking with real-time update capabilities',
                ],
                technologies=[
                    ('Angular', 'frontend'), ('JavaScript', 'frontend'), ('REST APIs', 'backend'),
                    ('HTML/CSS', 'frontend'), ('Git', 'tooling'),
                ],
                architecture=[],
            ),
            dict(
                slug='web-platform-enhancements',
                title='Web Platform Enhancements',
                role='Angular Developer',
                domain='Performance · Architecture · DX',
                description=(
                    'Cross-cutting platform improvements spanning IndexedDB offline architecture, '
                    'performance optimization, and developer experience enhancements across multiple Angular products.'
                ),
                challenge=(
                    'Improving page load times, offline reliability, and codebase maintainability across '
                    'products without disrupting ongoing feature development.'
                ),
                solution=(
                    'Introduced a shared IndexedDB abstraction layer, lazy-loading strategies, and '
                    'component library standards that were adopted across all Angular projects.'
                ),
                color='#10B981',
                featured=False,
                order=5,
                contributions=[
                    'Architected IndexedDB offline-first data layer reused across multiple products',
                    'Implemented Angular route-level lazy loading reducing initial bundle size significantly',
                    'Established shared component library standards and documentation',
                    'Optimized Angular change detection with OnPush strategy across critical views',
                    'Introduced automated linting and formatting pipelines for consistent code quality',
                ],
                technologies=[
                    ('Angular', 'frontend'), ('TypeScript', 'frontend'), ('IndexedDB', 'frontend'),
                    ('RxJS', 'frontend'), ('Webpack', 'tooling'), ('ESLint', 'tooling'), ('Git', 'tooling'),
                ],
                architecture=[],
            ),
        ]

        for data in PROJECTS:
            contributions = data.pop('contributions')
            technologies = data.pop('technologies')
            architecture = data.pop('architecture')

            project, _ = Project.objects.update_or_create(
                slug=data['slug'],
                defaults={k: v for k, v in data.items() if k != 'slug'},
            )

            ProjectContribution.objects.filter(project=project).delete()
            for i, text in enumerate(contributions):
                ProjectContribution.objects.create(project=project, text=text, order=i)

            ProjectTechnology.objects.filter(project=project).delete()
            for i, (name, cat) in enumerate(technologies):
                ProjectTechnology.objects.create(project=project, name=name, category=cat, order=i)

            ProjectArchitectureLayer.objects.filter(project=project).delete()
            for label, items, color, order in architecture:
                ProjectArchitectureLayer.objects.create(
                    project=project, label=label, items=items, color=color, order=order,
                )

        self.stdout.write(f'  OK {len(PROJECTS)} Projects')

    def _seed_experience(self):
        ENTRIES = [
            dict(date='May 2022', title='B.E. Mechanical Engineering', organization='Shri Gulabrao Deokar College of Engineering', description='Graduated with CGPA 7.96. Strong analytical and systems-thinking foundation.', entry_type='education', tags=['CGPA 7.96', 'Systems Thinking'], order=1),
            dict(date='2022', title='Full Stack Developer Training', organization='', description='Intensive training covering frontend, backend, databases, and deployment practices.', entry_type='achievement', tags=['HTML/CSS', 'JavaScript', 'React', 'Node.js'], order=2),
            dict(date='Aug 2022', title='Angular Developer', organization='KSW Technologies', description='First professional role building Angular applications, REST API integrations, and reusable modules.', entry_type='work', tags=['Angular', 'TypeScript', 'REST APIs'], order=3),
            dict(date='Nov 2023', title='Angular Developer', organization='SnapWork Technologies', description="Leading Angular PWA development for Bajaj Finserv's bill payment platform. Autopay module, IndexedDB, native bridge, analytics.", entry_type='work', tags=['PWA', 'Fintech', 'IndexedDB', 'Analytics', 'AWS S3'], order=4),
            dict(date='2024 →', title='Enterprise Fintech · PWA · Analytics', organization='', description='Deep specialization in fintech PWA development — offline-first, analytics event design, native hybrid apps.', entry_type='achievement', tags=['CleverTap', 'GA4', 'GTM', 'Native Bridge', 'Enterprise Angular'], order=5),
            dict(date='Future', title='Full-Stack Systems · AI Engineering', organization='', description='Expanding into full-stack architecture, RAG systems, AI agents, cloud infrastructure.', entry_type='future', tags=['RAG', 'LangGraph', 'Cloud Architecture', 'AI Agents', 'MCP'], order=6),
        ]
        Experience.objects.all().delete()
        for e in ENTRIES:
            Experience.objects.create(**e)
        self.stdout.write(f'  OK {len(ENTRIES)} Experience entries')

    def _seed_achievements(self):
        ITEMS = [
            dict(title='Led Autopay Module — End-to-End', description='Owned the complete delivery of the Autopay module for Bajaj Finserv from requirements to production.', category='delivery', highlight='Full ownership from spec to production', order=1),
            dict(title='IndexedDB Offline Architecture', description='Designed and implemented the IndexedDB caching layer enabling resilient offline-first payment flows.', category='architecture', highlight='Resilient offline payments infrastructure', order=2),
            dict(title='Multi-Platform Analytics Instrumentation', description='Implemented CleverTap, GA4, and GTM tracking across PWA and native bridge surfaces with a unified event schema.', category='analytics', highlight='CleverTap · GA4 · GTM across platforms', order=3),
            dict(title='Reusable Angular Component Libraries', description='Built and maintained internal Angular libraries used across multiple product modules.', category='technical', highlight='Shared libraries across product surfaces', order=4),
            dict(title='Client Communication & Requirements', description='Managed direct client communication for requirements gathering and delivery updates.', category='collaboration', highlight='Engineering × Product bridge', order=5),
            dict(title='Production Releases & Sprint Delivery', description='Supported sprint planning, production release cycles, and delivery timeline management.', category='delivery', highlight='Fintech-grade delivery cadence', order=6),
            dict(title='Analytics Accuracy Improvement', description='Identified and resolved event tracking gaps across user journeys, improving analytics accuracy.', category='analytics', highlight='Data quality for product decisions', order=7),
        ]
        Achievement.objects.all().delete()
        for a in ITEMS:
            Achievement.objects.create(**a)
        self.stdout.write(f'  OK {len(ITEMS)} Achievements')

    def _seed_certifications(self):
        CERTS = [
            dict(title='Java Fundamentals', issuer='IBM', date='2022', credential_url='', order=1),
            dict(title='Full Stack Developer Certification', issuer='I.T Vedant Institute', date='2022', credential_url='', order=2),
        ]
        Certification.objects.all().delete()
        for c in CERTS:
            Certification.objects.create(**c)
        self.stdout.write(f'  OK {len(CERTS)} Certifications')
