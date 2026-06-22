import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, fadeDown, fadeLeft, fadeRight, blurUp, scaleIn } from '@/animations/variants'
import type { Variants } from 'framer-motion'

const PRESETS: Record<string, Variants> = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  blurUp,
  scaleIn,
}

type HtmlTag = 'div' | 'section' | 'article' | 'aside' | 'span' | 'p' | 'li' | 'ul'

interface Props {
  children: React.ReactNode
  preset?: keyof typeof PRESETS
  variants?: Variants
  delay?: number
  duration?: number
  once?: boolean
  margin?: string
  className?: string
  style?: React.CSSProperties
  as?: HtmlTag
}

export function ScrollReveal({
  children,
  preset = 'fadeUp',
  variants,
  delay = 0,
  duration,
  once = true,
  margin = '-60px',
  className,
  style,
  as = 'div',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: margin as `${number}px` })

  const base = variants ?? PRESETS[preset]

  const finalVariants: Variants = duration
    ? {
        hidden: base.hidden,
        visible: {
          ...((base.visible as object) ?? {}),
          transition: {
            ...(((base.visible as Record<string, unknown>)?.transition as object) ?? {}),
            duration,
            delay,
          },
        },
      }
    : delay
    ? {
        hidden: base.hidden,
        visible: {
          ...((base.visible as object) ?? {}),
          transition: {
            ...(((base.visible as Record<string, unknown>)?.transition as object) ?? {}),
            delay,
          },
        },
      }
    : base

  const MotionEl = motion[as] as typeof motion.div

  return (
    <MotionEl
      ref={ref as React.Ref<HTMLDivElement>}
      variants={finalVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      style={style}
    >
      {children}
    </MotionEl>
  )
}
