import * as THREE from 'three'
import { useRef, useState } from 'react'
import { easing } from 'maath'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  Center,
  Caustics,
  Environment,
  Lightformer,
  RandomizedLight,
  PerformanceMonitor,
  AccumulativeShadows,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'

import glassModel from './glass-transformed.glb?url'

const innerMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 1,
  color: 'black',
  roughness: 0,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  envMapIntensity: 2,
})

export default function CausticsScene() {
  const [perfSucks, degrade] = useState(false)
  return (
    <Canvas
      shadows
      dpr={[1, perfSucks ? 1.5 : 2]}
      camera={{ position: [20, 0.9, 20], fov: 26 }}
    >
      <SceneStats />
      <PerformanceMonitor onDecline={() => degrade(true)} />
      <color attach="background" args={['#f0f0f0']} />
      <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
        <Scene />
        <AccumulativeShadows frames={100} alphaTest={0.75} opacity={0.8} color="red" scale={20} position={[0, -0.005, 0]}>
          <RandomizedLight amount={8} radius={6} ambient={0.5} intensity={Math.PI} position={[-1.5, 2.5, -2.5]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <Env perfSucks={perfSucks} />
    </Canvas>
  )
}

function Scene() {
  const { nodes, materials } = useGLTF(glassModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.Material>
  }
  return (
    <group dispose={null}>
      <mesh castShadow rotation={[0, -0.5, 0]} geometry={nodes.cake.geometry} material={materials.FruitCakeSlice_u1_v1} />
      <mesh castShadow geometry={nodes.straw_1.geometry} material={materials.straw_2} />
      <mesh castShadow geometry={nodes.straw_2.geometry} material={materials.straw_1} />
      <mesh castShadow position={[0, -0.005, 0]} geometry={nodes.straw001_1.geometry} material={materials.straw_2} />
      <mesh castShadow position={[0, -0.005, 0]} geometry={nodes.straw001_2.geometry} material={materials.straw_1} />
      <Center rotation={[0, -0.4, 0]} position={[-1, -0.01, -2]} top>
        <mesh scale={1.2} castShadow geometry={nodes.flowers.geometry} material={materials['draifrawer_u1_v1.001']} />
      </Center>
      <mesh castShadow geometry={nodes.fork.geometry} material={materials.ForkAndKnivesSet001_1K} material-color="#999" />

      <Caustics
        {...({
          backfaces: true,
          color: [1, 0.8, 0.8],
          focus: [0, -1.2, 0],
          lightSource: [-1.2, 3, -2],
          frustum: 1.75,
          intensity: 0.003,
          worldRadius: 0.26 / 10,
          ior: 0.9,
          backfaceIor: 1.26,
        } as any)}
      >
        <mesh castShadow receiveShadow geometry={nodes.glass.geometry}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.1}
            thickness={0.05}
            chromaticAberration={0.05}
            anisotropicBlur={1}
            clearcoat={1}
            clearcoatRoughness={1}
            envMapIntensity={2}
          />
        </mesh>
      </Caustics>

      <mesh scale={[0.95, 1, 0.95]} geometry={nodes.glass_back.geometry} material={innerMaterial} />
      <mesh geometry={nodes.glass_inner.geometry} material={innerMaterial} />
    </group>
  )
}

function Env({ perfSucks }: { perfSucks: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    if (!perfSucks && ref.current) {
      easing.damp3(ref.current.rotation as unknown as THREE.Vector3, [Math.PI / 2, 0, state.clock.elapsedTime / 5 + state.pointer.x], 0.2, delta)
      easing.damp3(
        state.camera.position,
        [Math.sin(state.pointer.x / 4) * 9, 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9],
        0.5,
        delta,
      )
      state.camera.lookAt(0, 0, 0)
    }
  })
  return (
    <Environment frames={perfSucks ? 1 : Infinity} preset="city" resolution={256} background backgroundBlurriness={0.8}>
      <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[Math.PI / 2, 1, 0]}>
        {[2, -2, 2, -4, 2, -5, 2, -9].map((x, i) => (
          <Lightformer key={i} intensity={1} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
        ))}
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
      </group>
      <group ref={ref}>
        <Lightformer intensity={5} form="ring" color="red" rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
      </group>
    </Environment>
  )
}

useGLTF.preload(glassModel)
