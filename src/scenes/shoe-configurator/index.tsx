import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { HexColorPicker } from 'react-colorful'
import { proxy, useSnapshot } from 'valtio'

import shoeModel from './shoe-draco.glb?url'

type PartName = 'laces' | 'mesh' | 'caps' | 'inner' | 'sole' | 'stripes' | 'band' | 'patch'

const state = proxy<{
  current: PartName | null
  items: Record<PartName, string>
}>({
  current: null,
  items: { laces: '#fff', mesh: '#fff', caps: '#fff', inner: '#fff', sole: '#fff', stripes: '#fff', band: '#fff', patch: '#fff' },
})

export default function ShoeConfigurator() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <SceneStats />
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Shoe />
        <Environment preset="city" />
        <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
      </Canvas>
      <Picker />
    </>
  )
}

function Shoe() {
  const ref = useRef<THREE.Group>(null!)
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF(shoeModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<PartName, THREE.Material>
  }
  const [hovered, set] = useState<PartName | null>(null)

  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  useEffect(() => {
    if (hovered) {
      const color = snap.items[hovered]
      const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${color}"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" font-family="sans-serif" font-size="10"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath></defs></svg>`
      const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => {
        document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`
      }
    }
  }, [hovered, snap.items])

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation()
        set((e.object as THREE.Mesh).material instanceof THREE.Material ? (((e.object as THREE.Mesh).material as any).name as PartName) : null)
      }}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => {
        e.stopPropagation()
        const name = (((e.object as THREE.Mesh).material as any).name as PartName) ?? null
        state.current = name
      }}
    >
      <mesh receiveShadow castShadow geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
    </group>
  )
}

function Picker() {
  const snap = useSnapshot(state)
  return (
    <div
      className="absolute top-1/2 right-10 -translate-y-1/2 z-[100] flex flex-col items-center gap-3"
      style={{ display: snap.current ? 'flex' : 'none' }}
    >
      <HexColorPicker
        color={snap.current ? snap.items[snap.current] : '#ffffff'}
        onChange={(color) => {
          if (snap.current) state.items[snap.current] = color
        }}
      />
      <h1 className="text-white text-2xl font-bold uppercase tracking-wide">{snap.current}</h1>
    </div>
  )
}

useGLTF.preload(shoeModel)
