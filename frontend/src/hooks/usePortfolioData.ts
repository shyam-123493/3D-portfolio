import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { Project, TimelineEntry, Achievement, Certification, SiteSettings } from '@/types'

// Positions assigned client-side since the backend doesn't store 3D coords
const PROJECT_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [-4, 1, -2],
  [4, -1, -3],
  [-3, -2, -5],
  [6, 2, -4],
]

const TIMELINE_POSITIONS: [number, number, number][] = [
  [-6, 0, 0],
  [-3, 1, 0],
  [0, 0, 0],
  [3, 1, 0],
  [6, 0, 0],
  [9, 1, 0],
]

function normalizeProject(raw: Record<string, unknown>, index: number): Project {
  return {
    id: raw.id as number,
    slug: raw.slug as string,
    title: raw.title as string,
    role: raw.role as string,
    domain: raw.domain as string,
    description: raw.description as string,
    contributions: (raw.contributions as string[]) ?? [],
    technologies: (raw.technologies as Project['technologies']) ?? [],
    architecture: raw.architecture as Project['architecture'],
    challenge: raw.challenge as string | undefined,
    solution: raw.solution as string | undefined,
    githubUrl: (raw.github_url as string) || undefined,
    liveUrl: (raw.live_url as string) || undefined,
    color: raw.color as string,
    featured: raw.featured as boolean,
    position: PROJECT_POSITIONS[index] ?? [index * 3, 0, -2],
  }
}

function normalizeTimeline(raw: Record<string, unknown>, index: number): TimelineEntry {
  return {
    id: raw.id as number,
    date: raw.date as string,
    title: raw.title as string,
    organization: raw.organization as string | undefined,
    description: raw.description as string,
    type: raw.entry_type as TimelineEntry['type'],
    tags: (raw.tags as string[]) ?? [],
    position: TIMELINE_POSITIONS[index] ?? [index * 3, 0, 0],
  }
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.getProjects()
      return (res.data.results ?? res.data).map(normalizeProject)
    },
  })
}

export function useProject(slug: string | null) {
  return useQuery<Project>({
    queryKey: ['projects', slug],
    queryFn: async () => {
      const res = await api.getProject(slug!)
      return normalizeProject(res.data, 0)
    },
    enabled: !!slug,
  })
}

export function useExperience() {
  return useQuery<TimelineEntry[]>({
    queryKey: ['experience'],
    queryFn: async () => {
      const res = await api.getExperience()
      return (res.data.results ?? res.data).map(normalizeTimeline)
    },
  })
}

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const res = await api.getAchievements()
      return (res.data.results ?? res.data) as Achievement[]
    },
  })
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const res = await api.getCertifications()
      return (res.data.results ?? res.data).map((c: Record<string, unknown>) => ({
        id: c.id as number,
        title: c.title as string,
        issuer: c.issuer as string,
        date: c.date as string,
        credentialUrl: (c.credential_url as string) || undefined,
      }))
    },
  })
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const res = await api.getSiteSettings()
      const d = res.data
      return {
        name: d.name,
        tagline: d.tagline,
        email: d.email,
        phone: d.phone,
        location: d.location,
        linkedinUrl: d.linkedin_url,
        githubUrl: d.github_url,
        resumeUrl: d.resume_url ?? '/resume-ghanshyam-desale.pdf',
        available_for_work: d.available_for_work,
      }
    },
    staleTime: Infinity,
  })
}

// ── Personal Projects ────────────────────────────────────────────────────────
export interface PersonalProjectAPI {
  id: number
  slug: string
  title: string
  tagline: string
  description: string
  status: 'live' | 'wip' | 'archived'
  color: string
  year: number
  github_url: string
  live_url: string
  demo_url: string
  media_type: 'none' | 'image' | 'video'
  media_image_url: string | null
  media_video_url: string
  technologies: { name: string }[]
}

export function usePersonalProjects() {
  return useQuery<PersonalProjectAPI[]>({
    queryKey: ['personal-projects'],
    queryFn: async () => {
      const res = await api.getPersonalProjects()
      return (res.data.results ?? res.data) as PersonalProjectAPI[]
    },
  })
}

// ── Vault ────────────────────────────────────────────────────────────────────
export interface VaultItemAPI {
  id: number
  title: string
  value: string
  url: string
  notes: string
  tags: string[]
  order: number
}

export interface VaultSectionAPI {
  id: number
  slug: string
  label: string
  emoji: string
  order: number
  items: VaultItemAPI[]
}

export function useVaultUnlock() {
  return useMutation<VaultSectionAPI[], Error, string>({
    mutationFn: async (pin: string) => {
      const res = await api.unlockVault(pin)
      return res.data as VaultSectionAPI[]
    },
  })
}

export interface VaultItemCreate {
  section: string
  title: string
  value?: string
  url?: string
  notes?: string
  tags?: string[]
  order?: number
}

export function useVaultItemCreate() {
  return useMutation<VaultItemAPI, Error, { pin: string; data: VaultItemCreate }>({
    mutationFn: async ({ pin, data }) => {
      const res = await api.createVaultItem(pin, data)
      return res.data as VaultItemAPI
    },
  })
}

export function useVaultItemDelete() {
  return useMutation<number, Error, { pin: string; id: number }>({
    mutationFn: async ({ pin, id }) => {
      await api.deleteVaultItem(pin, id)
      return id
    },
  })
}

export function useContactMutation() {
  return useMutation({
    mutationFn: api.submitContact,
  })
}

export interface MeetingData {
  name: string
  email: string
  date: string
  time: string
  duration: string
  topic: string
  notes?: string
}

export function useMeetingMutation() {
  return useMutation({
    mutationFn: async (data: MeetingData) => {
      const res = await fetch('/api/meeting/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed to book meeting')
      }
      return res.json()
    },
  })
}
