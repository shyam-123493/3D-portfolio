import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useUIStore } from '@/stores/uiStore'
import { useSceneStore } from '@/stores/sceneStore'

const BOOT_LINES = [
  '> Initializing Engineer Profile...',
  '> Loading angular.core .............. OK',
  '> Loading fintech.systems ........... OK',
  '> Loading ai.exploration ............ OK',
  '> Mounting component tree ........... OK',
  '> WebGL context established ......... OK',
]

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement[]>([])
  const { setBootComplete } = useUIStore()
  const { webGLSupported } = useSceneStore()

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          onComplete: () => {
            setBootComplete(true)
            onComplete()
          },
        })
      },
    })

    linesRef.current.forEach((el, i) => {
      if (!el) return
      tl.fromTo(
        el,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' },
        i * 0.22,
      )
    })

    return () => { tl.kill() }
  }, [onComplete, setBootComplete])

  const lines = webGLSupported
    ? BOOT_LINES
    : [...BOOT_LINES.slice(0, 4), '> WebGL unavailable ................ FALLBACK', '> Rendering 2D mode ................ OK']

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary"
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative w-full max-w-lg px-8">
        {/* Terminal chrome */}
        <div className="surface-card overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="font-mono text-xs text-text-muted ml-2">ghanshyam.exe — zsh</span>
          </div>

          {/* Output lines */}
          <div className="p-6 space-y-2 font-mono text-sm">
            {lines.map((line, i) => (
              <div
                key={i}
                ref={(el) => { if (el) linesRef.current[i] = el }}
                className={
                  line.includes('OK')
                    ? 'text-accent-emerald opacity-0'
                    : line.includes('FALLBACK')
                      ? 'text-accent-amber opacity-0'
                      : 'text-text-secondary opacity-0'
                }
                style={{ opacity: 0 }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Name reveal — appears just before exit */}
        <div className="mt-8 text-center opacity-0" id="boot-name">
          <p className="label-mono mb-1">Inside</p>
          <p className="font-display font-bold text-2xl text-text-primary tracking-tight">
            GHANSHYAM.EXE
          </p>
        </div>
      </div>
    </div>
  )
}
