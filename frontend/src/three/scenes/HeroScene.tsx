import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Float, MeshDistortMaterial, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { getParticleCount, getPixelRatio } from '@/three/utils/performance'

// ─── Wireframe icosahedron shell (one draw call via EdgesGeometry) ─────────────
function WireframeSphere() {
  const ref = useRef<THREE.Group>(null)
  const edgeGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(5.8, 2)),
    [],
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * 0.018
    ref.current.rotation.y = t * 0.032
  })

  return (
    <group ref={ref}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#0EA5E9" transparent opacity={0.07} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ─── Expanding pulse rings ────────────────────────────────────────────────────
function PulseRing({ delay = 0 }: { delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() * 0.38) + delay) % 1
    if (meshRef.current) meshRef.current.scale.setScalar(0.6 + t * 3.2)
    if (matRef.current) matRef.current.opacity = (1 - t) * 0.22
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.72, 0.013, 6, 72]} />
      <meshBasicMaterial ref={matRef} color="#6FE3D2" transparent depthWrite={false} />
    </mesh>
  )
}

// ─── Glowing distorted core ───────────────────────────────────────────────────
function GlowCore() {
  return (
    <group>
      <Sphere args={[0.38, 64, 64]}>
        <MeshDistortMaterial
          color="#6FE3D2"
          emissive="#6FE3D2"
          emissiveIntensity={4}
          distort={0.4}
          speed={2.8}
          metalness={0.6}
          roughness={0.08}
        />
      </Sphere>

      {/* Layered soft atmosphere halos — additive blending fakes bloom */}
      {[0.55, 0.85, 1.3, 2.0, 3.0].map((s, i) => (
        <Sphere key={i} args={[0.4, 16, 16]} scale={s}>
          <meshBasicMaterial
            color="#6FE3D2"
            transparent
            opacity={0.07 / (i + 1)}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      ))}

      <PulseRing delay={0} />
      <PulseRing delay={0.85} />
      <PulseRing delay={1.7} />
    </group>
  )
}

// ─── DNA double helix ─────────────────────────────────────────────────────────
function HelixStrand({
  position,
  color,
  phase = 0,
  speed = 0.09,
}: {
  position: [number, number, number]
  color: string
  phase?: number
  speed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  const { s1, s2, conns } = useMemo(() => {
    const TURNS = 2.5
    const HEIGHT = 3.4
    const RADIUS = 0.48
    const STEPS = 140
    const strand1: THREE.Vector3[] = []
    const strand2: THREE.Vector3[] = []
    const connectors: [THREE.Vector3, THREE.Vector3][] = []

    for (let i = 0; i <= STEPS; i++) {
      const theta = (i / STEPS) * Math.PI * 2 * TURNS
      const y = (i / STEPS) * HEIGHT - HEIGHT / 2
      const a = new THREE.Vector3(Math.cos(theta + phase) * RADIUS, y, Math.sin(theta + phase) * RADIUS)
      const b = new THREE.Vector3(Math.cos(theta + phase + Math.PI) * RADIUS, y, Math.sin(theta + phase + Math.PI) * RADIUS)
      strand1.push(a)
      strand2.push(b)
      if (i % 12 === 0) connectors.push([a.clone(), b.clone()])
    }
    return { s1: strand1, s2: strand2, conns: connectors }
  }, [phase])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * speed
  })

  return (
    <group ref={groupRef} position={position}>
      <Line points={s1} color={color} lineWidth={2} transparent opacity={0.6} />
      <Line points={s2} color={color} lineWidth={2} transparent opacity={0.6} />
      {conns.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color={color} lineWidth={0.7} transparent opacity={0.28} />
      ))}
    </group>
  )
}

// ─── Floating octahedron prism ────────────────────────────────────────────────
function FloatingPrism({
  position,
  color,
  floatSpeed = 1,
  rotSpeed = 0.45,
}: {
  position: [number, number, number]
  color: string
  floatSpeed?: number
  rotSpeed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * rotSpeed
    meshRef.current.rotation.x = t * 0.7
    meshRef.current.rotation.y = t * 1.15
    meshRef.current.rotation.z = t * 0.4
  })

  return (
    <Float speed={floatSpeed} floatIntensity={1.4} rotationIntensity={0} position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

// ─── Orbital ring with N traveling emissive dots ──────────────────────────────
function OrbitalRing({
  radius,
  tilt,
  speed,
  color,
  dotCount = 2,
}: {
  radius: number
  tilt: number
  speed: number
  color: string
  dotCount?: number
}) {
  const ringPts = useMemo(
    () =>
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
      }),
    [radius],
  )

  const dotRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const offset = (i / dotCount) * Math.PI * 2
      dot.position.set(Math.cos(t + offset) * radius, 0, Math.sin(t + offset) * radius)
    })
  })

  return (
    <group rotation={[tilt, 0, 0]}>
      <Line points={ringPts} color={color} lineWidth={0.5} transparent opacity={0.1} />
      {Array.from({ length: dotCount }, (_, i) => (
        <mesh key={i} ref={(el) => { dotRefs.current[i] = el }}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Smooth mouse-reactive camera ─────────────────────────────────────────────
function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.032
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.032
    camera.position.x = Math.sin(t * 0.07) * 0.38 + smooth.current.x * 0.95
    camera.position.y = Math.sin(t * 0.05) * 0.24 + smooth.current.y * 0.52
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene root — gems only, transparent bg ───────────────────────────────────
function SceneContent() {
  const { qualityLevel } = useSceneStore()
  const sparkleCount = Math.min(getParticleCount(qualityLevel), 80)
  const isLow = qualityLevel === 'low'

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[6, 3, 2]} intensity={3} color="#8B7DFF" distance={18} />
      <pointLight position={[-6, -2, 2]} intensity={2} color="#6FE3D2" distance={16} />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#0EA5E9" distance={14} />

      <CameraController />

      {/* Large purple gem — left */}
      <FloatingPrism position={[-5.8, 1.0, -1.5]} color="#8B7DFF" floatSpeed={0.55} rotSpeed={0.35} />
      {/* Medium teal gem — upper right */}
      <FloatingPrism position={[5.2, 2.5, -2.0]} color="#6FE3D2" floatSpeed={0.48} rotSpeed={0.28} />
      {/* Blue gem — lower right */}
      <FloatingPrism position={[4.8, -2.4, -1.2]} color="#0EA5E9" floatSpeed={0.68} rotSpeed={0.48} />
      {/* Small violet gem — upper left */}
      <FloatingPrism position={[-4.2, 3.2, -3.0]} color="#B5ADFF" floatSpeed={0.42} rotSpeed={0.22} />

      {!isLow && (
        <>
          {/* Extra small gems */}
          <FloatingPrism position={[7.0, 0.5, -4.0]} color="#8B7DFF" floatSpeed={0.35} rotSpeed={0.18} />
          <FloatingPrism position={[-6.5, -2.8, -3.5]} color="#6FE3D2" floatSpeed={0.62} rotSpeed={0.4} />
        </>
      )}

      {sparkleCount > 0 && (
        <Sparkles count={sparkleCount} scale={[28, 16, 10]} size={1.2} speed={0.2} opacity={0.3} color="#6FE3D2" noise={1.0} />
      )}
    </>
  )
}

// ─── Exported canvas — transparent so photo shows through ─────────────────────
export function HeroScene() {
  const { qualityLevel, reducedMotion } = useSceneStore()
  const dpr = getPixelRatio(qualityLevel)

  if (reducedMotion) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 52, near: 0.1, far: 100 }}
      dpr={dpr}
      gl={{ antialias: qualityLevel !== 'low', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
