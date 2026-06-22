import { useRef, type ReactNode, type CSSProperties } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
  href?: string
  onClick?: () => void
  strength?: number
  'aria-label'?: string
}

export function MagneticButton({ children, className, style, href, onClick, strength = 0.35, 'aria-label': ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.5 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    mx.set((e.clientX - cx) * strength)
    my.set((e.clientY - cy) * strength)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, display: 'inline-block', ...style }}
      className={className}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ scale: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} style={{ display: 'inline-block', textDecoration: 'none' }}>
        {inner}
      </a>
    )
  }

  return (
    <div onClick={onClick} style={{ display: 'inline-block', cursor: onClick ? 'pointer' : undefined }}>
      {inner}
    </div>
  )
}
