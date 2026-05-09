import { Suspense, useMemo, useRef, useState, type ComponentType } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ── Auto-rotating wrapper ───────────────────────────── */
function Turntable({ children, speed = 0.4 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

/* ── Normalize any GLB to fit a ~2.5-unit bounding sphere ── */
function NormalizedModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)

  const normalized = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const s = 2.5 / maxDim
      clone.scale.setScalar(s)
      clone.position.set(-center.x * s, -center.y * s, -center.z * s)
    }
    return clone
  }, [scene])

  return <primitive object={normalized} />
}

/* ── Simple geometry previews for non-model scenes ───── */
function GeometryPreview({ shape }: { shape: 'sphere' | 'torus' }) {
  return (
    <mesh>
      {shape === 'sphere' ? (
        <sphereGeometry args={[1.1, 64, 64]} />
      ) : (
        <torusGeometry args={[1, 0.38, 32, 100]} />
      )}
      <meshPhysicalMaterial
        metalness={0.95}
        roughness={0.05}
        color="#7c7cff"
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}

/* ── Loading skeleton placeholder ─────────────────────── */
function SkeletonLoader({
  accent,
  icon: Icon,
}: {
  accent?: string
  icon?: ComponentType<{ className?: string }>
}) {
  const color = accent ?? '#6366f1'
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* radial accent background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${color}12, transparent 65%)`,
        }}
      />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* icon behind the ring */}
      {Icon && <Icon className="absolute size-12 text-white/[0.04]" />}
      {/* pulsing ring loader */}
      <div
        className="size-10 rounded-full border-2 animate-spin"
        style={{
          borderColor: `${color}18`,
          borderTopColor: `${color}90`,
        }}
      />
    </div>
  )
}

/* ── Main exported component ─────────────────────────── */
export interface ModelPreviewProps {
  modelPath?: string
  geometry?: 'sphere' | 'torus'
  rotationSpeed?: number
  className?: string
  quality?: 'low' | 'high'
  accent?: string
  icon?: ComponentType<{ className?: string }>
}

export default function ModelPreview({
  modelPath,
  geometry,
  rotationSpeed = 0.4,
  className,
  quality = 'low',
  accent,
  icon,
}: ModelPreviewProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Skeleton shown until Canvas reports first render */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{ opacity: loaded ? 0 : 1, pointerEvents: 'none' }}
      >
        <SkeletonLoader accent={accent} icon={icon} />
      </div>
      <Suspense fallback={<SkeletonLoader accent={accent} icon={icon} />}>
        <Canvas
          camera={{ position: [4, 2, 4], fov: 35 }}
          dpr={quality === 'high' ? [1, 2] : [1, 1]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.6} />
          <spotLight position={[-5, 5, -5]} intensity={0.3} angle={0.5} penumbra={1} />
          <Environment preset="city" background={false} />
          <Suspense fallback={null}>
            <Turntable speed={rotationSpeed}>
              <ReadyNotifier onReady={() => setLoaded(true)} />
              {modelPath && <NormalizedModel path={modelPath} />}
              {geometry && <GeometryPreview shape={geometry} />}
            </Turntable>
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  )
}

/* ── Signals the first frame rendered inside the inner Suspense ── */
function ReadyNotifier({ onReady }: { onReady: () => void }) {
  const called = useRef(false)
  useFrame(() => {
    if (!called.current) {
      called.current = true
      onReady()
    }
  })
  return null
}
