import { useRef, Fragment } from 'react'
import { motion, useInView } from 'framer-motion'
import { wordReveal, charReveal, wordBlur, staggerFast, staggerMed } from '@/animations/variants'
import type { Variants } from 'framer-motion'

type Mode = 'word' | 'char' | 'wordBlur'

interface Props {
  children: string
  mode?: Mode
  delay?: number
  className?: string
  style?: React.CSSProperties
  once?: boolean
}

const CHILD_VARIANTS: Record<Mode, Variants> = {
  word:     wordReveal,
  char:     charReveal,
  wordBlur: wordBlur,
}

export function SplitText({ children, mode = 'word', delay = 0, className, style, once = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  const text = String(children)
  const tokens: string[] = mode === 'char' ? text.split('') : text.split(' ')

  const containerVariants: Variants =
    mode === 'char' ? staggerFast(delay) : staggerMed(delay)

  const childVariant = CHILD_VARIANTS[mode]

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline', ...style }}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {tokens.map((token, i) => (
        <Fragment key={i}>
          <span
            className="inline-block overflow-hidden"
            style={{ verticalAlign: 'top', perspective: '400px' }}
          >
            <motion.span className="inline-block" variants={childVariant}>
              {token}
            </motion.span>
          </span>
          {mode !== 'char' && i < tokens.length - 1 && (
            <span className="inline-block" style={{ width: '0.3em' }} />
          )}
        </Fragment>
      ))}
    </motion.span>
  )
}
