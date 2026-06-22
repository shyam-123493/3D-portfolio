import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  accent?: string
  dim?: boolean
  size?: 'sm' | 'md'
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

  const repeated = [...items, ...items, ...items, ...items]
  const animName = direction === 'left' ? 'marquee-left' : 'marquee-right'

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

      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          width: 'max-content',
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
      </div>
    </motion.div>
  )
}
