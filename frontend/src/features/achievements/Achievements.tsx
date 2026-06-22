import { lazy, Suspense, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Trophy, Cpu, BarChart3, Package, Users, Clock, Award, ExternalLink,
  Layers, Database, Cloud, GitBranch,
} from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CardSkeleton, Skeleton } from '@/components/ui/Skeleton'
import { useAchievements, useCertifications } from '@/hooks/usePortfolioData'
import { useSceneStore } from '@/stores/sceneStore'
import type { Achievement, Certification } from '@/types'

const SkillsGlobe = lazy(() =>
  import('@/three/scenes/SkillsGlobe').then((m) => ({ default: m.SkillsGlobe })),
)

// ─── Achievement cards ────────────────────────────────────────────────────────
interface AccentConfig {
  icon: React.ElementType
  color: string
  border: string
  bg: string
  glow: string
}

const CATEGORY_CONFIG: Record<string, AccentConfig> = {
  technical:     { icon: Cpu,       color: 'var(--c-teal)',   border: 'rgba(var(--c-teal-rgb),0.145)',   bg: 'rgba(var(--c-teal-rgb),0.031)',   glow: 'rgba(var(--c-teal-rgb),0.32)' },
  delivery:      { icon: Clock,     color: '#F59E0B',         border: 'rgba(245,158,11,0.145)',           bg: 'rgba(245,158,11,0.031)',           glow: 'rgba(245,158,11,0.32)' },
  analytics:     { icon: BarChart3, color: '#10B981',         border: 'rgba(16,185,129,0.145)',           bg: 'rgba(16,185,129,0.031)',           glow: 'rgba(16,185,129,0.32)' },
  architecture:  { icon: Package,   color: 'var(--c-teal)',   border: 'rgba(var(--c-teal-rgb),0.145)',   bg: 'rgba(var(--c-teal-rgb),0.031)',   glow: 'rgba(var(--c-teal-rgb),0.32)' },
  collaboration: { icon: Users,     color: 'var(--c-violet)', border: 'rgba(var(--c-violet-rgb),0.145)', bg: 'rgba(var(--c-violet-rgb),0.031)', glow: 'rgba(var(--c-violet-rgb),0.32)' },
}

const FALLBACK_CONFIG: AccentConfig = {
  icon: Trophy, color: 'var(--c-teal)',
  border: 'rgba(var(--c-teal-rgb),0.145)', bg: 'rgba(var(--c-teal-rgb),0.031)', glow: 'rgba(var(--c-teal-rgb),0.32)',
}

function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  const cfg  = CATEGORY_CONFIG[item.category] ?? FALLBACK_CONFIG
  const Icon = cfg.icon

  return (
    <motion.article
      className="relative overflow-hidden rounded-2xl border transition-colors duration-300 group"
      style={{ background: 'var(--c-overlay-faint)', borderColor: cfg.border }}
      initial={{ opacity: 0, y: 48, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.68, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } } as any}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${cfg.glow}, transparent 65%)` }}
      />
      {/* Corner glow on hover */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${cfg.glow.replace('0.32', '0.08')}, transparent 70%)` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />

      <div className="p-5 sm:p-6 relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div
            className="p-2.5 flex-shrink-0 rounded-xl border"
            style={{ color: cfg.color, borderColor: cfg.border, background: cfg.bg }}
          >
            <Icon size={15} />
          </div>
          {item.highlight && (
            <span
              className="font-mono text-[9px] px-2 py-0.5 rounded border tracking-widest text-right leading-relaxed max-w-[140px]"
              style={{ color: '#D97706', borderColor: 'rgba(217,119,6,0.22)', background: 'rgba(217,119,6,0.04)' }}
            >
              {item.highlight}
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-base text-text-primary mb-2">
          {item.title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.article>
  )
}

// ─── Certification card ───────────────────────────────────────────────────────
function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border flex items-center gap-4 transition-colors duration-300 group"
      style={{
        background: 'var(--c-overlay-faint)',
        borderColor: 'rgba(245,158,11,0.18)',
        padding: '16px 20px',
      }}
      initial={{ opacity: 0, x: -32, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ x: 4, transition: { duration: 0.18 } } as any}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl"
        style={{ background: 'linear-gradient(180deg, #F59E0B, #D97706)' }}
      />
      <div
        className="p-2.5 border flex-shrink-0 rounded-lg ml-2"
        style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)' }}
      >
        <Award size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-text-primary">{cert.title}</p>
        <p className="font-mono text-[10px] mt-0.5 tracking-wide" style={{ color: 'var(--c-text-muted)' }}>
          {cert.issuer} · {cert.date}
        </p>
      </div>
      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 transition-colors duration-200"
          style={{ color: 'var(--c-text-muted)' }}
          aria-label="View credential"
        >
          <ExternalLink size={13} />
        </a>
      )}
    </motion.div>
  )
}

// ─── Skills bento grid ────────────────────────────────────────────────────────
const SKILLS_CATEGORIES = [
  {
    area: 'Frontend',
    icon: Layers,
    color: '#DD0031',
    colorRgb: '221,0,49',
    items: [
      { name: 'Angular 14+',  level: 5 },
      { name: 'TypeScript',   level: 5 },
      { name: 'JavaScript',   level: 5 },
      { name: 'RxJS',         level: 4 },
      { name: 'PWA',          level: 4 },
      { name: 'HTML / CSS',   level: 5 },
    ],
  },
  {
    area: 'Backend & Storage',
    icon: Database,
    color: '#6DB33F',
    colorRgb: '109,179,63',
    items: [
      { name: 'Java',            level: 4 },
      { name: 'Spring Boot',     level: 4 },
      { name: 'IndexedDB',       level: 5 },
      { name: 'REST APIs',       level: 5 },
      { name: 'Service Workers', level: 4 },
      { name: 'WebSockets',      level: 3 },
    ],
  },
  {
    area: 'Analytics',
    icon: BarChart3,
    color: '#E37400',
    colorRgb: '227,116,0',
    items: [
      { name: 'CleverTap',  level: 5 },
      { name: 'GA4',        level: 4 },
      { name: 'GTM',        level: 4 },
      { name: 'Event Design', level: 4 },
      { name: 'Data Layers', level: 4 },
    ],
  },
  {
    area: 'Infrastructure',
    icon: Cloud,
    color: '#0EA5E9',
    colorRgb: '14,165,233',
    items: [
      { name: 'AWS S3',          level: 3 },
      { name: 'CI/CD',           level: 4 },
      { name: 'Git',             level: 5 },
      { name: 'Docker (basics)', level: 3 },
      { name: 'Dynamic Config',  level: 4 },
    ],
  },
]

function SkillPip({ filled, color }: { filled: boolean; color: string }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: 5, height: 5,
        background: filled ? color : 'var(--c-divider)',
        boxShadow: filled ? `0 0 6px ${color}` : 'none',
        transition: 'all 0.2s',
      }}
    />
  )
}

function SkillCategoryCard({
  area, icon: Icon, color, colorRgb, items, index,
}: typeof SKILLS_CATEGORIES[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: 'var(--c-overlay-faint)',
        borderColor: `rgba(${colorRgb}, 0.18)`,
      }}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ borderColor: `rgba(${colorRgb}, 0.45)` } as any}
    >
      {/* Top color bar */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `rgba(${colorRgb}, 0.12)`, border: `1px solid rgba(${colorRgb}, 0.25)` }}
        >
          <Icon size={13} style={{ color }} />
        </div>
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color }}>
          {area}
        </p>
      </div>

      {/* Skills list */}
      <div className="px-5 pb-5 space-y-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            className="flex items-center justify-between gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs sm:text-[13px] text-text-secondary">{item.name}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, j) => (
                <SkillPip key={j} filled={j < item.level} color={color} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Static fallback (no WebGL) ───────────────────────────────────────────────
function SkillsFallback() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SKILLS_CATEGORIES.map((cat, i) => (
        <SkillCategoryCard key={cat.area} {...cat} index={i} />
      ))}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function Achievements() {
  const { webGLSupported } = useSceneStore()
  const { data: achievements, isLoading: loadingAch } = useAchievements()
  const { data: certifications, isLoading: loadingCerts } = useCertifications()

  return (
    <section id="achievements" className="section-spacing section-padding" aria-label="Achievements">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="06 · Achievements"
          title="Delivered Impact"
          subtitle="A record of what I've owned, built, and improved — each item represents real responsibility in a production engineering environment."
        />

        {/* Achievement cards grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingAch && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          {achievements?.map((item, i) => (
            <AchievementCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* ── Skills ── */}
        <div className="mt-20">
          {/* Skills header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--c-teal)' }}>[SKILLS]</span>
            <motion.div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: 'linear-gradient(to right, var(--c-teal), var(--c-divider))', originX: 0 }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">Core Technologies</span>
            <div className="flex-1 h-px" style={{ background: 'var(--c-divider)' }} />
          </motion.div>

          {/* 3D globe */}
          {webGLSupported && (
            <motion.div
              className="relative overflow-hidden rounded-2xl mb-6"
              style={{
                border: '1px solid var(--c-divider)',
                background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(111,227,210,0.04) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense
                fallback={
                  <div className="flex flex-wrap gap-2 justify-center p-10">
                    {['Angular', 'TypeScript', 'Java', 'Spring Boot', 'PWA', 'IndexedDB'].map((s) => (
                      <span
                        key={s}
                        className="font-mono text-xs px-3 py-1 rounded-full border animate-pulse"
                        style={{ color: 'var(--c-teal)', borderColor: 'rgba(var(--c-teal-rgb),0.3)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                }
              >
                <SkillsGlobe />
              </Suspense>

              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--c-bg), transparent)' }}
              />

              {/* Hover instruction */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 pointer-events-none">
                <div className="w-1 h-1 rounded-full" style={{ background: 'var(--c-teal)', opacity: 0.6 }} />
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--c-text-muted)' }}>
                  hover to explore · auto-rotates
                </span>
                <div className="w-1 h-1 rounded-full" style={{ background: 'var(--c-teal)', opacity: 0.6 }} />
              </div>
            </motion.div>
          )}

          {/* Skill category bento cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SKILLS_CATEGORIES.map((cat, i) => (
              <SkillCategoryCard key={cat.area} {...cat} index={i} />
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[10px] tracking-widest" style={{ color: '#F59E0B' }}>[CERTS]</span>
            <div className="flex-1 h-px" style={{ background: 'var(--c-divider)' }} />
            <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">Certifications</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {loadingCerts && (
              <>
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </>
            )}
            {certifications?.map((cert, i) => (
              <CertificationCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
