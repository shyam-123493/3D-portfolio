import { useEffect, useRef, useState, useCallback } from 'react'

export const GLOBE_SKILLS = [
  { name: 'Angular',         color: '#dd0031', detail: 'Primary framework — 3+ yrs of enterprise PWAs' },
  { name: 'TypeScript',      color: '#3178c6', detail: 'Type-safe app architecture across all projects' },
  { name: 'JavaScript',      color: '#f7df1e', detail: 'Core web platform language' },
  { name: 'RxJS',            color: '#b7178c', detail: 'Reactive state & async streams in Angular' },
  { name: 'PWA',             color: '#5a0fc8', detail: 'Installable, offline-first apps' },
  { name: 'HTML / CSS',      color: '#e34f26', detail: 'Semantic markup & responsive styling' },
  { name: 'Java',            color: '#f89820', detail: 'Backend services & API foundations' },
  { name: 'Spring Boot',     color: '#6db33f', detail: 'REST API backends' },
  { name: 'IndexedDB',       color: '#4dabf7', detail: 'Offline caching layer for payment flows' },
  { name: 'REST APIs',       color: '#22b8cf', detail: 'Integration across fintech platforms' },
  { name: 'Service Workers', color: '#9775fa', detail: 'Background sync & caching strategies' },
  { name: 'WebSockets',      color: '#20c997', detail: 'Real-time data channels' },
  { name: 'CleverTap',       color: '#e64980', detail: 'Engagement & event analytics' },
  { name: 'GA4',             color: '#fab005', detail: 'Web analytics & funnels' },
  { name: 'GTM',             color: '#4263eb', detail: 'Tag management & data layers' },
  { name: 'AWS S3',          color: '#ff9900', detail: 'Asset hosting & dynamic config' },
  { name: 'CI/CD',           color: '#51cf66', detail: 'Automated build & release pipelines' },
  { name: 'Git',             color: '#f1502f', detail: 'Version control & collaboration' },
  { name: 'Docker',          color: '#2496ed', detail: 'Containerised environments' },
] as const

type Skill = typeof GLOBE_SKILLS[number]

// Fibonacci sphere positions — computed once at module load
const R = 210
const PTS = GLOBE_SKILLS.map((skill, i) => {
  const y = 1 - (i / (GLOBE_SKILLS.length - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = Math.PI * (3 - Math.sqrt(5)) * i
  return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, skill }
})

interface Tip { x: number; y: number; skill: Skill }

export function SkillGlobe() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const nodeRefs   = useRef<(HTMLDivElement | null)[]>([])
  const angRef     = useRef(0)
  const rafRef     = useRef(0)
  const drag       = useRef({ active: false, lastX: 0, velocity: 0 })
  const playingRef = useRef(false)
  const [tip, setTip] = useState<Tip | null>(null)
  const reduceMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  const applyPositions = useCallback(() => {
    const cos = Math.cos(angRef.current)
    const sin = Math.sin(angRef.current)
    PTS.forEach((p, i) => {
      const el = nodeRefs.current[i]
      if (!el) return
      const x  = p.x * cos - p.z * sin
      const z  = p.x * sin + p.z * cos
      const sc = (z + 1.6) / 2.6   // depth scale [~0 … 1]
      el.style.transform = `translate(-50%,-50%) translate3d(${(x * R).toFixed(1)}px,${(p.y * R).toFixed(1)}px,0) scale(${sc.toFixed(3)})`
      el.style.opacity   = (0.3 + sc * 0.7).toFixed(3)
      el.style.zIndex    = String(Math.round(sc * 100))
    })
  }, [])

  useEffect(() => {
    function loop() {
      if (!playingRef.current) return
      if (!drag.current.active && !reduceMotion.current) angRef.current += 0.0035
      if (drag.current.velocity) {
        angRef.current      += drag.current.velocity
        drag.current.velocity *= 0.93
        if (Math.abs(drag.current.velocity) < 0.00015) drag.current.velocity = 0
      }
      applyPositions()
      rafRef.current = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!playingRef.current) { playingRef.current = true; loop() }
        } else {
          playingRef.current = false
          cancelAnimationFrame(rafRef.current)
        }
      },
      { threshold: 0 },
    )

    const el = wrapRef.current
    if (el) io.observe(el)

    // Kick off immediately if already in view
    applyPositions()
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight + 100) { playingRef.current = true; loop() }
    }

    return () => {
      playingRef.current = false
      cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, [applyPositions])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, velocity: 0 }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    // If paused (reduced-motion), still allow drag
    if (!playingRef.current) { playingRef.current = true }
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.active) return
      const dx = (e.clientX - drag.current.lastX) * 0.006
      angRef.current      += dx
      drag.current.velocity = dx
      drag.current.lastX    = e.clientX
      applyPositions()
    },
    [applyPositions],
  )

  const onPointerUp = useCallback(() => {
    drag.current.active = false
  }, [])

  return (
    <div className="relative" style={{ padding: '20px 0 28px' }}>
      {/* Radial glow behind globe */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(111,227,210,0.07) 0%, transparent 65%)',
            'radial-gradient(ellipse 30% 28% at 50% 50%, rgba(139,125,255,0.05) 0%, transparent 58%)',
          ].join(', '),
        }}
      />

      {/* Drag hint */}
      <p
        className="absolute bottom-2 inset-x-0 text-center font-mono pointer-events-none"
        style={{ fontSize: 10, color: 'var(--c-text-muted)', letterSpacing: '0.22em' }}
      >
        DRAG TO SPIN · HOVER FOR DETAILS
      </p>

      {/* Globe viewport */}
      <div
        ref={wrapRef}
        className="relative mx-auto select-none"
        style={{
          width: R * 2,
          height: R * 2,
          cursor: 'grab',
          maxWidth: '100%',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label="Interactive skills globe — drag to rotate, hover a skill for details"
        role="img"
      >
        {PTS.map((p, i) => (
          <div
            key={p.skill.name}
            ref={(el) => { nodeRefs.current[i] = el }}
            onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, skill: p.skill })}
            onMouseMove={(e) => setTip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
            onMouseLeave={() => setTip(null)}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              padding: '4px 12px 4px 8px',
              borderRadius: 20,
              whiteSpace: 'nowrap',
              fontSize: 12,
              fontFamily: '"JetBrains Mono", "Fira Mono", monospace',
              fontWeight: 500,
              color: '#e6edf3',
              background: 'rgba(10, 14, 24, 0.88)',
              border: `1px solid ${p.skill.color}55`,
              userSelect: 'none',
              willChange: 'transform, opacity',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {/* Small color dot */}
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: p.skill.color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${p.skill.color}aa`,
              }}
            />
            {p.skill.name}
          </div>
        ))}
      </div>

      {/* Tooltip — position: fixed so it escapes overflow:clip on sections */}
      {tip && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: Math.min(
              tip.x + 18,
              (typeof window !== 'undefined' ? window.innerWidth : 800) - 260,
            ),
            top: Math.min(
              tip.y + 18,
              (typeof window !== 'undefined' ? window.innerHeight : 600) - 90,
            ),
            maxWidth: 248,
            zIndex: 9999,
            background: 'rgba(8, 12, 22, 0.97)',
            border: `1px solid ${tip.skill.color}44`,
            borderRadius: 10,
            padding: '10px 14px',
            color: '#cdd9e5',
            fontSize: 12,
            lineHeight: 1.55,
            boxShadow: `0 10px 36px rgba(0,0,0,0.65), 0 0 0 1px ${tip.skill.color}22`,
          }}
        >
          <div style={{ color: tip.skill.color, fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
            {tip.skill.name}
          </div>
          <div style={{ opacity: 0.72 }}>{tip.skill.detail}</div>
        </div>
      )}
    </div>
  )
}
