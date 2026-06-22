import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useExperience } from '@/hooks/usePortfolioData'
import { useSceneStore } from '@/stores/sceneStore'
import type { TimelineEntry } from '@/types'

const JourneyScene = lazy(() =>
  import('@/three/scenes/JourneyScene').then((m) => ({ default: m.JourneyScene })),
)

function ExperienceRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderTop: '1px solid var(--c-divider)' }}
      className="py-8 md:py-[40px]"
    >
      {/* Mobile: stacked layout | Desktop: two-column grid */}
      <div className="flex flex-col sm:grid sm:gap-[60px]"
        style={{ gridTemplateColumns: 'clamp(140px, 25%, 280px) 1fr' }}
      >
        {/* Left: period + place */}
        <div className="mb-3 sm:mb-0 sm:pt-1">
          <p className="font-mono text-sm sm:text-[1.05rem] leading-snug" style={{ color: 'var(--c-teal)' }}>
            {entry.date}
          </p>
          {entry.organization && (
            <p className="text-sm sm:text-[0.95rem] mt-1 sm:mt-2 leading-snug" style={{ color: 'var(--c-text-subtle)' }}>
              {entry.organization}
            </p>
          )}
        </div>

        {/* Right: role + company + description */}
        <div>
          <h3
            className="font-serif italic leading-[1.04] text-text-primary mb-2"
            style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)' }}
          >
            {entry.title}
          </h3>
          {entry.organization && (
            <p className="text-base sm:text-[1.1rem] mb-3 sm:mb-4 font-medium" style={{ color: 'var(--c-teal)' }}>
              {entry.organization}
            </p>
          )}
          <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.6]" style={{ color: 'var(--c-text-muted)' }}>
            {entry.description}
          </p>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-4">
              {entry.tags.map((tag) => (
                <span key={tag} className="code-tag text-[9px]">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function JourneySection() {
  const { webGLSupported, reducedMotion } = useSceneStore()
  const { data: timeline, isLoading, isError } = useExperience()
  const entries = (timeline ?? []).filter((e) => e.type === 'work' || e.type === 'education')

  return (
    <section id="journey" className="section-spacing section-padding relative" aria-label="Career Journey">
      {webGLSupported && !reducedMotion && (timeline ?? []).length > 0 && (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" aria-hidden="true">
          <Suspense fallback={null}>
            <JourneyScene entries={timeline ?? []} activeId={null} />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label="02 · Experience"
          title="The journey so far"
          subtitle="From mechanical engineering to building enterprise fintech systems — a deliberate pivot and three years of deep specialization."
        />

        <div className="mt-10 sm:mt-14">
          {isLoading && (
            <div className="space-y-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 sm:h-32 animate-pulse rounded-lg"
                  style={{ background: 'var(--c-overlay-subtle)' }}
                />
              ))}
            </div>
          )}
          {isError && (
            <p className="text-red-400 text-sm py-8">
              Failed to load timeline. Ensure the backend is running.
            </p>
          )}
          {entries.map((entry, i) => (
            <ExperienceRow key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
