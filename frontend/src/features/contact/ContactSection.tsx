import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { useSiteSettings } from '@/hooks/usePortfolioData'
import { MeetingBooking } from './MeetingBooking'
import { SplitText } from '@/components/ui/SplitText'

export function ContactSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' })
  const { data: settings } = useSiteSettings()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 0.14, 0.14, 0])
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['40px', '-40px'])
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['-30px', '30px'])

  const email       = settings?.email      ?? 'ghanshyamdesale1421@gmail.com'
  const phone       = settings?.phone      ?? '+91 7498770064'
  const location    = settings?.location   ?? 'Mumbai, India'
  const linkedinUrl = settings?.linkedinUrl ?? '#'
  const githubUrl   = settings?.githubUrl  ?? '#'

  return (
    <section ref={sectionRef} id="contact" className="section-spacing section-padding relative overflow-hidden" aria-label="Contact">

      {/* Radial teal glow — fades in as section enters view */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[900px] h-[500px]"
        style={{ opacity: glowOpacity, background: 'radial-gradient(ellipse 60% 55% at 50% 0%, var(--c-teal) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Floating ambient blobs — parallax on scroll */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="float-blob absolute rounded-full"
          style={{
            width: 320, height: 320,
            top: '10%', right: '5%',
            background: 'radial-gradient(circle, rgba(var(--c-violet-rgb),0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            y: blob1Y,
            willChange: 'transform',
          }}
        />
        <motion.div
          className="float-blob-slow absolute rounded-full"
          style={{
            width: 260, height: 260,
            bottom: '15%', left: '8%',
            background: 'radial-gradient(circle, rgba(var(--c-teal-rgb),0.05) 0%, transparent 70%)',
            filter: 'blur(36px)',
            y: blob2Y,
            willChange: 'transform',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Section heading */}
        <div ref={headingRef} className="text-center mb-10 sm:mb-12">
          <motion.p
            className="font-mono text-[11px] tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--c-teal)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            07 · Let's talk
          </motion.p>
          <h2
            className="font-serif italic text-text-primary leading-[.9] mb-4 overflow-hidden"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 8rem)', textShadow: '0 6px 40px var(--c-teal-glow)' }}
          >
            <SplitText mode="word" delay={0.1}>
              Let's build something fast.
            </SplitText>
          </h2>
          <motion.p
            className="text-text-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.45 }}
          >
            Pick a time that works — book a 30-minute intro call below.
          </motion.p>
        </div>

        {/* Calendar booking widget */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <MeetingBooking />
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 sm:my-14">
          <div className="h-px flex-1" style={{ background: 'var(--c-divider)' }} />
          <span className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase whitespace-nowrap">
            or reach out directly
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--c-divider)' }} />
        </div>

        {/* Direct contact + socials */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href={`mailto:${email}`}
            data-cursor-label="Email"
            className="inline-flex items-center gap-3 border rounded-full font-serif transition-all duration-300 hover:-translate-y-1 break-all text-center"
            style={{
              borderColor: 'var(--c-overlay-medium)',
              color: 'var(--c-text)',
              fontSize: 'clamp(0.85rem, 2vw, 1.4rem)',
              padding: 'clamp(10px, 2vw, 14px) clamp(16px, 4vw, 32px)',
              background: 'rgba(var(--c-bg-rgb), 0.42)',
              backdropFilter: 'blur(18px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 var(--c-overlay-faint)',
            }}
          >
            {email} →
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-5 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { href: linkedinUrl, icon: Linkedin, label: 'LinkedIn', color: '#0EA5E9', cursorLabel: 'LinkedIn' },
            { href: githubUrl,   icon: Github,   label: 'GitHub',   color: 'var(--c-text)', cursorLabel: 'GitHub' },
          ].map(({ href, icon: Icon, label, color, cursorLabel }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label={cursorLabel}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] text-text-muted hover:text-text-primary transition-all duration-300 hover:-translate-y-1"
              style={{
                border: '1px solid var(--c-overlay-light)',
                background: 'rgba(var(--c-bg-rgb), 0.38)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <Icon size={12} style={{ color }} />
              {label}
            </a>
          ))}
        </motion.div>

        {/* Footer row */}
        <motion.div
          className="flex items-center justify-center flex-wrap gap-4 sm:gap-5 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t"
          style={{ borderColor: 'var(--c-divider)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[phone, location, 'Open to opportunities'].map((item, i) => (
            <span
              key={i}
              className="font-mono text-[11px] sm:text-[12px]"
              style={{ color: i === 2 ? 'var(--c-teal)' : 'var(--c-text-subtle)' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
