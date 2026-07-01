import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion'
// useInView is still used by ProjectCard
import { Github, ExternalLink, Play } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { usePersonalProjects, type PersonalProjectAPI } from '@/hooks/usePortfolioData'

type Status = 'live' | 'wip' | 'archived'

const STATUS_STYLE: Record<Status, { label: string; color: string }> = {
  live:     { label: 'Live',     color: '#6FE3D2' },
  wip:      { label: 'In progress', color: '#F59E0B' },
  archived: { label: 'Archived', color: '#6B7280' },
}

// ── 3D tilt card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: PersonalProjectAPI; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 180, damping: 28 })
  const springY = useSpring(rawY, { stiffness: 180, damping: 28 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9])
  const glareX  = useTransform(springX, [-0.5, 0.5], ['0%', '100%'])
  const glareY  = useTransform(springY, [-0.5, 0.5], ['0%', '100%'])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const status = STATUS_STYLE[project.status] ?? STATUS_STYLE.live

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: '#0C0C10',
          border: `1px solid ${project.color}28`,
          boxShadow: `0 0 0 0 ${project.color}00`,
          willChange: 'transform',
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{
          scale: 1.025,
          boxShadow: `0 24px 60px rgba(0,0,0,0.35), 0 0 40px ${project.color}22`,
        }}
        transition={{ scale: { duration: 0.35, ease: [0.16,1,0.3,1] }, boxShadow: { duration: 0.35 } }}
      >
        {/* Media area */}
        <div
          className="relative w-full overflow-hidden flex-shrink-0"
          style={{ height: 200 }}
        >
          {project.media_type !== 'none' ? (
            project.media_type === 'video' && project.media_video_url ? (
              <video
                src={project.media_video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : project.media_type === 'image' && project.media_image_url ? (
              <img
                src={project.media_image_url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : null
          ) : (
            /* Gradient placeholder */
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${project.color}18 0%, #0C0C10 75%)`,
              }}
            >
              {/* Floating geometric accent */}
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    border: `1px solid ${project.color}40`,
                    background: `${project.color}0C`,
                  }}
                  animate={{ rotate: [0, 6, 0, -6, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-xl"
                  style={{ border: `1px solid ${project.color}60`, background: `${project.color}12` }}
                  animate={{ rotate: [0, -8, 0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-4 rounded-lg flex items-center justify-center"
                  style={{ background: `${project.color}20` }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Play size={16} style={{ color: project.color }} />
                </motion.div>
              </div>
            </div>
          )}

          {/* Bottom gradient fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0C0C10, transparent)' }}
          />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className="font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-1 rounded-full"
              style={{
                color: status.color,
                background: `${status.color}18`,
                border: `1px solid ${status.color}40`,
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Year */}
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {project.year}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Title + tagline */}
          <div className="mb-3">
            <div
              className="w-6 h-0.5 rounded-full mb-3"
              style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
            />
            <h3
              className="font-serif italic mb-1"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#F0EFE9', lineHeight: 1.2 }}
            >
              {project.title}
            </h3>
            <p className="font-mono text-[10px] tracking-wide" style={{ color: project.color }}>
              {project.tagline}
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(240,239,233,0.6)' }}>
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((t) => (
              <span
                key={t.name}
                className="font-mono text-[9px] px-2 py-0.5 rounded tracking-wide"
                style={{
                  color: 'rgba(240,239,233,0.55)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                {t.name}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mt-auto">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = project.color)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
              >
                <Github size={13} />
                GitHub
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = project.color)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
              >
                <ExternalLink size={13} />
                Live
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = project.color)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
              >
                <Play size={13} />
                Demo
              </a>
            )}
          </div>
        </div>

        {/* Mouse-tracked glare shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.06) 0%, transparent 55%)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────
export function PersonalProjects() {
  const { data: projects, isLoading, isError } = usePersonalProjects()

  // Hide section entirely when data is confirmed empty (not just loading)
  if (!isLoading && !isError && (!projects || projects.length === 0)) return null

  return (
    <section id="personal-projects" className="section-spacing relative" aria-label="Personal Projects">
      {/* Depth background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 50%, rgba(139,125,255,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="section-padding relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="04 · Personal Lab"
            title="Things I build for fun"
            subtitle="Side projects, experiments, and tools I craft outside of work — where I get to pick the stack and break the rules."
          />

          {/* Loading skeleton */}
          {isLoading && (
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: '#0C0C10', border: '1px solid rgba(255,255,255,0.06)', height: 380 }}
                >
                  <div className="h-48" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-3 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-5 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    <div className="h-3 rounded w-4/5" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <p className="mt-14 font-mono text-sm" style={{ color: 'rgba(239,68,68,0.7)' }}>
              Could not load projects — make sure the backend is running on port 8000.
            </p>
          )}

          {/* Cards — each animates itself via its own useInView, no outer opacity wrapper */}
          {projects && projects.length > 0 && (
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}

          {projects && projects.length > 0 && (
            <p
              className="mt-8 text-center font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              More projects cooking — check back soon
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
