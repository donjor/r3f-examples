import * as THREE from 'three'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, AccumulativeShadows, RandomizedLight, Edges, OrbitControls, Outlines, Environment } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'

import bracketModel from './bracket.glb?url'

function Model(props: React.ComponentProps<'mesh'>) {
  const { nodes } = useGLTF(bracketModel) as unknown as { nodes: Record<string, THREE.Mesh> }
  const [hovered, hover] = useState(false)
  return (
    <mesh
      castShadow
      receiveShadow
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      geometry={nodes.defaultMaterial.geometry}
      {...props}
    >
      <meshStandardMaterial roughness={0.15} metalness={0.5} />
      <Edges linewidth={2} threshold={15} color={hovered ? '#c02040' : 'black'} />
      <Outlines thickness={0.01} color={hovered ? '#c02040' : 'black'} />
    </mesh>
  )
}

export default function EdgesGeometry() {
  return (
    <Canvas shadows camera={{ position: [-5, 2.5, 5], fov: 35 }}>
      <SceneStats />
      <ambientLight intensity={Math.PI / 8} />
      <spotLight intensity={Math.PI} decay={0} angle={0.2} castShadow position={[5, 2.5, 5]} shadow-mapSize={128} />
      <Model position={[0, 0.19, 0]} rotation={[0, 0, -Math.PI / 4.45]} />
      <AccumulativeShadows frames={100} temporal>
        <RandomizedLight radius={2} position={[5, 2.5, 5]} />
      </AccumulativeShadows>
      <OrbitControls makeDefault dampingFactor={0.3} />
      <Environment preset="sunset" />
    </Canvas>
  )
}

useGLTF.preload(bracketModel)
