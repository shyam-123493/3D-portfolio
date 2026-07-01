import { useRef, useMemo, useEffect, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Points, PointMaterial, Html, Line, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'
import { getParticleCount, getPixelRatio } from '@/three/utils/performance'
import { FrameDriver } from '@/three/hooks/FrameDriver'
import type { Project } from '@/types'

const PROJECT_COLORS: Record<string, string> = {
  'bajaj-finserv-pwa':           '#6FE3D2',
  'merchant-platform':           '#8B7DFF',
  'branches-platform':           '#10B981',
  'myashiyana':                  '#F59E0B',
  'web-platform-enhancements':   '#38BDF8',
}

// compact orbit radii — all fit comfortably in the camera frame
const ORBIT_RADII = [2.4, 3.7, 5.1, 6.6, 8.2]

// ─── Grid plane — single LineSegments geometry ────────────────────────────────
function GridPlane() {
  const geometry = useMemo(() => {
    const size = 14
    const step = 1.6
    const verts: number[] = []
    for (let x = -size; x <= size; x += step) {
      verts.push(x, 0, -size, x, 0, size)
    }
    for (let z = -size; z <= size; z += step) {
      verts.push(-size, 0, z, size, 0, z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [])

  useEffect(() => () => { geometry.dispose() }, [geometry])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1e3030" transparent opacity={0.22} />
    </lineSegments>
  )
}

// ─── Orbit path ──────────────────────────────────────────────────────────────
function OrbitPath({ radius }: { radius: number }) {
  const points = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius])
    }
    return pts
  }, [radius])

  return (
    <Line points={points} color="#2d4040" transparent opacity={0.5} lineWidth={0.6} />
  )
}

// ─── Central sun ─────────────────────────────────────────────────────────────
function CentralSun() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })
  return (
    <group>
      {/* Core */}
      <Sphere ref={meshRef} args={[0.72, 48, 48]}>
        <meshStandardMaterial color="#6FE3D2" emissive="#6FE3D2" emissiveIntensity={6} metalness={0.1} roughness={0.2} />
      </Sphere>
      {/* Inner glow */}
      <Sphere args={[1.0, 32, 32]}>
        <meshBasicMaterial color="#6FE3D2" transparent opacity={0.10} side={THREE.BackSide} depthWrite={false} />
      </Sphere>
      {/* Outer halo */}
      <Sphere args={[1.6, 32, 32]}>
        <meshBasicMaterial color="#6FE3D2" transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
      </Sphere>
    </group>
  )
}

// ─── Project planet ───────────────────────────────────────────────────────────
function ProjectPlanet({
  project,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  index,
}: {
  project: Project
  orbitRadius: number
  orbitSpeed: number
  orbitOffset: number
  index: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Mesh>(null)
  const { selectedProject, hoveredProject, setSelectedProject, setHoveredProject, isTransitioning } = useSceneStore()

  const color      = PROJECT_COLORS[project.slug] ?? '#6FE3D2'
  const isSelected = selectedProject === project.slug
  const isHovered  = hoveredProject  === project.slug

  const hasRing = index === 1 || index === 3

  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current) return
    const t = clock.getElapsedTime() + orbitOffset
    groupRef.current.position.x = Math.cos(t * orbitSpeed) * orbitRadius
    groupRef.current.position.z = Math.sin(t * orbitSpeed) * orbitRadius
    meshRef.current.rotation.y += 0.008
    if (isSelected) {
      // pulse scale slightly
      const s = 1.45 + Math.sin(clock.getElapsedTime() * 2.5) * 0.04
      groupRef.current.scale.setScalar(s)
    } else if (isHovered) {
      groupRef.current.scale.setScalar(1.18)
    } else {
      groupRef.current.scale.setScalar(1.0)
    }
  })

  const handleClick = useCallback(() => {
    if (isTransitioning) return
    setSelectedProject(isSelected ? null : project.slug)
  }, [isSelected, isTransitioning, project.slug, setSelectedProject])

  const eInt = isSelected ? 3.2 : isHovered ? 1.8 : 0.9

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <Sphere
        ref={meshRef}
        args={[0.52, 40, 40]}
        onClick={handleClick}
        onPointerEnter={() => { setHoveredProject(project.slug); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHoveredProject(null); document.body.style.cursor = 'auto' }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={eInt}
          metalness={0.35}
          roughness={0.45}
        />
      </Sphere>

      {/* Inner atmosphere */}
      <Sphere args={[0.68, 20, 20]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.14 : isHovered ? 0.09 : 0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      {/* Outer halo */}
      <Sphere args={[1.1, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.06 : 0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Saturn-style ring for 2 planets */}
      {hasRing && (
        <Torus args={[0.88, 0.08, 3, 64]} rotation={[Math.PI * 0.38, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.6} />
        </Torus>
      )}

      {/* Always-visible label */}
      <Html
        center
        distanceFactor={10}
        position={[0, 1.0, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            opacity: isSelected ? 1 : isHovered ? 0.95 : 0.65,
            transition: 'opacity 0.2s',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: isSelected ? '11px' : '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color,
              textShadow: `0 0 12px ${color}`,
              background: 'rgba(5,5,6,0.72)',
              border: `1px solid ${color}40`,
              borderRadius: '4px',
              padding: isSelected ? '4px 10px' : '2px 7px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
            }}
          >
            {project.title}
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─── Star field ───────────────────────────────────────────────────────────────
function StarField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return arr
  }, [count])

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="#CBD5E1" size={0.025} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  )
}

// ─── Mouse parallax camera controller ────────────────────────────────────────
function CameraController() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 6.5, 10.5))
  const current = useRef(new THREE.Vector3(0, 6.5, 10.5))
  const mouse   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    target.current.x = mouse.current.x * 1.4
    target.current.y = 6.5 - mouse.current.y * 0.9
    target.current.z = 10.5 + mouse.current.y * 0.5
    current.current.lerp(target.current, delta * 1.4)
    camera.position.copy(current.current)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene content ────────────────────────────────────────────────────────────
function SceneContent({ projects }: { projects: Project[] }) {
  const { qualityLevel } = useSceneStore()
  const particleCount = Math.floor(getParticleCount(qualityLevel) * 0.9)

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#6FE3D2" distance={22} decay={2} />
      <pointLight position={[8, 5, 8]}  intensity={0.4} color="#8B7DFF" distance={25} decay={2} />
      <pointLight position={[-8, 3, -6]} intensity={0.3} color="#38BDF8" distance={20} decay={2} />

      <CameraController />
      <GridPlane />
      <CentralSun />

      {ORBIT_RADII.map((r) => <OrbitPath key={r} radius={r} />)}

      {projects.slice(0, 5).map((project, i) => (
        <ProjectPlanet
          key={project.slug}
          project={project}
          orbitRadius={ORBIT_RADII[i] ?? ORBIT_RADII[ORBIT_RADII.length - 1]}
          orbitSpeed={0.035 - i * 0.005}
          orbitOffset={(Math.PI / 2.5) * i}
          index={i}
        />
      ))}

      {particleCount > 0 && <StarField count={particleCount} />}
    </>
  )
}

// ─── Exported canvas ──────────────────────────────────────────────────────────
export function ProjectUniverseScene({ projects }: { projects: Project[] }) {
  const { qualityLevel, reducedMotion } = useSceneStore()
  const dpr = getPixelRatio(qualityLevel)

  if (reducedMotion) return null

  return (
    <Canvas
      camera={{ position: [0, 6.5, 10.5], fov: 65, near: 0.1, far: 300 }}
      dpr={dpr}
      frameloop="demand"
      gl={{ antialias: qualityLevel === 'high', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <FrameDriver />
        <SceneContent projects={projects} />
      </Suspense>
    </Canvas>
  )
}
