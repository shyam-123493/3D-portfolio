import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface Props {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
  style?: React.CSSProperties
}

export function ParallaxLayer({ children, speed = 0.18, direction = 'up', className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const factor = direction === 'up' ? -1 : 1
  const range  = 120 * speed * factor
  const raw    = useTransform(scrollYProgress, [0, 1], [range, -range])
  const y      = useSpring(raw, { stiffness: 60, damping: 20, mass: 1.2 })

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  )
}
