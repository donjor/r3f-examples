import { Environment, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function CitySoft() {
  const c = useResolvedControls('environment', 'city-soft')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.2} castShadow />
      <Environment preset="city" environmentIntensity={envIntensity} />
      <ContactShadows position={[0, -1, 0]} opacity={shadowOpacity} scale={20} blur={shadowBlur} far={4} />
    </>
  )
}
