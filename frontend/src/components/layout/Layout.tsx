import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { NavBar } from '@/components/ui/NavBar'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { SmokeBackground } from '@/three/scenes/SmokeBackground'
import { useUIStore } from '@/stores/uiStore'
import { useWebGLDetection } from '@/three/hooks/useWebGL'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[10000] pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--c-teal) 0%, var(--accent-violet) 55%, var(--c-teal) 100%)',
      }}
    />
  )
}

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  const { setScrollY, theme } = useUIStore()
  const lenisRef = useRef<Lenis | null>(null)

  useWebGLDetection()

  /* Apply theme class to <html> so CSS variables resolve correctly */
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', (e: { scroll: number }) => {
      setScrollY(e.scroll)
    })

    let raf: number
    function tick(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [setScrollY])

  return (
    <>
      <SmokeBackground />
      <ScrollProgress />
      <CustomCursor />
      <NavBar />
      <main id="main-content" tabIndex={-1} style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </>
  )
}
