import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, ExternalLink, ChevronDown } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectDetail } from './ProjectDetail'
import { useProjects } from '@/hooks/usePortfolioData'
import { useSceneStore } from '@/stores/sceneStore'
import type { Project } from '@/types'

const ProjectUniverseScene = lazy(() =>
  import('@/three/scenes/ProjectUniverseScene').then((m) => ({
    default: m.ProjectUniverseScene,
  })),
)

const PROJECT_ACCENTS: Record<string, { color: string; glow: string; band: string }> = {
  'bajaj-finserv-pwa':         { color: '#6FE3D2', glow: 'rgba(111,227,210,0.12)', band: 'rgba(111,227,210,0.07)' },
  'merchant-platform':         { color: '#8B7DFF', glow: 'rgba(139,125,255,0.12)', band: 'rgba(139,125,255,0.07)' },
  'branches-platform':         { color: '#10B981', glow: 'rgba(16,185,129,0.12)',  band: 'rgba(16,185,129,0.07)'  },
  'myashiyana':                { color: '#F59E0B', glow: 'rgba(245,158,11,0.12)',  band: 'rgba(245,158,11,0.07)'  },
  'web-platform-enhancements': { color: '#38BDF8', glow: 'rgba(56,189,248,0.12)', band: 'rgba(56,189,248,0.07)'  },
}
const FALLBACK_ACCENT = { color: '#6FE3D2', glow: 'rgba(111,227,210,0.12)', band: 'rgba(111,227,210,0.07)' }

function ProjectRow({ project, index, total }: { project: Project; index: number; total: number }) {
  const { setSelectedProject } = useSceneStore()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })
  const [open, setOpen] = useState(false)
  const accent = PROJECT_ACCENTS[project.slug] ?? FALLBACK_ACCENT
  const num = String(index + 1).padStart(2, '0')
  const isLast = index === total - 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Row divider */}
      <div className="h-px w-full" style={{ background: 'var(--c-divider)' }} />

      <motion.div
        className="group w-full text-left py-6 sm:py-8 relative overflow-hidden cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`Toggle details for ${project.title}`}
        whileHover="hovered"
      >
        {/* Hover background wash */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: accent.band }}
          initial={{ opacity: 0 }}
          variants={{ hovered: { opacity: 1 } }}
          transition={{ duration: 0.22 }}
        />
        {/* Left accent stripe */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: accent.color, boxShadow: `0 0 18px ${accent.color}` }}
          initial={{ scaleY: 0, opacity: 0 }}
          variants={{ hovered: { scaleY: 1, opacity: 1 } }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative z-10 flex items-start gap-5 sm:gap-8 pl-4 sm:pl-6">
          {/* Big number */}
          <div className="flex-shrink-0 pt-1">
            <span
              className="font-mono font-bold tabular-nums leading-none"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                color: accent.color,
                textShadow: `0 0 24px ${accent.color}80`,
                letterSpacing: '-0.02em',
              }}
            >
              {num}
            </span>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase border rounded-full px-2.5 py-0.5"
                    style={{ color: accent.color, borderColor: `${accent.color}40`, background: `${accent.color}10` }}
                  >
                    {project.domain}
                  </span>
                  {project.featured && (
                    <span
                      className="font-mono text-[9px] tracking-[0.18em] uppercase rounded-full px-2 py-0.5"
                      style={{ color: 'var(--c-text-muted)', background: 'var(--c-overlay-faint)' }}
                    >
                      Featured
                    </span>
                  )}
                </div>
                <h3
                  className="font-serif italic text-text-primary group-hover:transition-colors duration-200"
                  style={{
                    fontSize: 'clamp(1.2rem, 2.8vw, 2.2rem)',
                    lineHeight: 1.1,
                    color: open ? accent.color : undefined,
                    transition: 'color 0.2s',
                  }}
                >
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Open in detail */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(project.slug) }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-wide transition-all duration-200"
                  style={{
                    color: accent.color,
                    border: `1px solid ${accent.color}40`,
                    background: `${accent.color}08`,
                  }}
                  aria-label={`Full case study for ${project.title}`}
                >
                  <ExternalLink size={10} />
                  Details
                </button>

                {/* Expand/collapse chevron */}
                <motion.div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--c-overlay-faint)', border: '1px solid var(--c-divider)' }}
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={14} style={{ color: 'var(--c-text-muted)' }} />
                </motion.div>
              </div>
            </div>

            <p
              className="text-sm sm:text-[1rem] leading-[1.55] max-w-2xl"
              style={{ color: 'var(--c-text-muted)' }}
            >
              {project.description}
            </p>
          </div>
        </div>

        {/* Tech stack — always visible */}
        <div className="relative z-10 flex flex-wrap gap-1.5 mt-4 px-4 sm:px-6">
          {project.technologies.slice(0, 5).map((t) => (
            <span
              key={t.name}
              className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 tracking-wide"
              style={{
                color: 'var(--c-text-subtle)',
                background: 'var(--c-overlay-faint)',
                border: '1px solid var(--c-overlay-light)',
                borderRadius: 3,
              }}
            >
              {t.name}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="font-mono text-[9px] text-text-muted self-center">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </motion.div>

      {/* Expandable highlights / key metrics */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-col gap-3 px-4 sm:px-6 pb-7 pt-1">
              {/* Contributions */}
              {project.contributions.slice(0, 3).map((contribution, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: accent.band, border: `1px solid ${accent.color}25` }}
                >
                  <span
                    className="font-mono text-[10px] tabular-nums flex-shrink-0 mt-0.5"
                    style={{ color: accent.color }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{contribution}</p>
                </div>
              ))}

              {/* Challenge → Solution if available */}
              {project.challenge && (
                <div
                  className="grid sm:grid-cols-2 gap-3 rounded-xl p-4"
                  style={{ background: 'var(--c-overlay-faint)', border: '1px solid var(--c-divider)' }}
                >
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--c-text-muted)' }}>
                      Challenge
                    </p>
                    <p className="text-xs text-text-muted leading-relaxed">{project.challenge}</p>
                  </div>
                  {project.solution && (
                    <div>
                      <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5" style={{ color: accent.color }}>
                        Solution
                      </p>
                      <p className="text-xs text-text-muted leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setSelectedProject(project.slug)}
                className="self-start flex items-center gap-2 font-mono text-[11px] py-2 transition-colors duration-200"
                style={{ color: accent.color }}
              >
                <ArrowUpRight size={13} />
                Full case study
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLast && <div className="h-px w-full" style={{ background: 'var(--c-divider)' }} />}
    </motion.div>
  )
}

export function ProjectUniverse() {
  const { webGLSupported, reducedMotion } = useSceneStore()
  const { data: projects, isLoading, isError } = useProjects()
  const show3D = webGLSupported && !reducedMotion

  const listRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ['start center', 'end center'] })
  const progressScaleX = useSpring(listProgress, { stiffness: 120, damping: 35, restDelta: 0.001 })

  return (
    <section id="projects" className="section-spacing relative" aria-label="Projects">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="03 · Selected Work"
            title="Things I've shipped"
            subtitle="Five production systems built for India's fintech ecosystem — each representing distinct engineering challenges and real-world impact."
          />

          {/* 3D solar system — taller, more immersive */}
          {show3D && projects && projects.length > 0 && (
            <motion.div
              className="mt-14 relative overflow-hidden"
              style={{
                height: 'clamp(340px, 52vw, 580px)',
                border: '1px solid rgba(var(--c-teal-rgb), 0.20)',
                borderRadius: 20,
                background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(111,227,210,0.07) 0%, transparent 70%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 0 60px rgba(111,227,210,0.05), 0 20px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(var(--c-teal-rgb),0.08)',
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center">
                    <p className="label-mono animate-pulse">Initialising solar system…</p>
                  </div>
                }
              >
                <ProjectUniverseScene projects={projects} />
              </Suspense>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--c-bg), transparent)' }} />

              {/* Instruction */}
              <div className="absolute bottom-0 inset-x-0 pb-4 flex items-center justify-center gap-3 pointer-events-none">
                <div className="w-1 h-1 rounded-full" style={{ background: 'var(--c-teal)' }} />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--c-text-muted)' }}>
                  Click a planet · drag to orbit
                </span>
                <div className="w-1 h-1 rounded-full" style={{ background: 'var(--c-teal)' }} />
              </div>
            </motion.div>
          )}

          {/* Projects — editorial numbered list */}
          <div ref={listRef} className="mt-16 relative">
            {/* Teal→violet scroll progress bar — fills as you read through projects */}
            <motion.div
              className="absolute -top-3 left-0 right-0 h-[2px] origin-left pointer-events-none"
              style={{
                scaleX: progressScaleX,
                background: 'linear-gradient(90deg, var(--c-teal), var(--c-violet))',
                boxShadow: '0 0 8px rgba(var(--c-teal-rgb),0.5)',
              }}
              aria-hidden="true"
            />

            {isLoading && (
              <div className="space-y-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg animate-pulse" style={{ background: 'var(--c-overlay-faint)' }} />
                ))}
              </div>
            )}

            {isError && (
              <p className="text-red-400 text-sm">
                Failed to load projects. Make sure the Django backend is running on port 8000.
              </p>
            )}

            {projects?.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i} total={projects.length} />
            ))}
          </div>
        </div>
      </div>

      <ProjectDetail projects={projects ?? []} />
    </section>
  )
}
