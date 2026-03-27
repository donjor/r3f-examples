import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect, useRef, useState, useMemo, useCallback, createContext, useContext } from 'react'
import { Canvas, applyProps, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, Environment, Lightformer, Float, useGLTF, OrbitControls } from '@react-three/drei'

type CameraMode = 'showcase' | 'freeform'

interface BgColors {
  colorBase: string
  colorA: string
  colorB: string
}

const DEFAULT_COLORS: BgColors = { colorBase: '#444444', colorA: '#0000ff', colorB: '#000000' }

// Shared ref so color changes never trigger React re-renders inside the Canvas
const ColorRefContext = createContext<React.RefObject<BgColors>>(null!)

export default function Scene() {
  const [degraded, degrade] = useState(false)
  const [cameraMode, setCameraMode] = useState<CameraMode>('showcase')
  const [bgColors, setBgColors] = useState<BgColors>(DEFAULT_COLORS)
  const colorRef = useRef<BgColors>(DEFAULT_COLORS)

  const toggleCamera = useCallback(() => {
    setCameraMode((m) => (m === 'showcase' ? 'freeform' : 'showcase'))
  }, [])

  const handleColorChange = useCallback((key: keyof BgColors, value: string) => {
    colorRef.current = { ...colorRef.current, [key]: value }
    setBgColors((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <>
      <Canvas shadows camera={{ position: [5, 0, 15], fov: 30 }}>
        <ColorRefContext.Provider value={colorRef}>
          <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
          <ambientLight intensity={0.5} />
          <Porsche scale={1.6} position={[-0.5, -0.18, 0]} rotation={[0, Math.PI / 5, 0]} />
          <PerformanceMonitor onDecline={() => degrade(true)} />
          <Environment frames={degraded ? 1 : Infinity} resolution={256} background blur={1}>
            <Lightformers />
          </Environment>
          {cameraMode === 'showcase' ? (
            <ShowcaseRig />
          ) : (
            <OrbitControls
              makeDefault
              enablePan
              enableZoom
              enableRotate
              minDistance={3}
              maxDistance={30}
              target={[0, 0, 0]}
            />
          )}
        </ColorRefContext.Provider>
      </Canvas>
      <Overlay
        cameraMode={cameraMode}
        onToggleCamera={toggleCamera}
        bgColors={bgColors}
        onColorChange={handleColorChange}
      />
    </>
  )
}

/*
Author: Karol Miklas (https://sketchfab.com/karolmiklas)
License: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
Source: https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf
Title: (FREE) Porsche 911 Carrera 4S
*/
function Porsche(props: React.JSX.IntrinsicElements['group']) {
  const { scene, nodes, materials } = useGLTF('/911-transformed.glb')
  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.receiveShadow = node.castShadow = true
      }
    })
    applyProps(materials.rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.window, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.coat, { envMapIntensity: 4, roughness: 0.5, metalness: 1 })
    applyProps(materials.paint, { envMapIntensity: 2, roughness: 0.45, metalness: 0.8, color: '#555' })
  }, [nodes, materials])
  return <primitive object={scene} {...props} />
}

function ShowcaseRig() {
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }: { positions?: number[] }) {
  const group = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    group.current.position.z += delta * 10
    if (group.current.position.z > 20) group.current.position.z = -60
  })
  return (
    <>
      <Lightformer intensity={0.75} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer key={i} form="circle" intensity={2} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
          ))}
        </group>
      </group>
      <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
      <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
      <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer form="ring" color="red" intensity={1} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
      </Float>
      <GradientSphere />
    </>
  )
}

/** Reads colors from shared ref each frame — zero React re-renders in Environment */
function GradientSphere() {
  const colorRef = useContext(ColorRefContext)
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const shaderDef = useMemo(() => ({
    uniforms: {
      colorBase: { value: new THREE.Color(DEFAULT_COLORS.colorBase) },
      colorA: { value: new THREE.Color(DEFAULT_COLORS.colorA) },
      colorB: { value: new THREE.Color(DEFAULT_COLORS.colorB) },
      origin: { value: new THREE.Vector3(100, 100, 100) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 colorBase;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec3 origin;
      varying vec3 vWorldPos;
      void main() {
        float d = clamp(length(vWorldPos - origin) / 300.0, 0.0, 1.0);
        vec3 depth = mix(colorA, colorB, d);
        gl_FragColor = vec4(mix(colorBase, depth, 0.5), 1.0);
      }
    `,
  }), [])

  useFrame(() => {
    const u = matRef.current.uniforms
    const c = colorRef.current
    u.colorBase.value.set(c.colorBase)
    u.colorA.value.set(c.colorA)
    u.colorB.value.set(c.colorB)
  })

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        uniforms={shaderDef.uniforms}
        vertexShader={shaderDef.vertexShader}
        fragmentShader={shaderDef.fragmentShader}
      />
    </mesh>
  )
}

/* ── Overlay UI ──────────────────────────────────────── */

function Overlay({
  cameraMode,
  onToggleCamera,
  bgColors,
  onColorChange,
}: {
  cameraMode: CameraMode
  onToggleCamera: () => void
  bgColors: BgColors
  onColorChange: (key: keyof BgColors, value: string) => void
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Background color controls */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/[0.08]">
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">BG</span>
        <ColorSwatch label="Base" value={bgColors.colorBase} onChange={(v) => onColorChange('colorBase', v)} />
        <ColorSwatch label="A" value={bgColors.colorA} onChange={(v) => onColorChange('colorA', v)} />
        <ColorSwatch label="B" value={bgColors.colorB} onChange={(v) => onColorChange('colorB', v)} />
      </div>
      {/* Camera mode toggle */}
      <button
        onClick={onToggleCamera}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/[0.08] text-[12px] font-medium text-white/70 hover:bg-black/80 hover:text-white hover:border-white/[0.14] transition-all duration-200 select-none"
      >
        <span className="size-1.5 rounded-full" style={{ background: cameraMode === 'showcase' ? '#818cf8' : '#34d399' }} />
        {cameraMode === 'showcase' ? 'Showcase' : 'Freeform'}
      </button>
    </div>
  )
}

function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="group relative flex items-center gap-1.5 cursor-pointer" title={label}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <span
        className="size-5 rounded-full border border-white/[0.12] group-hover:border-white/30 transition-colors shadow-inner"
        style={{ background: value }}
      />
      <span className="text-[10px] text-white/30">{label}</span>
    </label>
  )
}
