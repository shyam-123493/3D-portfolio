export interface Project {
  id: number
  slug: string
  title: string
  role: string
  domain: string
  description: string
  contributions: string[]
  technologies: Technology[]
  architecture?: ArchitectureLayer[]
  challenge?: string
  solution?: string
  githubUrl?: string
  liveUrl?: string
  color: string
  position: [number, number, number]
  featured: boolean
}

export interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'infra' | 'analytics' | 'mobile' | 'tooling'
}

export interface ArchitectureLayer {
  label: string
  items: string[]
  color: string
}

export interface TimelineEntry {
  id: number
  date: string
  title: string
  organization?: string
  description: string
  type: 'education' | 'work' | 'achievement' | 'future'
  tags?: string[]
  position: [number, number, number]
}

export interface EngineeringTopic {
  id: string
  title: string
  problem: string
  approach: string
  outcome: string
  icon: string
  tags: string[]
}

export interface AITool {
  name: string
  purpose: string
  category: 'current' | 'learning'
  icon: string
}

export interface Achievement {
  id: number
  title: string
  description: string
  category: 'technical' | 'delivery' | 'analytics' | 'architecture' | 'collaboration'
  highlight?: string
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  website?: string // honeypot
}

export type QualityLevel = 'high' | 'medium' | 'low'

export interface SceneState {
  qualityLevel: QualityLevel
  webGLSupported: boolean
  reducedMotion: boolean
  selectedProject: string | null
  hoveredProject: string | null
  cameraTarget: [number, number, number] | null
  isTransitioning: boolean
}

export interface UIState {
  navOpen: boolean
  recruiterViewOpen: boolean
  activeSection: string
  bootComplete: boolean
  scrollY: number
  theme: 'dark' | 'light'
}

export interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  credentialUrl?: string
}

export interface SiteSettings {
  name: string
  tagline: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  githubUrl: string
  resumeUrl: string
  available_for_work?: boolean
}
