import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MessageSquare, Brain, Code2, FileText, Rocket, Search, Database, Plug, GitBranch, Bot,
  Check, ArrowRight, Zap,
} from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { aiTools } from '@/data'
import type { AITool } from '@/types'

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquare, Brain, Code2, FileText, Rocket, Search, Database, Plug, GitBranch, Bot,
}

const AI_SKILLS = [
  { label: 'Code Generation',       pct: 90, color: '#6FE3D2' },
  { label: 'Prompt Engineering',    pct: 85, color: '#4DD9C4' },
  { label: 'AI-Assisted Debug',     pct: 80, color: '#8B7DFF' },
  { label: 'Architecture Review',   pct: 70, color: '#A78BFA' },
  { label: 'Workflow Automation',   pct: 65, color: '#38BDF8' },
]

const HOW_I_USE = [
  'Code generation & refactoring at scale',
  'Production debugging with AI context',
  'Test-case and docs generation',
  'Architecture trade-off analysis',
  'Prompt engineering for dev tooling',
  'Workflow productivity automation',
]

// ─── Radial SVG gauge ─────────────────────────────────────────────────────────
function RadialGauge({ pct, color, label, index }: { pct: number; color: string; label: string; index: number }) {
  const ref = useRef<SVGCircleElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: false, margin: '-40px' })

  const size    = 84
  const stroke  = 6
  const r       = (size - stroke * 2) / 2
  const circ    = 2 * Math.PI * r
  const offset  = circ - (pct / 100) * circ

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
          />
          {/* Fill */}
          <motion.circle
            ref={ref}
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circ }}
            transition={{
              duration: 1.1,
              delay: inView ? 0.1 + index * 0.09 : 0,
              type: 'spring',
              stiffness: 55,
              damping: 14,
            }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* Center label */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.span
            className="font-mono font-bold tabular-nums"
            style={{ fontSize: 15, color, lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ delay: inView ? 0.25 + index * 0.09 : 0, duration: 0.35, type: 'spring', stiffness: 200, damping: 18 }}
          >
            {pct}
            <span style={{ fontSize: 8, opacity: 0.7 }}>%</span>
          </motion.span>
        </div>
      </div>
      <p
        className="font-mono text-center leading-tight"
        style={{ fontSize: 9, color: 'var(--c-text-muted)', letterSpacing: '0.12em', maxWidth: 72 }}
      >
        {label.toUpperCase()}
      </p>
    </div>
  )
}

// ─── Terminal-style tool card ─────────────────────────────────────────────────
function ToolCard({ tool, index }: { tool: AITool; index: number }) {
  const Icon = ICON_MAP[tool.icon] ?? Brain
  const isCurrent = tool.category === 'current'
  const accent = isCurrent ? 'var(--c-teal)' : 'var(--c-violet)'
  const accentRgb = isCurrent ? 'var(--c-teal-rgb)' : 'var(--c-violet-rgb)'

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl group"
      style={{
        background: 'rgba(var(--c-bg-rgb), 0.42)',
        backdropFilter: 'blur(14px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
        border: `1px solid rgba(${accentRgb}, 0.18)`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-16px' }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ borderColor: `rgba(${accentRgb}, 0.45)` } as any}
    >
      {/* Terminal header bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{
          borderColor: `rgba(${accentRgb}, 0.12)`,
          background: `rgba(${accentRgb}, 0.04)`,
        }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          {['#ff5f57', '#ffbd2e', '#27c93f'].map((c) => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        <span
          className="font-mono text-[9px] tracking-[0.18em] uppercase"
          style={{ color: `rgba(${accentRgb}, 0.6)` }}
        >
          {isCurrent ? 'active' : 'learning'}
        </span>
        <div
          className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
          style={{ background: `rgba(${accentRgb}, 0.12)` }}
        >
          {isCurrent
            ? <Check size={8} style={{ color: accent }} strokeWidth={3} />
            : <ArrowRight size={8} style={{ color: accent }} />}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-3 p-3.5">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `rgba(${accentRgb}, 0.1)`, border: `1px solid rgba(${accentRgb}, 0.2)` }}
        >
          <Icon size={15} style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm text-text-primary mb-0.5">{tool.name}</p>
          <p className="text-text-muted leading-relaxed" style={{ fontSize: 11 }}>{tool.purpose}</p>
        </div>
      </div>

      {/* Animated bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner glow on hover */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, rgba(${accentRgb}, 0.08), transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// ─── Animated "how I use AI" list ─────────────────────────────────────────────
function HowIUseList() {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: false, margin: '-50px' })

  return (
    <ul ref={ref} className="space-y-2">
      {HOW_I_USE.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="flex-shrink-0 font-mono text-[9px] tabular-nums w-5 text-right"
            style={{ color: 'var(--c-teal)' }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-text-secondary text-xs sm:text-sm leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function AILab() {
  const current  = aiTools.filter((t) => t.category === 'current')
  const learning = aiTools.filter((t) => t.category === 'learning')

  return (
    <section id="ai-lab" className="section-spacing section-padding" aria-label="AI Lab">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="05 · AI Lab"
          title="AI-Assisted Engineering"
          subtitle="Integrating AI tools into my development workflow — from daily coding assistance to exploring agent-based systems."
        />

        {/* ── Top: gauge cluster + usage list ── */}
        <div className="mt-14 grid lg:grid-cols-[1fr_1fr] gap-10 items-start">

          {/* Radial skill gauges */}
          <motion.div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(var(--c-bg-rgb), 0.46)',
              backdropFilter: 'blur(18px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
              border: '1px solid var(--c-overlay-light)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 var(--c-overlay-faint)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Zap size={14} style={{ color: 'var(--c-teal)' }} />
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--c-teal)' }}>
                AI Proficiency
              </p>
            </div>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 place-items-center">
              {AI_SKILLS.map((skill, i) => (
                <RadialGauge
                  key={skill.label}
                  pct={skill.pct}
                  color={skill.color}
                  label={skill.label}
                  index={i}
                />
              ))}
            </div>
          </motion.div>

          {/* How I use AI */}
          <motion.div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(var(--c-bg-rgb), 0.46)',
              backdropFilter: 'blur(18px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
              border: '1px solid var(--c-overlay-light)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 var(--c-overlay-faint)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Brain size={14} style={{ color: 'var(--c-violet)' }} />
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--c-violet)' }}>
                How I Use AI
              </p>
            </div>
            <HowIUseList />

            {/* Honest framing */}
            <div
              className="mt-6 rounded-xl px-4 py-3 border"
              style={{ borderColor: 'rgba(var(--c-violet-rgb),0.2)', background: 'rgba(var(--c-violet-rgb),0.04)' }}
            >
              <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: 'var(--c-violet)' }}>
                Honest framing
              </p>
              <p className="text-text-muted leading-relaxed" style={{ fontSize: 11 }}>
                These are productivity and exploration tools, not production AI systems I've shipped.
                The roadmap items represent genuine active learning.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom: terminal tool cards ── */}
        <div className="mt-12">
          {/* Current toolset */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-teal)' }} />
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--c-teal)' }}>
                Current Toolset
              </p>
              <div className="flex-1 h-px opacity-10" style={{ background: 'var(--c-teal)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {current.map((tool, i) => (
                <ToolCard key={tool.name} tool={tool} index={i} />
              ))}
            </div>
          </div>

          {/* Active learning */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-violet)' }} />
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--c-violet)' }}>
                Active Learning Roadmap
              </p>
              <div className="flex-1 h-px opacity-10" style={{ background: 'var(--c-violet)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {learning.map((tool, i) => (
                <ToolCard key={tool.name} tool={tool} index={i + current.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
