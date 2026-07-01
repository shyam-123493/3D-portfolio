import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Trophy, Cpu, BarChart3, Package, Users, Clock, Award, ExternalLink,
} from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CardSkeleton, Skeleton } from '@/components/ui/Skeleton'
import { useAchievements, useCertifications } from '@/hooks/usePortfolioData'
import { SkillGlobe } from '@/components/ui/SkillGlobe'
import type { Achievement, Certification } from '@/types'

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
      style={{
        background: 'rgba(var(--c-bg-rgb), 0.46)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
        borderColor: cfg.border,
        boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 20px 48px rgba(0,0,0,0.03), inset 0 1px 0 var(--c-overlay-faint)',
      }}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } } as any}
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
      viewport={{ once: false, margin: '-40px' }}
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

// ─── Section ──────────────────────────────────────────────────────────────────
export function Achievements() {
  const { data: achievements, isLoading: loadingAch } = useAchievements()
  const { data: certifications, isLoading: loadingCerts } = useCertifications()

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.14, 0.08])
  const glowY = useTransform(scrollYProgress, [0, 1], ['25%', '-5%'])

  return (
    <section ref={sectionRef} id="achievements" className="section-spacing section-padding relative overflow-hidden" aria-label="Achievements">
      {/* Scroll-reactive violet radial glow */}
      <motion.div
        className="pointer-events-none absolute right-0 -top-32 w-[700px] h-[700px] rounded-full"
        style={{
          opacity: glowOpacity,
          y: glowY,
          background: 'radial-gradient(circle, rgba(var(--c-violet-rgb),1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative">
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
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--c-teal)' }}>[SKILLS]</span>
            <motion.div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: 'linear-gradient(to right, var(--c-teal), var(--c-divider))', originX: 0 }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">Core Technologies</span>
            <div className="flex-1 h-px" style={{ background: 'var(--c-divider)' }} />
          </motion.div>

          {/* CSS/JS skills globe — no WebGL, pauses off-screen, drag to spin */}
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid var(--c-divider)',
              background: 'rgba(8, 11, 18, 0.72)',
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkillGlobe />
          </motion.div>
        </div>

        {/* ── Certifications ── */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
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

