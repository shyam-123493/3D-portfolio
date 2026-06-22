import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, MapPin, Mail, Phone, Linkedin, Github, CheckCircle2 } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { Link001 } from '@/components/ui/skiper-ui/skiper40'
import { useSiteSettings, useProjects, useAchievements } from '@/hooks/usePortfolioData'
import { Skeleton } from '@/components/ui/Skeleton'

const WORK_HISTORY = [
  {
    title: 'Angular Developer',
    org: 'SnapWork Technologies',
    period: 'Nov 2023 – Present',
    highlights: [
      'Led Autopay Module from spec to production for Bajaj Finserv PWA',
      'Implemented IndexedDB offline storage architecture for payment flows',
      'Built CleverTap, GA4, and GTM analytics across PWA and native bridge',
      'Engineered Angular PWA ↔ Android/iOS native bridge communication',
      'Managed AWS S3 deployment with dynamic environment/version loading',
    ],
  },
  {
    title: 'Angular Developer',
    org: 'KSW Technologies',
    period: 'Aug 2022 – Nov 2023',
    highlights: [
      'Built merchant onboarding and payment workflows',
      'Developed branch-based bill payment and service management features',
      'Created reusable Angular component libraries',
      'Integrated REST APIs and managed production releases',
    ],
  },
]

const CORE_SKILLS = [
  'Angular 14+', 'TypeScript', 'PWA / Service Workers', 'IndexedDB',
  'RxJS', 'CleverTap / GA4 / GTM', 'REST APIs', 'AWS S3',
  'Git / CI/CD', 'Native Bridge (Android/iOS)', 'Lazy Loading', 'Performance Optimization',
]

export function RecruiterView() {
  const { recruiterViewOpen, setRecruiterViewOpen } = useUIStore()
  const { data: settings, isLoading: loadingSettings } = useSiteSettings()
  const { data: projects } = useProjects()
  const { data: achievements } = useAchievements()

  useEffect(() => {
    if (recruiterViewOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [recruiterViewOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setRecruiterViewOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setRecruiterViewOpen])

  const email = settings?.email ?? ''
  const phone = settings?.phone ?? ''
  const location = settings?.location ?? ''
  const linkedinUrl = settings?.linkedinUrl ?? '#'
  const githubUrl = settings?.githubUrl ?? '#'
  const resumeUrl = settings?.resumeUrl ?? '/resume-ghanshyam-desale.pdf'
  const name = settings?.name ?? 'Ghanshyam Desale'

  const featuredProjects = projects?.filter((p) => p.featured) ?? []

  return (
    <AnimatePresence>
      {recruiterViewOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-bg-primary/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRecruiterViewOpen(false)}
            aria-hidden="true"
          />

          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-bg-secondary border-l border-border-subtle overflow-y-auto custom-scrollbar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter summary view"
          >
            <div className="sticky top-0 z-10 bg-bg-secondary border-b border-border-subtle p-6 flex items-center justify-between">
              <div>
                <p className="label-mono mb-0.5">Recruiter View</p>
                <h2 className="font-display font-bold text-lg text-text-primary">Candidate Summary</h2>
              </div>
              <button
                onClick={() => setRecruiterViewOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
                aria-label="Close recruiter view"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Identity */}
              <div className="surface-card p-6">
                {loadingSettings ? (
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-display font-bold text-2xl text-text-primary mb-1">{name}</h3>
                    <p className="text-accent-teal font-medium mb-4">Angular Developer · Fintech Engineer · Full-Stack AI Explorer</p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">
                      3+ years of professional experience building enterprise-scale Angular applications for India's leading fintech platforms.
                      Specialized in Progressive Web Apps, offline-first architectures, analytics instrumentation, and native bridge integrations.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {email && (
                        <Link001 href={`mailto:${email}`} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
                          <Mail size={14} className="text-accent-teal" /> {email}
                        </Link001>
                      )}
                      {phone && (
                        <Link001 href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
                          <Phone size={14} className="text-accent-teal" /> {phone}
                        </Link001>
                      )}
                      {location && (
                        <span className="flex items-center gap-2 text-text-muted">
                          <MapPin size={14} className="text-accent-teal" /> {location}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Experience */}
              <div>
                <p className="label-mono mb-4">Experience</p>
                <div className="space-y-4">
                  {WORK_HISTORY.map((job, i) => (
                    <div key={i} className="surface-card p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-text-primary">{job.title}</h4>
                          <p className="text-text-muted text-sm">{job.org}</p>
                        </div>
                        <span className="font-mono text-xs text-text-muted whitespace-nowrap">{job.period}</span>
                      </div>
                      <ul className="space-y-2">
                        {job.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle2 size={13} className="text-accent-teal flex-shrink-0 mt-0.5" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Projects */}
              {featuredProjects.length > 0 && (
                <div>
                  <p className="label-mono mb-4">Key Projects</p>
                  <div className="space-y-3">
                    {featuredProjects.map((p) => (
                      <div key={p.slug} className="surface-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <h4 className="font-semibold text-text-primary text-sm">{p.title}</h4>
                        </div>
                        <p className="text-text-muted text-xs mb-2">{p.domain}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.technologies.slice(0, 6).map((t) => (
                            <span key={t.name} className="font-mono text-[9px] text-text-muted border border-border-subtle rounded px-1.5 py-0.5">{t.name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements highlights */}
              {achievements && achievements.length > 0 && (
                <div>
                  <p className="label-mono mb-4">Key Achievements</p>
                  <div className="space-y-2">
                    {achievements.slice(0, 4).map((a) => (
                      <div key={a.id} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 size={13} className="text-accent-teal flex-shrink-0 mt-0.5" />
                        <span><strong className="text-text-primary">{a.title}</strong> — {a.highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core skills */}
              <div>
                <p className="label-mono mb-4">Core Skills</p>
                <div className="grid grid-cols-2 gap-2">
                  {CORE_SKILLS.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1 h-1 rounded-full bg-accent-teal flex-shrink-0" />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="surface-card p-5">
                <p className="label-mono mb-3">Education</p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm">B.E. Mechanical Engineering</h4>
                    <p className="text-text-muted text-xs">Shri Gulabrao Deokar College of Engineering</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-accent-amber">CGPA 7.96</p>
                    <p className="font-mono text-xs text-text-muted">May 2022</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <a href={resumeUrl} download className="btn-primary flex-1 justify-center">
                  <Download size={15} /> Download Resume
                </a>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary gap-2">
                  <Linkedin size={15} /> LinkedIn
                </a>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary gap-2">
                  <Github size={15} />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
