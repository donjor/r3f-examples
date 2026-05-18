import { AccumulativeShadows, RandomizedLight, Environment } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function DatsunDawn() {
  const c = useResolvedControls('environment', 'datsun-dawn')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const fogNear = c.fogNear as number
  const fogFar = c.fogFar as number
  return (
    <>
      <fog attach="fog" args={['#1a1a1f', fogNear, fogFar]} />
      <AccumulativeShadows
        position={[0, -1.0, 0]}
        frames={100}
        alphaTest={0.85}
        scale={12}
        color="#1a1a1a"
        opacity={shadowOpacity}
      >
        <RandomizedLight amount={8} radius={5} position={[2, 5, 5]} bias={0.001} />
      </AccumulativeShadows>
      <Environment preset="dawn" background blur={1} environmentIntensity={envIntensity} />
    </>
  )
}
