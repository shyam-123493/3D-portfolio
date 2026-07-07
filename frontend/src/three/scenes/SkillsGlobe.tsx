import { useRef, useMemo, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { getPixelRatio } from '@/three/utils/performance'
import { FrameDriver } from '@/three/hooks/FrameDriver'
import { useCanvasEnterTimeline } from '@/three/hooks/useCanvasEnterTimeline'

const SKILLS = [
  { name: 'Angular',     color: '#DD0031', glow: '#FF3366', size: 1.3 },
  { name: 'TypeScript',  color: '#3178C6', glow: '#4A9EFF', size: 1.2 },
  { name: 'PWA',         color: '#8B5CF6', glow: '#B57DFF', size: 1.1 },
  { name: 'IndexedDB',   color: '#6FE3D2', glow: '#6FE3D2', size: 1.0 },
  { name: 'Java',        color: '#F59E0B', glow: '#FFB830', size: 1.1 },
  { name: 'Spring Boot', color: '#6DB33F', glow: '#86D84E', size: 1.0 },
  { name: 'JavaScript',  color: '#F7DF1E', glow: '#FFE744', size: 1.2 },
  { name: 'RxJS',        color: '#B7178C', glow: '#E020B0', size: 0.9 },
  { name: 'CleverTap',   color: '#FF6B35', glow: '#FF8C5A', size: 0.9 },
  { name: 'GA4',         color: '#E37400', glow: '#FF9500', size: 0.9 },
  { name: 'AWS S3',      color: '#FF9900', glow: '#FFB347', size: 1.0 },
  { name: 'REST APIs',   color: '#0EA5E9', glow: '#38BFFF', size: 1.1 },
  { name: 'HTML/CSS',    color: '#E34F26', glow: '#FF6030', size: 1.0 },
  { name: 'CI/CD',       color: '#10B981', glow: '#34D399', size: 0.9 },
  { name: 'Git',         color: '#F05032', glow: '#FF6644', size: 1.0 },
  { name: 'GTM',         color: '#246FDB', glow: '#3D8FFF', size: 0.8 },
]

function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const phi = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y     = 1 - (i / (count - 1)) * 2
    const r     = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = phi * i
    return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]
  })
}

// ── Skill orb ─────────────────────────────────────────────────────────────────
function SkillNode({
  name, color, glow, position, scale = 1,
}: {
  name: string; color: string; glow: string; position: [number, number, number]; scale?: number
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = hovered ? 4.2 : 2.2 + Math.sin(t * 2.1 + position[0]) * 0.5
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hovered ? 0.65 : 0.26 + Math.sin(t * 1.6 + position[1]) * 0.07
    }
  })

  const core = 0.105 * scale
  const atmo = 0.19  * scale

  return (
    <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0} position={position}>
      <group
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        {/* Glow sphere */}
        <Sphere ref={glowRef} args={[atmo, 16, 16]}>
          <meshBasicMaterial color={glow} transparent opacity={0.26} side={THREE.BackSide} depthWrite={false} />
        </Sphere>
        {/* Core orb */}
        <Sphere ref={meshRef} args={[core, 24, 24]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.2}
            metalness={0.6}
            roughness={0.12}
          />
        </Sphere>
        {/* Label */}
        <Html center distanceFactor={8} zIndexRange={[10, 20]}>
          <div
            style={{
              padding: hovered ? '4px 11px' : '3px 9px',
              borderRadius: 6,
              fontSize: hovered ? 12 : 10.5,
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
              color: hovered ? '#ffffff' : 'rgba(240,239,233,0.85)',
              background: hovered ? 'rgba(5,5,6,0.94)' : 'rgba(5,5,6,0.76)',
              border: `1px solid ${hovered ? glow : 'rgba(255,255,255,0.12)'}`,
              boxShadow: hovered ? `0 0 18px ${glow}70, 0 2px 14px rgba(0,0,0,0.6)` : '0 2px 8px rgba(0,0,0,0.4)',
              transition: 'all 0.15s ease',
              backdropFilter: 'blur(6px)',
            }}
          >
            {name}
          </div>
        </Html>
      </group>
    </Float>
  )
}

// ── Globe planet with lat/lon wireframe ──────────────────────────────────────
function GlobePlanet({ radius }: { radius: number }) {
  const atmRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (atmRef.current) {
      const mat = atmRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.055 + Math.sin(t * 0.55) * 0.015
    }
  })

  const latRings = useMemo(() =>
    [-0.55, -0.2, 0.2, 0.55].map((offset) =>
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2
        const y = offset * radius
        const r = Math.sqrt(Math.max(0, radius * radius - y * y))
        return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
      }),
    ), [radius],
  )

  const lonRings = useMemo(() =>
    [0, Math.PI / 3, (2 * Math.PI) / 3].map((tilt) =>
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2
        const x = Math.cos(a) * radius
        const y = Math.sin(a) * radius
        return new THREE.Vector3(x * Math.cos(tilt), y, x * Math.sin(tilt))
      }),
    ), [radius],
  )

  return (
    <group>
      {/* Dark surface */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#040C1E"
          emissive="#081428"
          emissiveIntensity={0.4}
          metalness={0.55}
          roughness={0.8}
          transparent
          opacity={0.94}
        />
      </Sphere>
      {/* Teal atmosphere */}
      <Sphere ref={atmRef} args={[radius * 1.065, 32, 32]}>
        <meshBasicMaterial
          color="#6FE3D2"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      {/* Violet outer halo */}
      <Sphere args={[radius * 1.13, 24, 24]}>
        <meshBasicMaterial
          color="#8B7DFF"
          transparent
          opacity={0.028}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      {/* Lat rings */}
      {latRings.map((pts, i) => (
        <Line key={`lat-${i}`} points={pts} color="#6FE3D2" transparent opacity={0.14} lineWidth={0.55} />
      ))}
      {/* Lon arcs */}
      {lonRings.map((pts, i) => (
        <Line key={`lon-${i}`} points={pts} color="#8B7DFF" transparent opacity={0.1} lineWidth={0.4} />
      ))}
    </group>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function GlobeContent() {
  const groupRef = useRef<THREE.Group>(null)
  const scrollSpin = useRef<{ current: number; base: number } | null>(null)
  // Entrance state — globe starts small and wound back, then scales up and
  // spins into place the first time the section scrolls into view.
  const intro = useRef({ scale: 0.55, spin: -1.35 })
  const RADIUS = 2.4

  useCanvasEnterTimeline((tl) => {
    tl.to(intro.current, { scale: 1, spin: 0, duration: 1.7, ease: 'expo.out' })
  })

  const positions = useMemo(() => fibonacciSphere(SKILLS.length, RADIUS), [])

  const connections = useMemo(() => {
    const pairs: [[number, number, number], [number, number, number]][] = []
    for (let i = 0; i < positions.length; i++) {
      let count = 0
      for (let j = i + 1; j < positions.length; j++) {
        if (count >= 2) break
        const dist = new THREE.Vector3(...positions[i]).distanceTo(new THREE.Vector3(...positions[j]))
        if (dist < 1.8) {
          pairs.push([positions[i], positions[j]])
          count++
        }
      }
    }
    return pairs
  }, [positions])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Scroll-reactive spin — scrolling physically rotates the globe on top
    // of its idle drift. Baselined to the mount scroll position so there is
    // no jump on first frame; smoothed so it feels weighty, not twitchy.
    if (scrollSpin.current === null) {
      scrollSpin.current = { current: 0, base: window.scrollY }
    }
    const targetSpin = (window.scrollY - scrollSpin.current.base) * 0.0009
    scrollSpin.current.current += (targetSpin - scrollSpin.current.current) * 0.06

    groupRef.current.rotation.y = t * 0.115 + scrollSpin.current.current + intro.current.spin
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.1
    groupRef.current.scale.setScalar(intro.current.scale)
  })

  return (
    <>
      <ambientLight intensity={0.06} />
      <pointLight position={[5, 4, 4]}   intensity={7}   color="#6FE3D2" distance={22} decay={2} />
      <pointLight position={[-5, -3, 3]} intensity={5}   color="#8B7DFF" distance={20} decay={2} />
      <pointLight position={[0, 6, -5]}  intensity={3}   color="#0EA5E9" distance={18} decay={2} />
      <pointLight position={[0, -5, 3]}  intensity={2}   color="#F59E0B" distance={15} decay={2} />

      <group ref={groupRef}>
        <GlobePlanet radius={RADIUS} />

        {/* Connection lines */}
        {connections.map(([a, b], i) => (
          <Line key={i} points={[a, b]} color="#6FE3D2" transparent opacity={0.16} lineWidth={0.4} />
        ))}

        {SKILLS.map((skill, i) => (
          <SkillNode
            key={skill.name}
            name={skill.name}
            color={skill.color}
            glow={skill.glow}
            position={positions[i]}
            scale={skill.size}
          />
        ))}
      </group>

      {/* Faint core pulse */}
      <Sphere args={[0.2, 24, 24]}>
        <meshBasicMaterial color="#6FE3D2" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </Sphere>
    </>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────
export function SkillsGlobe() {
  const { qualityLevel, reducedMotion } = useSceneStore()
  const dpr = getPixelRatio(qualityLevel)

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap gap-2 justify-center p-8">
        {SKILLS.map((s) => (
          <span
            key={s.name}
            className="font-mono text-xs px-3 py-1 rounded-full border"
            style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}0F` }}
          >
            {s.name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" style={{ height: 520 }}>
      {/* Large radial glow behind globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 60% 55% at 50% 52%, rgba(111,227,210,0.09) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 30% at 50% 52%, rgba(139,125,255,0.06) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 44 }}
        dpr={dpr}
        frameloop="demand"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FrameDriver />
          <GlobeContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
