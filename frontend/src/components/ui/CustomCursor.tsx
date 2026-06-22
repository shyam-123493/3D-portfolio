import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'

export function CustomCursor() {
  const theme = useUIStore((s) => s.theme)
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  const ringX  = useSpring(mouseX, { damping: 22, stiffness: 220, mass: 0.5 })
  const ringY  = useSpring(mouseY, { damping: 22, stiffness: 220, mass: 0.5 })
  const trailX = useSpring(mouseX, { damping: 15, stiffness: 95,  mass: 1.1 })
  const trailY = useSpring(mouseY, { damping: 15, stiffness: 95,  mass: 1.1 })

  const [state, setState] = useState<'default' | 'hover' | 'text' | 'click'>('default')
  const [visible, setVisible] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const isInteractive = (el: EventTarget | null) =>
      !!(el as Element)?.closest?.('a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]')

    const isTextEl = (el: EventTarget | null) => {
      const e = el as Element
      const tag = e?.tagName?.toLowerCase()
      return ['p', 'h1', 'h2', 'h3', 'h4', 'li', 'em', 'strong'].includes(tag ?? '') &&
        !e?.closest?.('button, a, label')
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) setState('hover')
      else if (isTextEl(e.target)) setState('text')
    }
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) || isTextEl(e.target)) setState('default')
    }
    const onDown = () => setState('click')
    const onUp   = () => setState('default')
    const onScroll = () => {
      setScrolling(true)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setScrolling(false), 200)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [mouseX, mouseY, visible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  const isHover = state === 'hover'
  const isText  = state === 'text'
  const isClick = state === 'click'

  const dotFill   = theme === 'dark' ? '#ffffff' : '#0A0908'
  const ringBorder = theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(10,9,8,0.22)'
  const trailBorder = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(10,9,8,0.05)'

  return (
    <>
      {/* Exact-position dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: mouseX, y: mouseY }}
      >
        <motion.div
          className="absolute"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  isText ? 2   : isClick ? 4  : 7,
            height: isText ? 22  : isClick ? 4  : 7,
            backgroundColor: isHover ? 'var(--c-teal)' : dotFill,
            borderRadius: isText ? '2px' : '50%',
            opacity: visible ? 1 : 0,
            scaleX: scrolling && !isText ? 0.5 : 1,
            scaleY: scrolling && !isText ? 0.5 : 1,
          }}
          transition={{ duration: 0.11 }}
        />
      </motion.div>

      {/* Primary ring — spring-lagged, squishes on scroll */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute rounded-full border"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  isClick ? 18 : isHover ? 58 : isText ? 30 : 34,
            height: isClick ? 18 : isHover ? 58 : isText ? 7  : 34,
            borderColor: isHover ? 'rgba(var(--c-teal-rgb),0.88)' : ringBorder,
            boxShadow: isHover
              ? '0 0 32px rgba(var(--c-teal-rgb),0.55), inset 0 0 18px rgba(var(--c-teal-rgb),0.1)'
              : 'none',
            opacity: visible ? 1 : 0,
            borderRadius: isText ? '3px' : '50%',
            scaleX: scrolling ? 1.65 : 1,
            scaleY: scrolling ? 0.48 : 1,
          }}
          transition={{
            width:       { duration: 0.24, ease: 'easeOut' },
            height:      { duration: 0.24, ease: 'easeOut' },
            borderColor: { duration: 0.18 },
            borderRadius:{ duration: 0.2 },
            scaleX:      { duration: 0.18, ease: 'easeOut' },
            scaleY:      { duration: 0.18, ease: 'easeOut' },
            boxShadow:   { duration: 0.22 },
          }}
        />
      </motion.div>

      {/* Trail ring — slowest follow, disappears on text/click */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ x: trailX, y: trailY }}
      >
        <motion.div
          className="absolute rounded-full border"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  isHover ? 84 : 52,
            height: isHover ? 84 : 52,
            borderColor: isHover ? 'rgba(var(--c-teal-rgb),0.2)' : trailBorder,
            opacity: visible && !isText && !isClick ? 1 : 0,
          }}
          transition={{ duration: 0.48, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Teal radial glow — only on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            x: '-50%', y: '-50%',
            width: 110,
            height: 110,
            background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),0.2) 0%, transparent 65%)',
          }}
          animate={{ opacity: isHover ? 1 : 0, scale: isHover ? 1 : 0.3 }}
          transition={{ duration: 0.28 }}
        />
      </motion.div>
    </>
  )
}
