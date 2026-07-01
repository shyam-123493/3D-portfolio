import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import {
  Wifi, Smartphone, BarChart3, Settings2, Zap, Database, Package, ArrowRight,
} from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { engineeringTopics } from '@/data'
import type { EngineeringTopic } from '@/types'

const SERVICES = [
  {
    title: 'Frontend Architecture',
    desc: 'Scalable, maintainable Angular apps with reusable component libraries and shared workflows.',
    orb: 'radial-gradient(circle at 34% 28%, #fff, #8b7dff 30%, #241d4a 120%)',
    accent: '#8B7DFF',
  },
  {
    title: 'Progressive Web Apps',
    desc: 'Installable, offline-capable apps with push notifications and native-like performance.',
    orb: 'radial-gradient(circle at 34% 28%, #fff, #5fe07a 30%, #16401f 120%)',
    accent: '#5fe07a',
  },
  {
    title: 'Smarter Systems & Automation',
    desc: 'AI-assisted development with Copilot & Claude, plus IndexedDB and hybrid native bridges.',
    orb: 'radial-gradient(circle at 34% 28%, #fff, #ff6fb0 30%, #4a1d36 120%)',
    accent: '#ff6fb0',
  },
  {
    title: 'Performance & Analytics',
    desc: 'Bundle and load-speed optimization with structured tracking via CleverTap, GA4 and GTM.',
    orb: 'radial-gradient(circle at 34% 28%, #fff, #5fd8e0 30%, #16414a 120%)',
    accent: '#5fd8e0',
  },
]

function ServiceCard({ svc, index }: { svc: typeof SERVICES[0]; index: number }) {
  return (
    <motion.div
      className="relative rounded-[18px] flex flex-col sm:flex-row gap-5 sm:gap-8 items-start border"
      style={{
        padding: 'clamp(24px, 4vw, 46px) clamp(20px, 4vw, 50px)',
        background: 'rgba(var(--c-bg-rgb), 0.44)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        borderColor: 'var(--c-overlay-light)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 var(--c-overlay-faint)',
      }}
      initial={{ opacity: 0, y: 40, x: index % 2 === 0 ? -24 : 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } } as any}
    >
      {/* Gradient orb */}
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
        style={{
          background: svc.orb,
          boxShadow: `0 14px 36px -8px rgba(var(--c-teal-rgb),0.4), inset 0 -8px 16px rgba(0,0,0,0.45)`,
        }}
      />
      <div>
        <h3
          className="font-serif text-text-primary mb-2 sm:mb-3 leading-[1.04]"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)' }}
        >
          {svc.title}
        </h3>
        <p className="text-base sm:text-[1.2rem] leading-[1.55]" style={{ color: 'var(--c-text-muted)' }}>
          {svc.desc}
        </p>
      </div>
      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-10 right-10 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${svc.accent}40, transparent)` }}
      />
    </motion.div>
  )
}


const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Smartphone, BarChart3, Settings2, Zap, Database, Package,
}

const STEPS = [
  { key: 'problem' as const, label: 'Problem', color: '#F87171' },
  { key: 'approach' as const, label: 'Approach', color: '#F59E0B' },
  { key: 'outcome' as const, label: 'Outcome', color: '#10B981' },
]

function TopicNode({ topic, index, isActive, onSelect }: {
  topic: EngineeringTopic
  index: number
  isActive: boolean
  onSelect: () => void
}) {
  const Icon = ICON_MAP[topic.icon] ?? Zap
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.button
      onClick={onSelect}
      className={`group relative w-full text-left overflow-hidden rounded-xl border transition-all duration-300 ${
        isActive
          ? 'border-accent-teal/45 bg-accent-teal/[0.04]'
          : 'border-border-subtle bg-bg-surface hover:border-border-subtle/60 hover:bg-bg-surface/70'
      }`}
      style={isActive ? { boxShadow: '0 0 24px rgba(var(--c-teal-rgb),0.07)' } : {}}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      aria-expanded={isActive}
    >
      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: 'linear-gradient(180deg, var(--c-teal) 0%, var(--c-violet) 100%)' }}
        animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.4 }}
        initial={false}
        transition={{ duration: 0.22 }}
      />

      <div className="flex items-center gap-3.5 p-4 pl-5">
        {/* Section number */}
        <span
          className={`font-mono text-xs font-bold w-7 flex-shrink-0 tabular-nums transition-colors duration-200 ${
            isActive ? 'text-accent-teal' : 'text-border-subtle group-hover:text-text-muted'
          }`}
        >
          {num}
        </span>

        {/* Icon */}
        <div
          className={`p-2 rounded-lg flex-shrink-0 transition-colors duration-200 ${
            isActive
              ? 'bg-accent-teal/15 text-accent-teal'
              : 'bg-bg-primary text-text-muted group-hover:text-text-secondary'
          }`}
        >
          <Icon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-display font-semibold text-sm transition-colors duration-200 ${
              isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
            }`}
          >
            {topic.title}
          </h3>
          <p
            className={`font-mono text-[10px] mt-0.5 truncate transition-colors duration-200 ${
              isActive ? 'text-text-muted' : 'text-border-subtle group-hover:text-text-muted'
            }`}
          >
            {topic.tags.slice(0, 3).join(' · ')}
          </p>
        </div>

        <ArrowRight
          size={13}
          className={`flex-shrink-0 transition-all duration-200 ${
            isActive
              ? 'text-accent-teal opacity-100 translate-x-0'
              : 'text-border-subtle opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
          }`}
        />
      </div>
    </motion.button>
  )
}

function TopicDetail({ topic }: { topic: EngineeringTopic }) {
  const Icon = ICON_MAP[topic.icon] ?? Zap

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
        {/* Header */}
        <div
          className="relative p-6 border-b border-border-subtle overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(var(--c-teal-rgb),0.04) 0%, rgba(var(--c-violet-rgb),0.04) 100%)',
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
              <Icon size={20} />
            </div>
            <div>
              <p className="label-mono mb-0.5 text-accent-teal">Engineering System</p>
              <h3 className="font-display font-bold text-xl text-text-primary">{topic.title}</h3>
            </div>
          </div>
        </div>

        {/* Problem → Approach → Outcome */}
        <div className="p-6">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full mt-[3px]"
                  style={{ background: step.color, boxShadow: `0 0 8px ${step.color}80` }}
                />
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 my-2 min-h-[32px]"
                    style={{
                      background: `linear-gradient(to bottom, ${step.color}40, ${STEPS[i + 1].color}30)`,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={i < STEPS.length - 1 ? 'pb-6 flex-1' : 'flex-1'}>
                <p className="label-mono mb-1.5" style={{ color: step.color }}>
                  {step.label}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {topic[step.key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="px-6 pb-6 flex flex-wrap gap-2 border-t border-border-subtle pt-4">
          {topic.tags.map((tag) => (
            <span key={tag} className="code-tag">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function EngineeringSystems() {
  const [activeId, setActiveId] = useState(engineeringTopics[0].id)
  const activeTopic = engineeringTopics.find((t) => t.id === activeId)!

  const sectionRef = useRef<HTMLElement>(null)
  const deepDivesRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.22, 0.12])
  const glowY = useTransform(scrollYProgress, [0, 1], ['20%', '-5%'])

  useEffect(() => {
    const panel = deepDivesRef.current
    if (!panel) return

    const trigger = ScrollTrigger.create({
      trigger: panel,
      start: 'top 76px',
      end: `+=${engineeringTopics.length * 55}vh`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * engineeringTopics.length),
          engineeringTopics.length - 1,
        )
        setActiveId(engineeringTopics[idx].id)
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} id="engineering" className="section-spacing section-padding relative overflow-hidden" aria-label="Engineering Systems">
      {/* Scroll-reactive teal glow — intensifies as section enters view */}
      <motion.div
        className="pointer-events-none absolute left-1/4 -top-20 w-[700px] h-[700px] rounded-full"
        style={{
          opacity: glowOpacity,
          y: glowY,
          background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),1) 0%, transparent 70%)',
          filter: 'blur(72px)',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeading
          label="04 · What I Build"
          title="What I build"
          subtitle="Four practice areas where I've shipped production-grade solutions — each grounded in real fintech challenges."
        />

        {/* Services grid */}
        <div className="mt-12 grid sm:grid-cols-2 gap-5 mb-20">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-border-subtle/60" />
          <span className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase">Engineering Deep-Dives</span>
          <div className="h-px flex-1 bg-border-subtle/60" />
        </div>

        <div ref={deepDivesRef} className="mt-16 grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Topic list — second on mobile (below preview), first on desktop */}
          <div className="order-2 lg:order-1 flex flex-col gap-2.5">
            {engineeringTopics.map((topic, i) => (
              <TopicNode
                key={topic.id}
                topic={topic}
                index={i}
                isActive={activeId === topic.id}
                onSelect={() => setActiveId(topic.id)}
              />
            ))}
          </div>

          {/* Detail panel — first on mobile (preview), second on desktop, sticky */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 self-start">
            <AnimatePresence mode="wait">
              <TopicDetail key={activeTopic.id} topic={activeTopic} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

