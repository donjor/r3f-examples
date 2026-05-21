import { useRef, type ComponentPropsWithoutRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, ContactShadows, Environment } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { easing } from 'maath'
import { useStore, setOpen } from './store'
import { Overlay } from './Overlay'

import shoeModel from './shoe.glb?url'

export default function FrostedGlass() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <SceneStats />
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
        <Environment preset="city" background blur={1} />
        <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
        <Selector>
          <Shoe rotation={[0.3, Math.PI / 1.6, 0]} />
        </Selector>
      </Canvas>
      <Overlay />
    </>
  )
}

function Selector({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Mesh>(null!)
  const state = useStore()
  useFrame(({ viewport, camera, pointer }, delta) => {
    if (!ref.current) return
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3])
    easing.damp3(
      ref.current.position,
      [(pointer.x * width) / 2, (pointer.y * height) / 2, 3],
      state.open ? 0 : 0.1,
      delta,
    )
    easing.damp3(ref.current.scale, state.open ? 4 : 0.01, state.open ? 0.5 : 0.2, delta)
    easing.dampC((ref.current.material as THREE.MeshStandardMaterial).color, state.open ? '#f0f0f0' : '#ccc', 0.1, delta)
  })
  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[1, 64]} />
        <MeshTransmissionMaterial
          samples={16}
          resolution={512}
          anisotropicBlur={0.1}
          thickness={0.1}
          roughness={0.4}
          toneMapped
        />
      </mesh>
      <group
        onPointerOver={() => setOpen(true)}
        onPointerOut={() => setOpen(false)}
        onPointerDown={() => setOpen(true)}
        onPointerUp={() => setOpen(false)}
      >
        {children}
      </group>
    </>
  )
}

function Shoe(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(shoeModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.Material>
  }
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 3) / 4, 0.15 + Math.sin(t / 2) / 8)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })
  return (
    <group ref={ref}>
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.defaultMaterial.geometry}
        material={materials.NikeShoe}
        {...props}
      />
    </group>
  )
}

useGLTF.preload(shoeModel)
