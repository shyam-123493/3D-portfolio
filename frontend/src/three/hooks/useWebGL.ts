import { useEffect } from 'react'
import { useSceneStore } from '@/stores/sceneStore'
import type { QualityLevel } from '@/types'

function detectQualityLevel(): QualityLevel {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (!gl) return 'low'

  const renderer = (gl as WebGLRenderingContext)
    .getExtension('WEBGL_debug_renderer_info')
  const gpu = renderer
    ? (gl as WebGLRenderingContext).getParameter(renderer.UNMASKED_RENDERER_WEBGL)
    : ''

  // Heuristic: integrated GPUs get medium quality
  const isIntegrated = /intel|mesa|llvm|software/i.test(gpu)
  const isMobile = /android|iphone|ipad/i.test(navigator.userAgent)

  if (isMobile || isIntegrated) return 'medium'
  return 'high'
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

export function useWebGLDetection() {
  const { setWebGLSupported, setQualityLevel, setReducedMotion } = useSceneStore()

  useEffect(() => {
    const supported = checkWebGLSupport()
    setWebGLSupported(supported)

    if (supported) {
      setQualityLevel(detectQualityLevel())
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setWebGLSupported, setQualityLevel, setReducedMotion])
}
