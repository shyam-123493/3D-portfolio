import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { getParticleCount, getPixelRatio } from '@/three/utils/performance'
import { FrameDriver } from '@/three/hooks/FrameDriver'
import { useCanvasEnterTimeline } from '@/three/hooks/useCanvasEnterTimeline'
import type { Line2 } from 'three-stdlib'
import type { TimelineEntry } from '@/types'

const TYPE_COLORS: Record<string, string> = {
  education: '#F59E0B',
  work: '#6FE3D2',
  achievement: '#10B981',
  future: '#8B7DFF',
}

function ConstellationNode({
  entry,
  active,
  intro,
}: {
  entry: TimelineEntry
  active: boolean
  intro: { v: number }
}) {
  const ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const color = TYPE_COLORS[entry.type] ?? '#6FE3D2'

  useFrame(({ clock }) => {
    if (!ref.current || !groupRef.current) return
    const t = clock.getElapsedTime() + entry.id
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.08)
    // intro.v pops each star in (staggered from the section entrance timeline)
    groupRef.current.scale.setScalar(Math.max(intro.v, 0.001))
  })

  return (
    <group ref={groupRef} position={entry.position}>
      <Sphere ref={ref} args={[active ? 0.18 : 0.1, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.6} />
      </Sphere>
      <Sphere args={[active ? 0.35 : 0.2, 8, 8]}>
        <meshBasicMaterial color={color} transparent opacity={active ? 0.15 : 0.05} side={THREE.BackSide} />
      </Sphere>
    </group>
  )
}

function ConstellationLines({ entries, intro }: { entries: TimelineEntry[]; intro: { v: number } }) {
  const lineRef = useRef<Line2>(null)
  const points = useMemo<[number, number, number][]>(
    () => entries.map((e) => e.position),
    [entries],
  )

  // Fade the constellation line in behind the star pops
  useFrame(() => {
    if (lineRef.current) lineRef.current.material.opacity = 0.25 * intro.v
  })

  if (points.length < 2) return null

  return <Line ref={lineRef} points={points} color="#0EA5E9" transparent opacity={0} lineWidth={0.6} />
}

function FloatingStars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.01
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#CBD5E1" size={0.03} sizeAttenuation depthWrite={false} opacity={0.25} />
    </Points>
  )
}

// Pans the camera gently as the section scrolls through the viewport,
// so the constellation drifts with real 3D parallax against the page.
function CameraDrift() {
  const { camera, gl } = useThree()
  const smooth = useRef<number | null>(null)

  useFrame((_, delta) => {
    const rect = gl.domElement.getBoundingClientRect()
    const vh = window.innerHeight
    const p = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1)

    if (smooth.current === null) smooth.current = p
    smooth.current += (p - smooth.current) * Math.min(delta * 4, 1)

    camera.position.y = 0.5 + (0.5 - smooth.current) * 1.6
    camera.position.x = 1.5 + (smooth.current - 0.5) * 0.8
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneContent({ entries, activeId }: { entries: TimelineEntry[]; activeId: number | null }) {
  const { qualityLevel } = useSceneStore()
  const starCount = Math.floor(getParticleCount(qualityLevel) * 0.4)

  // Entrance: stars pop in one by one, then the constellation line fades in
  // connecting them — plays once when the section scrolls into view.
  const nodeIntros = useMemo(() => entries.map(() => ({ v: 0 })), [entries.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const lineIntro = useRef({ v: 0 })

  useCanvasEnterTimeline((tl) => {
    tl.to(nodeIntros, { v: 1, duration: 0.85, ease: 'back.out(2.4)', stagger: 0.09 })
      .to(lineIntro.current, { v: 1, duration: 1.1, ease: 'power2.out' }, '-=0.5')
  }, [entries.length])

  return (
    <>
      <CameraDrift />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#0EA5E9" />
      <ConstellationLines entries={entries} intro={lineIntro.current} />
      {entries.map((entry, i) => (
        <ConstellationNode key={entry.id} entry={entry} active={activeId === entry.id} intro={nodeIntros[i]} />
      ))}
      {starCount > 0 && <FloatingStars count={starCount} />}
    </>
  )
}

export function JourneyScene({ entries, activeId }: { entries: TimelineEntry[]; activeId: number | null }) {
  const { qualityLevel, reducedMotion } = useSceneStore()
  const dpr = getPixelRatio(qualityLevel)

  if (reducedMotion) return null

  return (
    <Canvas
      camera={{ position: [1.5, 0.5, 8], fov: 65, near: 0.1, far: 100 }}
      dpr={dpr}
      frameloop="demand"
      gl={{ antialias: qualityLevel === 'high', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <FrameDriver />
        <SceneContent entries={entries} activeId={activeId} />
      </Suspense>
    </Canvas>
  )
}
