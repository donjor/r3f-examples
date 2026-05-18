import { Environment, MeshReflectorMaterial } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function NightTrain() {
  const c = useResolvedControls('environment', 'night-train')
  const envIntensity = c.envIntensity as number
  const fogNear = c.fogNear as number
  const fogFar = c.fogFar as number
  const reflectorMixStrength = c.reflectorMixStrength as number

  return (
    <>
      <color attach="background" args={['#17171b']} />
      <fog attach="fog" args={['#17171b', fogNear, fogFar]} />
      <ambientLight intensity={0.25} />
      <directionalLight castShadow intensity={2} position={[10, 6, 6]} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={-20} />
      </directionalLight>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={reflectorMixStrength}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#151515"
          metalness={0.6}
          roughness={1}
        />
      </mesh>
      <Environment preset="dawn" environmentIntensity={envIntensity} />
    </>
  )
}
