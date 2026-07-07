import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github } from 'lucide-react'
import { useSceneStore } from '@/stores/sceneStore'
import type { Project } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'text-accent-teal border-accent-teal/30 bg-accent-teal/10',
  backend: 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
  infra: 'text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10',
  analytics: 'text-accent-amber border-accent-amber/30 bg-accent-amber/10',
  mobile: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10',
  tooling: 'text-text-muted border-border-subtle bg-bg-surface',
}

function ArchitectureDiagram({ project }: { project: Project }) {
  if (!project.architecture) return null
  return (
    <div className="mt-6">
      <p className="label-mono mb-4">Architecture Overview</p>
      <div className="grid grid-cols-2 gap-3">
        {project.architecture.map((layer, i) => (
          <div key={i} className="surface-card p-4">
            <p className="font-mono text-xs font-medium mb-2" style={{ color: layer.color }}>{layer.label}</p>
            <ul className="space-y-1">
              {layer.items.map((item) => (
                <li key={item} className="text-xs text-text-muted flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProjectDetailProps {
  projects: Project[]
}

export function ProjectDetail({ projects }: ProjectDetailProps) {
  const { selectedProject, setSelectedProject } = useSceneStore()
  const project = projects.find((p) => p.slug === selectedProject) ?? null

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setSelectedProject])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  // Portalled to <body>: rendered inside <main> (zIndex: 1 stacking context)
  // the panel can never paint above the fixed NavBar, which covers the top
  // 56px — including the close button — on mobile where the panel is
  // full-width and Escape isn't available.
  return createPortal(
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 z-[9600] bg-bg-primary/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            aria-hidden="true"
          />

          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-[9610] w-full max-w-xl bg-bg-secondary border-l border-border-subtle overflow-y-auto custom-scrollbar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label={`Project details: ${project.title}`}
            aria-modal="true"
          >
            <div className="sticky top-0 bg-bg-secondary border-b border-border-subtle p-6 flex items-start justify-between gap-4 z-10">
              <div>
                <p className="label-mono mb-1" style={{ color: project.color }}>{project.domain}</p>
                <h2 className="font-display font-bold text-xl text-text-primary">{project.title}</h2>
                <p className="text-text-muted text-sm mt-1">{project.role}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="flex-shrink-0 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <p className="text-text-secondary leading-relaxed">{project.description}</p>
              </div>

              {project.contributions.length > 0 && (
                <div>
                  <p className="label-mono mb-4">Key Contributions</p>
                  <ul className="space-y-3">
                    {project.contributions.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: project.color }}
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.challenge && (
                <div className="grid gap-4">
                  <div className="surface-card p-4">
                    <p className="label-mono mb-2 text-accent-amber">Engineering Challenge</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{project.challenge}</p>
                  </div>
                  {project.solution && (
                    <div className="surface-card p-4">
                      <p className="label-mono mb-2" style={{ color: project.color }}>Solution Approach</p>
                      <p className="text-text-secondary text-sm leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="label-mono mb-4">Technology Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.name}
                      className={`font-mono text-xs px-2.5 py-1 rounded-md border ${CATEGORY_COLORS[tech.category] ?? 'text-text-muted border-border-subtle bg-bg-surface'}`}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {project.architecture && <ArchitectureDiagram project={project} />}

              <div className="flex gap-3 pt-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm gap-2">
                    <Github size={15} /> Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm gap-2">
                    <ExternalLink size={15} /> Live Project
                  </a>
                )}
                {!project.githubUrl && !project.liveUrl && (
                  <p className="text-text-muted text-xs font-mono">
                    Enterprise project — source and links confidential
                  </p>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
