import { Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function WarehousePreset() {
  const c = useResolvedControls('environment', 'warehouse-preset')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  return (
    <>
      <ambientLight intensity={0.4} />
      <AccumulativeShadows position={[0, -1, 0]} frames={80} alphaTest={0.85} scale={12} color="#1a1a1a" opacity={shadowOpacity}>
        <RandomizedLight amount={6} radius={6} position={[2, 5, 3]} bias={0.001} />
      </AccumulativeShadows>
      <Environment preset="warehouse" environmentIntensity={envIntensity} />
    </>
  )
}
