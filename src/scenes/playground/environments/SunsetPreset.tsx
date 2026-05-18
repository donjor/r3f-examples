import { Environment, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function SunsetPreset() {
  const c = useResolvedControls('environment', 'sunset-preset')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 6, -4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="sunset" background blur={0.4} environmentIntensity={envIntensity} />
      <ContactShadows position={[0, -1, 0]} opacity={shadowOpacity} scale={20} blur={shadowBlur} far={6} />
    </>
  )
}
