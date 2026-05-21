import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useGLTF, PresentationControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'

import watchModel from './watch-v1.glb?url'

export default function BouncyWatch() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 25 }}>
      <SceneStats />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
      <PresentationControls
        {...({
          global: true,
          config: { mass: 2, tension: 500 },
          snap: { mass: 4, tension: 1500 },
          rotation: [0, 0.3, 0],
          polar: [-Math.PI / 3, Math.PI / 3],
          azimuth: [-Math.PI / 1.4, Math.PI / 2],
        } as any)}
      >
        <Watch rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} scale={0.003} />
      </PresentationControls>
      <ContactShadows position={[0, -1.4, 0]} opacity={0.75} scale={10} blur={3} far={4} />
      <Environment preset="city" />
    </Canvas>
  )
}

function Watch(props: React.ComponentProps<'group'>) {
  const { nodes, materials } = useGLTF(watchModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.Material>
  }
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object005_glass_0.geometry} material={materials.glass}>
        <Html scale={100} rotation={[Math.PI / 2, 0, 0]} position={[180, -350, 50]} transform occlude>
          <div className="text-white bg-black/80 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap">
            6.550 $ <span style={{ fontSize: '1.5em' }}>🥲</span>
          </div>
        </Html>
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Object006_watch_0.geometry} material={materials.watch} />
    </group>
  )
}

useGLTF.preload(watchModel)
