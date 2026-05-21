import * as THREE from 'three'
import { useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { Overlay } from './Overlay'

import shirtModel from './shirt_baked_collapsed.glb?url'

export default function TShirtConfigurator() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <SceneStats />
        <ambientLight intensity={0.5} />
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Canvas>
      <Overlay />
    </>
  )
}

function Backdrop() {
  const shadows = useRef<any>(null)
  const snap = useSnapshot(state)
  useFrame((_state, delta) => {
    if (shadows.current?.getMesh) {
      easing.dampC(shadows.current.getMesh().material.color, snap.color, 0.25, delta)
    }
  })
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const snap = useSnapshot(state)
  useFrame((s, delta) => {
    easing.damp3(s.camera.position, [snap.intro ? -s.viewport.width / 4 : 0, 0, 2], 0.25, delta)
    if (group.current)
      easing.dampE(group.current.rotation, [s.pointer.y / 10, -s.pointer.x / 5, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}

function Shirt() {
  const snap = useSnapshot(state)
  const texture = useTexture(snap.decal)
  const { nodes, materials } = useGLTF(shirtModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.MeshStandardMaterial>
  }
  useFrame((_state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))
  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={texture} />
    </mesh>
  )
}

useGLTF.preload(shirtModel)
