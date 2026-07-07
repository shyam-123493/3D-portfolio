import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useExperience, useSiteSettings } from '@/hooks/usePortfolioData'
import { useSceneStore } from '@/stores/sceneStore'
import type { TimelineEntry } from '@/types'

const JourneyScene = lazy(() =>
  import('@/three/scenes/JourneyScene').then((m) => ({ default: m.JourneyScene })),
)

function ExperienceRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -44 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.72, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } as any}
      className="relative rounded-xl overflow-hidden mb-4"
      style={{
        background: 'rgba(var(--c-bg-rgb), 0.48)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
        border: '1px solid var(--c-overlay-light)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 20px 48px rgba(0,0,0,0.03), inset 0 1px 0 var(--c-overlay-faint)',
      }}
    >
      {/* Teal left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: 'linear-gradient(180deg, rgba(var(--c-teal-rgb),0.70), rgba(var(--c-teal-rgb),0.06))' }}
      />
      <div className="py-8 md:py-[40px] pl-8 sm:pl-10 pr-6">
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
      </div>
    </motion.div>
  )
}

export function JourneySection() {
  const { webGLSupported, reducedMotion } = useSceneStore()
  const { data: timeline, isLoading, isError } = useExperience()
  const { data: settings } = useSiteSettings()
  const entries = (timeline ?? []).filter((e) => e.type === 'work' || e.type === 'education')
  const years = settings?.yearsExperience ?? 3

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0px', '-80px'])

  return (
    <section ref={sectionRef} id="journey" className="section-spacing section-padding relative" aria-label="Career Journey">
      {/* Depth grid background — parallaxes at 0.6x scroll rate */}
      <motion.div
        className="ag-depth-bg absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ y: bgY, willChange: 'transform' }}
      />

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
          subtitle={`From mechanical engineering to building enterprise fintech systems — a deliberate pivot and ${years}+ years of deep specialization.`}
        />

        <div className="mt-10 sm:mt-14 relative">
          {/* Animated vertical timeline spine */}
          {entries.length > 0 && (
            <motion.div
              className="absolute hidden sm:block pointer-events-none"
              style={{
                left: 0,
                top: 24,
                bottom: 24,
                width: 3,
                background: 'linear-gradient(to bottom, transparent, rgba(var(--c-teal-rgb),0.22) 15%, rgba(var(--c-violet-rgb),0.18) 70%, transparent)',
                borderRadius: 2,
              }}
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
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
              Couldn't load the timeline — the server may still be waking up. Please refresh in a moment.
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
