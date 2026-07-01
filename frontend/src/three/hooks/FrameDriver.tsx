import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

// Pauses the canvas render loop when it scrolls out of view.
// Use inside any Canvas that has frameloop="demand".
// The canvas still stays mounted (no WebGL context teardown), but stops
// calling requestAnimationFrame when invisible, saving CPU + GPU time.
export function FrameDriver() {
  const { gl, invalidate } = useThree()
  const visible = useRef(true)

  useEffect(() => {
    const el = gl.domElement
    const obs = new IntersectionObserver(
      ([entry]) => { visible.current = entry.isIntersecting },
      { rootMargin: '80px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [gl.domElement])

  useFrame(() => {
    if (visible.current) invalidate()
  })

  return null
}
