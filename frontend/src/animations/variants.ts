import type { Variants } from 'framer-motion'

// ── Easing curves ─────────────────────────────────────────────────────────────
export const ease = {
  smooth:    [0.16, 1,    0.3,  1   ] as const,
  power:     [0.22, 1,    0.36, 1   ] as const,
  snappy:    [0.43, 0.13, 0.23, 0.96] as const,
  cinematic: [0.76, 0,    0.24, 1   ] as const,
  spring:    [0.34, 1.56, 0.64, 1   ] as const,
}

// ── Base variants ─────────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.78, ease: ease.smooth } },
}

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -32 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.68, ease: ease.smooth } },
}

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: 52 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.72, ease: ease.smooth } },
}

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: -52 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.72, ease: ease.smooth } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.72, ease: ease.smooth } },
}

export const blurUp: Variants = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(14px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',  transition: { duration: 0.82, ease: ease.smooth } },
}

export const clipRevealX: Variants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)',   transition: { duration: 1.05, ease: ease.cinematic } },
}

export const clipRevealY: Variants = {
  hidden:  { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)',   transition: { duration: 0.82, ease: ease.cinematic } },
}

export const lineGrow: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, originX: 0, transition: { duration: 1.1, ease: ease.cinematic } },
}

// ── Stagger containers ────────────────────────────────────────────────────────
export const staggerFast = (delay = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
})

export const staggerMed = (delay = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.085, delayChildren: delay } },
})

export const staggerSlow = (delay = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: delay } },
})

// ── Word / char splits ────────────────────────────────────────────────────────
export const wordReveal: Variants = {
  hidden:  { y: '115%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: ease.smooth } },
}

export const charReveal: Variants = {
  hidden:  { y: '120%', opacity: 0, rotateX: 18 },
  visible: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.52, ease: ease.smooth } },
}

export const wordBlur: Variants = {
  hidden:  { opacity: 0, filter: 'blur(8px)', y: 18 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0,  transition: { duration: 0.62, ease: ease.smooth } },
}
