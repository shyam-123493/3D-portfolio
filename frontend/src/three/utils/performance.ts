import type { QualityLevel } from '@/types'

export function getParticleCount(quality: QualityLevel): number {
  return { high: 600, medium: 300, low: 0 }[quality]
}

export function getPixelRatio(quality: QualityLevel): number {
  const dpr = window.devicePixelRatio || 1
  const caps = { high: 2, medium: 1.5, low: 1 }
  return Math.min(dpr, caps[quality])
}

export function getShadows(quality: QualityLevel): boolean {
  return quality === 'high'
}

export function getNodeCount(quality: QualityLevel): number {
  return { high: 40, medium: 20, low: 12 }[quality]
}

export function dispose(obj: Record<string, unknown>) {
  if (obj && typeof obj === 'object') {
    Object.values(obj).forEach((v) => {
      if (v && typeof (v as { dispose?: () => void }).dispose === 'function') {
        (v as { dispose: () => void }).dispose()
      }
    })
  }
}
