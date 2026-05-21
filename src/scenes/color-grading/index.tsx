import { Canvas, extend, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, Effects, useTexture } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { LUTPass, LUTCubeLoader } from 'three-stdlib'

import cubicleTex from './cubicle-99.cube?url'
import terrazoImage from './terrazo.png'

extend({ LUTPass })

function Grading() {
  const { texture3D } = useLoader(LUTCubeLoader, cubicleTex)
  return (
    <Effects>
      {/* @ts-expect-error - lUTPass extended at runtime */}
      <lUTPass lut={texture3D} intensity={0.75} />
    </Effects>
  )
}

function Sphere(props: React.ComponentProps<'mesh'>) {
  const texture = useTexture(terrazoImage)
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial map={texture} clearcoat={1} clearcoatRoughness={0} roughness={0} metalness={0.5} />
    </mesh>
  )
}

export default function ColorGrading() {
  return (
    <Canvas frameloop="demand" camera={{ position: [0, 0, 5], fov: 45 }}>
      <SceneStats />
      <ambientLight />
      <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[5, 15, 10]} />
      <Sphere />
      <Grading />
      <Environment preset="dawn" background blur={0.6} />
      <OrbitControls />
    </Canvas>
  )
}
