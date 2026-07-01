import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
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
  const [label, setLabel] = useState<string | null>(null)

  // Use ref so handlers below never hold a stale `label` value
  const labelRef = useRef<string | null>(null)
  labelRef.current = label

  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])

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
      show()
    }
    // Hide cursor when it leaves the browser viewport
    const onDocLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null) hide()
    }
    // Restore cursor position when it re-enters the viewport
    const onDocEnter = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      show()
    }
    const onOver = (e: MouseEvent) => {
      const labelEl = (e.target as Element)?.closest?.('[data-cursor-label]') as HTMLElement | null
      if (labelEl) {
        setLabel(labelEl.dataset.cursorLabel ?? null)
        setState('hover')
      } else if (isInteractive(e.target)) {
        setLabel(null)
        setState('hover')
      } else if (isTextEl(e.target)) {
        setLabel(null)
        setState('text')
      } else {
        // Reset when hovering a plain element so state never gets stuck
        setState('default')
        setLabel(null)
      }
    }
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) || isTextEl(e.target) ||
          (e.target as Element)?.closest?.('[data-cursor-label]')) {
        setState('default')
        setLabel(null)
      }
    }
    const onDown = () => setState('click')
    const onUp   = () => setState(labelRef.current ? 'hover' : 'default')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onDocLeave)
    document.addEventListener('mouseenter', onDocEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onDocLeave)
      document.removeEventListener('mouseenter', onDocEnter)
    }
  // Intentionally stable deps — label is accessed via ref, visible via show/hide callbacks
  }, [mouseX, mouseY, show, hide])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  const isHover = state === 'hover'
  const isText  = state === 'text'
  const isClick = state === 'click'
  const hasLabel = !!label

  const dotFill    = theme === 'dark' ? '#ffffff' : '#0A0908'
  const ringBorder = theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(10,9,8,0.22)'
  const trailBorder = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(10,9,8,0.05)'

  return (
    <>
      {/* Exact-position dot — hidden when label is showing */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: mouseX, y: mouseY }}
      >
        <motion.div
          className="absolute"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  hasLabel ? 0 : isText ? 2   : isClick ? 4  : 7,
            height: hasLabel ? 0 : isText ? 22  : isClick ? 4  : 7,
            backgroundColor: isHover ? 'var(--c-teal)' : dotFill,
            borderRadius: isText ? '2px' : '50%',
            opacity: visible && !hasLabel ? 1 : 0,
          }}
          transition={{ duration: 0.11 }}
        />
      </motion.div>

      {/* Primary ring — expands when label is active */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute rounded-full border"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  hasLabel ? 80 : isClick ? 18 : isHover ? 58 : isText ? 30 : 34,
            height: hasLabel ? 80 : isClick ? 18 : isHover ? 58 : isText ? 7  : 34,
            borderColor: isHover || hasLabel ? 'rgba(var(--c-teal-rgb),0.88)' : ringBorder,
            boxShadow: isHover || hasLabel
              ? '0 0 32px rgba(var(--c-teal-rgb),0.55), inset 0 0 18px rgba(var(--c-teal-rgb),0.1)'
              : 'none',
            opacity: visible ? 1 : 0,
            borderRadius: isText && !hasLabel ? '3px' : '50%',
          }}
          transition={{
            width:       { duration: 0.24, ease: 'easeOut' },
            height:      { duration: 0.24, ease: 'easeOut' },
            borderColor: { duration: 0.18 },
            borderRadius:{ duration: 0.2 },
            boxShadow:   { duration: 0.22 },
          }}
        />

        {/* Label text inside ring */}
        <AnimatePresence>
          {hasLabel && (
            <motion.span
              className="cursor-label absolute"
              style={{
                x: '-50%',
                y: '-50%',
                color: 'var(--c-teal)',
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ x: trailX, y: trailY }}
      >
        <motion.div
          className="absolute rounded-full border"
          style={{ x: '-50%', y: '-50%' }}
          animate={{
            width:  isHover || hasLabel ? 110 : 52,
            height: isHover || hasLabel ? 110 : 52,
            borderColor: isHover || hasLabel ? 'rgba(var(--c-teal-rgb),0.2)' : trailBorder,
            opacity: visible && !isText && !isClick ? 1 : 0,
          }}
          transition={{ duration: 0.48, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Teal radial glow on hover/label */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            x: '-50%', y: '-50%',
            width: 130,
            height: 130,
            background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),0.2) 0%, transparent 65%)',
          }}
          animate={{ opacity: isHover || hasLabel ? 1 : 0, scale: isHover || hasLabel ? 1 : 0.3 }}
          transition={{ duration: 0.28 }}
        />
      </motion.div>
    </>
  )
}
