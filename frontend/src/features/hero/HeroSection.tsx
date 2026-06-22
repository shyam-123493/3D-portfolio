import { lazy, Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, Star } from 'lucide-react'
import { useSceneStore } from '@/stores/sceneStore'
import { useSiteSettings } from '@/hooks/usePortfolioData'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ParallaxLayer } from '@/components/ui/ParallaxLayer'

const HeroScene = lazy(() =>
  import('@/three/scenes/HeroScene').then((m) => ({ default: m.HeroScene })),
)

// ── Role cycler data ───────────────────────────────────────────────────────────
const ROLES = [
  { title: 'Frontend Developer',   accent: 'var(--c-teal)',   accentRgb: 'var(--c-teal-rgb)' },
  { title: 'Full Stack Developer', accent: 'var(--c-violet)', accentRgb: 'var(--c-violet-rgb)' },
  { title: 'Web Designer',         accent: '#00D4FF',         accentRgb: '0,212,255' },
  { title: 'AI Developer',         accent: '#F59E0B',         accentRgb: '245,158,11' },
]

function RoleCycler() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % ROLES.length), 2900)
    return () => clearInterval(id)
  }, [])

  const role = ROLES[idx]

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Big cycling title */}
      <div className="relative" style={{ minHeight: 'clamp(3rem, 10vw, 10.5rem)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={idx}
            className="font-display font-black uppercase text-text-primary leading-none tracking-[0.02em] text-center"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 9rem)' }}
            initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
            animate={{ y: 0,  opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -60, opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
          >
            {role.title}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Animated accent bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bar-${idx}`}
          className="h-[3px] rounded-full"
          style={{ background: role.accent, boxShadow: `0 0 16px rgba(${role.accentRgb},0.55)` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ width: 'clamp(60px, 12vw, 120px)', height: '100%' }} />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators — click to jump to role */}
      <div className="flex items-center gap-2">
        {ROLES.map((r, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Switch to ${r.title}`}
            className="rounded-full transition-all duration-300 focus-visible:outline-none"
            style={{
              height: 3,
              width: i === idx ? 22 : 6,
              background: i === idx ? role.accent : 'var(--c-text-muted)',
              opacity: i === idx ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function fade(delay: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  }
}

export function HeroSection() {
  const { webGLSupported, reducedMotion } = useSceneStore()
  const { data: settings } = useSiteSettings()

  const name = settings?.name ?? 'Ghanshyam Desale'
  const firstName = name.split(' ')[0]

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col"
      aria-label="Hero — Introduction"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-bg-primary" />

      {/* Floating ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="float-blob absolute rounded-full"
          style={{
            width: 480, height: 480,
            top: '8%', left: '6%',
            background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),0.07) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="float-blob-rev absolute rounded-full"
          style={{
            width: 360, height: 360,
            top: '20%', right: '8%',
            background: 'radial-gradient(circle, rgba(var(--c-violet-rgb),0.06) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="float-blob-slow absolute rounded-full"
          style={{
            width: 280, height: 280,
            bottom: '25%', left: '18%',
            background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),0.05) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />
      </div>

      {/* Profile photo — larger, full-height with subtle parallax */}
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        <ParallaxLayer speed={0.12} direction="up" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
          <img
            src="/profile.png"
            alt=""
            aria-hidden="true"
            style={{
              height: '100vh',
              width: 'clamp(320px, 62vw, 680px)',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              filter: 'brightness(0.92)',
            }}
            draggable={false}
          />
        </ParallaxLayer>
      </div>

      {/* Gradient overlay — theme-aware */}
      <div
        className="absolute inset-0 hero-overlay"
        style={{
          background: [
            'radial-gradient(ellipse 70% 80% at 50% 55%, transparent 45%, rgba(var(--c-bg-rgb),0.70) 78%, rgba(var(--c-bg-rgb),0.97) 100%)',
            'linear-gradient(to bottom, rgba(var(--c-bg-rgb),0.88) 0%, rgba(var(--c-bg-rgb),0.12) 22%, rgba(var(--c-bg-rgb),0) 52%, rgba(var(--c-bg-rgb),0.80) 100%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* 3D floating gems */}
      {webGLSupported && !reducedMotion && (
        <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}

      {/* Top-left: Angular · PWA · Mumbai tag */}
      <motion.div
        className="absolute top-20 sm:top-24 left-4 sm:left-6 md:left-12 lg:left-20 xl:left-28 z-20 flex items-center gap-2 sm:gap-3"
        {...fade(0.3)}
      >
        <span className="w-5 sm:w-8 h-px flex-shrink-0" style={{ background: 'var(--c-teal)' }} />
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.26em] uppercase" style={{ color: 'var(--c-teal)' }}>
          Angular · PWA · Mumbai
        </span>
      </motion.div>

      {/* Profile data chips — upper right */}
      <motion.div
        className="absolute top-20 sm:top-24 right-4 sm:right-6 md:right-12 lg:right-20 xl:right-28 z-20 flex flex-col gap-1.5 sm:gap-2 items-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5"
          style={{
            background: 'var(--c-glass-sm)',
            border: '1px solid rgba(var(--c-teal-rgb),0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 teal-pulse" style={{ background: 'var(--c-teal)' }} />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--c-teal)' }}>
            Open to work
          </span>
        </div>

        {[
          { icon: Briefcase, label: '3+ Years Exp.' },
          { icon: MapPin,    label: 'Mumbai, India' },
          { icon: Star,      label: '5 Production Apps' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="hidden xs:flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5"
            style={{
              background: 'var(--c-glass-sm)',
              border: '1px solid var(--c-overlay-light)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Icon size={10} style={{ color: 'var(--c-text-muted)', flexShrink: 0 }} />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-wide" style={{ color: 'var(--c-text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Centered hero text */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-end text-center px-4 sm:px-6 pb-20 sm:pb-24">
        <motion.p
          className="font-serif text-text-secondary leading-none mb-2"
          style={{ fontSize: 'clamp(1.3rem, 3vw, 3rem)', opacity: 0.85 }}
          {...fade(0.5)}
        >
          I'm <span className="italic">{firstName}</span> — a
        </motion.p>

        {/* Role cycler with entrance animation wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <RoleCycler />
        </motion.div>
      </div>

      {/* Bottom CTA buttons — magnetic */}
      <motion.div
        className="relative z-20 flex items-center justify-center flex-wrap gap-2 sm:gap-3 pb-8 sm:pb-10 px-4 sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <MagneticButton href="#engineering">
          <span
            className="font-mono text-[11px] sm:text-[12px] tracking-[0.1em] rounded-full px-4 sm:px-6 py-2 sm:py-2.5 block transition-colors duration-200"
            style={{
              color: 'var(--c-text-muted)',
              background: 'var(--c-glass-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Services
          </span>
        </MagneticButton>

        <MagneticButton href="#contact" strength={0.4}>
          <span
            className="font-mono text-[11px] sm:text-[12px] tracking-[0.1em] font-semibold rounded-full px-4 sm:px-6 py-2 sm:py-2.5 block"
            style={{ background: 'var(--c-teal)', color: 'var(--c-bg)' }}
          >
            Contact →
          </span>
        </MagneticButton>

        <MagneticButton href="#projects">
          <span
            className="font-mono text-[11px] sm:text-[12px] tracking-[0.1em] rounded-full px-4 sm:px-6 py-2 sm:py-2.5 block transition-colors duration-200"
            style={{
              color: 'var(--c-text-muted)',
              background: 'var(--c-glass-sm)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(8px)',
            }}
          >
            See my projects
          </span>
        </MagneticButton>
      </motion.div>
    </section>
  )
}
