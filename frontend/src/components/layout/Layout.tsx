import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { NavBar } from '@/components/ui/NavBar'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { BackToTop } from '@/components/ui/BackToTop'
import { SmokeBackground } from '@/three/scenes/SmokeBackground'
import { useUIStore } from '@/stores/uiStore'
import { useWebGLDetection } from '@/three/hooks/useWebGL'
import { setLenis } from '@/lib/lenis'

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

  /* Apply theme class to <html> so CSS variables resolve correctly.
     theme-switching enables the global color cross-fade only for the toggle
     itself — it stays off during normal scrolling for performance. */
  const firstThemeRender = useRef(true)
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)

    if (firstThemeRender.current) {
      firstThemeRender.current = false
      return
    }
    root.classList.add('theme-switching')
    const id = setTimeout(() => root.classList.remove('theme-switching'), 400)
    return () => {
      clearTimeout(id)
      root.classList.remove('theme-switching')
    }
  }, [theme])

  /* Async content (API data, boot sequence, images) changes the page height
     AFTER ScrollTrigger pins have measured their start/end positions. Stale
     measurements make pinned panels engage at the wrong scroll offset and
     overlap surrounding content — re-measure whenever the body resizes. */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      // Native scroll only — still feed scrollY to the store for the navbar
      const onScroll = () => setScrollY(window.scrollY)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      // lerp gives a continuous, interruptible glide (more natural than a
      // fixed-duration ease when the user keeps scrolling)
      lerp: 0.095,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.3,
    })
    lenisRef.current = lenis
    setLenis(lenis)

    lenis.on('scroll', (e: { scroll: number }) => {
      setScrollY(e.scroll)
    })

    // Wire Lenis to GSAP ticker so ScrollTrigger tracks smooth-scroll position
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    // Route in-page anchor clicks through Lenis so they glide instead of jump
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, {
        offset: -64,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(ticker)
      setLenis(null)
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
      <BackToTop />
      {/* Static film grain — adds subtle texture that unifies the dark surfaces */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  )
}
