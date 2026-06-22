import { useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/uiStore'

interface Particle {
  x: number; y: number
  radius: number; opacity: number
  vy: number; vx: number
  phase: number; drift: number
  life: number; maxLife: number
  speed: number
  teal: boolean
}

function createParticle(w: number, h: number): Particle {
  const radius = Math.random() * 100 + 50
  return {
    x: Math.random() * w,
    y: h + radius,
    radius,
    opacity: Math.random() * 0.048 + 0.012,
    vy: -(Math.random() * 0.38 + 0.12),
    vx: (Math.random() - 0.5) * 0.22,
    phase: Math.random() * Math.PI * 2,
    drift: Math.random() * 0.009 + 0.003,
    life: 0,
    maxLife: Math.random() * 320 + 200,
    speed: Math.random() * 0.55 + 0.7,
    teal: Math.random() < 0.28,
  }
}

export function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width  = w
    canvas.height = h

    const TOTAL = 85
    const particles: Particle[] = Array.from({ length: TOTAL }, () => {
      const p = createParticle(w, h)
      p.y    = Math.random() * h
      p.life = Math.random() * p.maxLife
      return p
    })

    const scrollVel = { current: 0, target: 0 }
    let lastScrollY   = window.scrollY
    let lastScrollTime = Date.now()

    const onScroll = () => {
      const now  = Date.now()
      const dt   = Math.max(1, now - lastScrollTime)
      const delta = window.scrollY - lastScrollY
      scrollVel.target = (delta / dt) * 10
      lastScrollY   = window.scrollY
      lastScrollTime = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w; canvas.height = h
    }
    window.addEventListener('resize', resize)

    let raf: number
    let t = 0

    function draw() {
      t += 0.008
      scrollVel.current += (scrollVel.target - scrollVel.current) * 0.08
      scrollVel.target  *= 0.88

      ctx!.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.life++
        const scrollEffect = scrollVel.current * p.speed * 0.055
        p.x += p.vx + Math.sin(t * p.drift * 12 + p.phase) * 0.3
        p.y += p.vy - scrollEffect

        const lifeRatio = p.life / p.maxLife
        const fade = lifeRatio < 0.18
          ? lifeRatio / 0.18
          : lifeRatio > 0.72
          ? (1 - lifeRatio) / 0.28
          : 1
        const alpha = p.opacity * fade

        const scrollBoost = Math.min(Math.abs(scrollVel.current) * 0.015, 0.35)
        const boostedAlpha = Math.min(alpha * (1 + scrollBoost), 0.12)

        const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        if (p.teal) {
          grd.addColorStop(0,    `rgba(111,227,210,${(boostedAlpha * 0.78).toFixed(3)})`)
          grd.addColorStop(0.5,  `rgba(80,200,185,${(boostedAlpha * 0.28).toFixed(3)})`)
          grd.addColorStop(1,    'rgba(111,227,210,0)')
        } else {
          grd.addColorStop(0,    `rgba(255,255,255,${(boostedAlpha * 0.9).toFixed(3)})`)
          grd.addColorStop(0.45, `rgba(230,240,255,${(boostedAlpha * 0.35).toFixed(3)})`)
          grd.addColorStop(1,    'rgba(255,255,255,0)')
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = grd
        ctx!.fill()

        if (
          p.life >= p.maxLife ||
          p.y + p.radius < 0 ||
          p.x < -p.radius * 2 ||
          p.x > w + p.radius * 2
        ) {
          Object.assign(p, createParticle(w, h))
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const opacity     = theme === 'dark' ? 1 : 0.4
  const blendMode   = theme === 'light' ? 'multiply' : 'normal'

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        transition: 'opacity 0.7s ease',
        mixBlendMode: blendMode,
      }}
    />
  )
}
