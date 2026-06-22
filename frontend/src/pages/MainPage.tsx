import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BootSequence } from '@/features/hero/BootSequence'
import { HeroSection } from '@/features/hero/HeroSection'
import { JourneySection } from '@/features/journey/JourneySection'
import { ProjectUniverse } from '@/features/project-universe/ProjectUniverse'
import { EngineeringSystems } from '@/features/engineering-systems/EngineeringSystems'
import { AILab } from '@/features/ai-lab/AILab'
import { Achievements } from '@/features/achievements/Achievements'
import { ContactSection } from '@/features/contact/ContactSection'
import { RecruiterView } from '@/features/recruiter-view/RecruiterView'
import { MarqueeRibbon } from '@/components/ui/MarqueeRibbon'
import { useUIStore } from '@/stores/uiStore'

function FooterBar() {
  return (
    <footer className="section-padding py-10 border-t border-border-subtle" role="contentinfo">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-text-muted tracking-[0.14em] uppercase">
          © {new Date().getFullYear()} Ghanshyam Desale
        </p>
        <p className="font-mono text-[10px] text-text-muted tracking-[0.14em] uppercase">
          React · Three.js · Django · Mumbai, India
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-accent-teal/60" />
          <span className="font-mono text-[9px] text-text-muted tracking-widest">Built with intention</span>
        </div>
      </div>
    </footer>
  )
}

const RIBBON_SKILLS = [
  'React', 'Angular', 'TypeScript', 'Three.js', 'Framer Motion',
  'Django', 'REST API', 'WebSockets', 'IndexedDB', 'PWA', 'Node.js',
]

const RIBBON_PROJECTS = [
  'Engineered', 'Refined', 'Production-grade', 'Shipped with care',
  'Full Stack', 'Scalable', 'Crafted', 'Delivered',
]

const RIBBON_AI = [
  'OpenAI', 'LangChain', 'RAG Pipeline', 'AI Integration',
  'Fine-tuning', 'Prompt Engineering', 'Vector Search', 'Semantic API',
]

export function MainPage() {
  const { bootComplete } = useUIStore()
  const [showContent, setShowContent] = useState(false)

  const handleBootComplete = useCallback(() => {
    setShowContent(true)
  }, [])

  return (
    <>
      {!bootComplete && <BootSequence onComplete={handleBootComplete} />}

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroSection />

            <MarqueeRibbon
              items={RIBBON_SKILLS}
              speed={42}
              direction="left"
              accent="var(--c-teal)"
            />

            <JourneySection />

            <MarqueeRibbon
              items={RIBBON_PROJECTS}
              speed={35}
              direction="right"
              accent="var(--c-violet)"
            />

            <ProjectUniverse />
            <EngineeringSystems />

            <MarqueeRibbon
              items={RIBBON_AI}
              speed={40}
              direction="left"
              accent="#00D4FF"
            />

            <AILab />
            <Achievements />
            <ContactSection />
            <FooterBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recruiter view — always mounted so it can be opened from nav */}
      <RecruiterView />
    </>
  )
}
