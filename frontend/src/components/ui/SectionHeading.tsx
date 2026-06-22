import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ease } from '@/animations/variants'

interface Props {
  label: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

function AnimatedTitle({ title, inView }: { title: string; inView: boolean }) {
  const words = title.split(' ')
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.22em] overflow-hidden" style={{ verticalAlign: 'top' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0, rotateX: 10 }}
            animate={inView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
            transition={{
              duration: 0.75,
              delay: wi * 0.07,
              ease: ease.smooth,
            }}
            style={{ perspective: 400 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  )
}

export function SectionHeading({ label, title, subtitle, align = 'left' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const isCenter = align === 'center'

  const sectionNum  = label.match(/^(\d+)/)?.[1] ?? ''
  const sectionName = label.replace(/^\d+\s*[·.]\s*/, '').trim()

  return (
    <div ref={ref} className={isCenter ? 'text-center' : ''}>
      {/* [XX] ─── Category label */}
      <motion.div
        className={`flex items-center gap-4 mb-7 ${isCenter ? 'justify-center' : ''}`}
        initial={{ opacity: 0, x: isCenter ? 0 : -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: ease.smooth }}
      >
        {sectionNum && (
          <motion.span
            className="font-mono text-xs tracking-widest flex-shrink-0"
            style={{ color: 'var(--c-teal)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05, ease: ease.spring }}
          >
            [{sectionNum}]
          </motion.span>
        )}

        {/* Clip-path reveal for the horizontal line */}
        <motion.div
          className="h-px flex-shrink-0"
          style={{
            width: 48,
            background: 'linear-gradient(to right, var(--c-teal), var(--c-divider))',
            originX: 0,
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: ease.cinematic }}
        />

        <span
          className="font-mono text-[10px] tracking-[0.18em] uppercase flex-shrink-0"
          style={{ color: 'var(--c-text-muted)' }}
        >
          {sectionName}
        </span>

        <motion.div
          className="h-px flex-1 max-w-[80px] flex-shrink-0"
          style={{ background: 'var(--c-divider)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: ease.cinematic }}
        />
      </motion.div>

      {/* Large italic title */}
      <h2
        className={`font-serif italic text-text-primary text-balance overflow-hidden mb-5 ${isCenter ? 'mx-auto' : ''}`}
        style={{
          fontSize: 'clamp(2.8rem, 6vw, 5.25rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.01em',
          perspective: 600,
        }}
      >
        <AnimatedTitle title={title} inView={inView} />
      </h2>

      {subtitle && (
        <motion.p
          className={`text-text-secondary text-lg leading-relaxed max-w-2xl ${isCenter ? 'mx-auto' : ''}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.38, ease: ease.smooth }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
