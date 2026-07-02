import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { getLenis } from '@/lib/lenis'

export function BackToTop() {
  // Boolean selector — only re-renders when crossing the threshold
  const visible = useUIStore((s) => s.scrollY > 700)

  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Back to top"
          data-cursor-label="Top"
          className="fixed bottom-6 right-6 z-[9000] flex items-center justify-center w-11 h-11 rounded-full"
          style={{
            background: 'rgba(var(--c-bg-rgb), 0.85)',
            border: '1px solid rgba(var(--c-teal-rgb), 0.35)',
            color: 'var(--c-teal)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25), 0 0 20px rgba(var(--c-teal-rgb),0.12)',
          }}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          whileHover={{ scale: 1.08, boxShadow: '0 6px 28px rgba(0,0,0,0.3), 0 0 32px rgba(var(--c-teal-rgb),0.28)' }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowUp size={17} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
