import { create } from 'zustand'
import type { SceneState, QualityLevel } from '@/types'

interface SceneStore extends SceneState {
  setQualityLevel: (level: QualityLevel) => void
  setWebGLSupported: (supported: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setSelectedProject: (slug: string | null) => void
  setHoveredProject: (slug: string | null) => void
  setCameraTarget: (target: [number, number, number] | null) => void
  setIsTransitioning: (transitioning: boolean) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  qualityLevel: 'high',
  webGLSupported: true,
  reducedMotion: false,
  selectedProject: null,
  hoveredProject: null,
  cameraTarget: null,
  isTransitioning: false,

  setQualityLevel: (level) => set({ qualityLevel: level }),
  setWebGLSupported: (supported) => set({ webGLSupported: supported }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setSelectedProject: (slug) => set({ selectedProject: slug }),
  setHoveredProject: (slug) => set({ hoveredProject: slug }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}))
