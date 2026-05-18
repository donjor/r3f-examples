import { Environment, MeshReflectorMaterial } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function ImageGalleryFloor() {
  const c = useResolvedControls('environment', 'image-gallery')
  const envIntensity = c.envIntensity as number
  const reflectorMixStrength = c.reflectorMixStrength as number

  return (
    <>
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 25]} />
      <ambientLight intensity={0.3} />
      <directionalLight intensity={1.2} position={[6, 8, 6]} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={reflectorMixStrength}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101015"
          metalness={0.5}
        />
      </mesh>
      <Environment preset="city" environmentIntensity={envIntensity} />
    </>
  )
}
