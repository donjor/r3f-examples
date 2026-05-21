import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Clouds, Cloud, CameraControls, Sky as SkyImpl} from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { useControls } from 'leva'

export default function CloudsScene() {
  return (
    <Canvas camera={{ position: [0, -10, 10], fov: 75 }}>
      <SceneStats />
      <Sky />
      <ambientLight intensity={Math.PI / 1.5} />
      <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
      <spotLight position={[-20, 0, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={30} />
      <spotLight position={[20, -10, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={20} />
      <CameraControls />
    </Canvas>
  )
}

function Sky() {
  const ref = useRef<THREE.Group>(null!)
  const cloud0 = useRef<any>(null!)
  const { color, x, y, z, ...config } = useControls({
    seed: { value: 1, min: 1, max: 100, step: 1 },
    segments: { value: 20, min: 1, max: 80, step: 1 },
    volume: { value: 6, min: 0, max: 100, step: 0.1 },
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
    fade: { value: 10, min: 0, max: 400, step: 1 },
    growth: { value: 4, min: 0, max: 20, step: 1 },
    speed: { value: 0.1, min: 0, max: 1, step: 0.01 },
    x: { value: 6, min: 0, max: 100, step: 1 },
    y: { value: 1, min: 0, max: 100, step: 1 },
    z: { value: 1, min: 0, max: 100, step: 1 },
    color: 'white',
  })
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2
    }
    if (cloud0.current) cloud0.current.rotation.y -= delta
  })
  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud ref={cloud0} {...config} bounds={[x, y, z] as any} color={color as string} />
          <Cloud {...config} bounds={[x, y, z] as any} color="#eed0d0" seed={2} position={[15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z] as any} color="#d0e0d0" seed={3} position={[-15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z] as any} color="#a0b0d0" seed={4} position={[0, 0, -12]} />
          <Cloud {...config} bounds={[x, y, z] as any} color="#c0c0dd" seed={5} position={[0, 0, 12]} />
          <Cloud concentrate="outside" growth={100} color="#ffccdd" opacity={1.25} seed={0.3} bounds={200 as any} volume={200} />
        </Clouds>
      </group>
    </>
  )
}
