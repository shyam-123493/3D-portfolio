import { create } from 'zustand'
import type { UIState } from '@/types'

function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark'
}

interface UIStore extends UIState {
  setNavOpen: (open: boolean) => void
  toggleNav: () => void
  setRecruiterViewOpen: (open: boolean) => void
  setActiveSection: (section: string) => void
  setBootComplete: (complete: boolean) => void
  setScrollY: (y: number) => void
  toggleTheme: () => void
  setTheme: (t: 'dark' | 'light') => void
}

export const useUIStore = create<UIStore>((set) => ({
  navOpen: false,
  recruiterViewOpen: false,
  activeSection: 'hero',
  bootComplete: false,
  scrollY: 0,
  theme: getInitialTheme(),

  setNavOpen: (open) => set({ navOpen: open }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  setRecruiterViewOpen: (open) => set({ recruiterViewOpen: open }),
  setActiveSection: (section) => set({ activeSection: section }),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  setScrollY: (y) => set({ scrollY: y }),
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('portfolio-theme', next) } catch {}
      return { theme: next }
    }),
  setTheme: (t) => {
    try { localStorage.setItem('portfolio-theme', t) } catch {}
    set({ theme: t })
  },
}))
