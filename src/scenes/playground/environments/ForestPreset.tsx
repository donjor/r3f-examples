import { Environment, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function ForestPreset() {
  const c = useResolvedControls('environment', 'forest-preset')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={1.0} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="forest" background blur={0.4} environmentIntensity={envIntensity} />
      <ContactShadows position={[0, -1, 0]} opacity={shadowOpacity} scale={20} blur={shadowBlur} far={6} />
    </>
  )
}
