import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

interface Props {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  accent?: string
  dim?: boolean
  size?: 'sm' | 'md'
}

/* Wraps v into [min, max) so the 4×-repeated track loops seamlessly */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export function MarqueeRibbon({
  items,
  speed = 38,
  direction = 'left',
  accent = 'var(--c-teal)',
  dim = false,
  size = 'sm',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const reducedMotion = useReducedMotion()

  const repeated = [...items, ...items, ...items, ...items]

  // ── Scroll-velocity reactive drift ────────────────────────────────────────
  // The ribbon drifts at a constant base speed, then accelerates (and can
  // briefly reverse) with scroll velocity, leaning into the motion with a
  // subtle skew — the whole page feels physically connected to the scroll.
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 })
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4], {
    clamp: false,
  })
  const skewX = useTransform(smoothVelocity, [-1200, 1200], ['1.6deg', '-1.6deg'])

  // Old CSS animation covered -50% of the track in `speed` seconds
  const baseVelocity = 50 / speed // % per second
  const dir = direction === 'left' ? -1 : 1

  // Content repeats 4×, so -25% is exactly one item-set — wrap there
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    const dt = Math.min(delta, 64) / 1000 // clamp tab-switch spikes
    let moveBy = dir * baseVelocity * dt
    // Scroll down speeds the ribbon along its own direction; fast opposite
    // scrolling can momentarily drag it backwards
    moveBy += dir * Math.abs(velocityFactor.get()) * baseVelocity * dt * 2
    moveBy += velocityFactor.get() * baseVelocity * dt
    baseX.set(baseX.get() + moveBy)
  })

  const textSize = size === 'sm'
    ? 'text-[10px] sm:text-[11px] tracking-[0.22em]'
    : 'text-[12px] sm:text-[14px] tracking-[0.16em]'

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden py-2.5 sm:py-3"
      style={{
        borderTop:    '1px solid var(--c-divider)',
        borderBottom: '1px solid var(--c-divider)',
        opacity: dim ? 0.5 : 1,
      }}
      initial={{ opacity: 0, scaleX: 0.96 }}
      animate={inView ? { opacity: dim ? 0.5 : 1, scaleX: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left fade */}
      <div
        className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--c-bg), transparent)' }}
      />
      {/* Right fade */}
      <div
        className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--c-bg), transparent)' }}
      />

      <motion.div
        className="flex whitespace-nowrap"
        style={{
          x,
          skewX: reducedMotion ? undefined : skewX,
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-3 uppercase font-mono ${textSize}`}>
            <span style={{ color: 'var(--c-text-muted)' }}>{item}</span>
            <span
              className="inline-block w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: i % 2 === 0 ? accent : 'var(--c-text-muted)', opacity: 0.5 }}
            />
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}
