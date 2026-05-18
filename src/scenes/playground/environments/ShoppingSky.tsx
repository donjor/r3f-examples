import { Sky, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function ShoppingSky() {
  const c = useResolvedControls('environment', 'shopping-sky')
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  const sunInclination = c.sunInclination as number
  const sunAzimuth = c.sunAzimuth as number

  const theta = Math.PI * (sunInclination - 0.5)
  const phi = 2 * Math.PI * (sunAzimuth - 0.5)
  const dist = 15
  const lightX = dist * Math.cos(phi)
  const lightY = dist * Math.sin(phi) * Math.sin(theta) + 6
  const lightZ = dist * Math.sin(phi) * Math.cos(theta)

  return (
    <>
      <Sky inclination={sunInclination} azimuth={sunAzimuth} />
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.5} position={[lightX, lightY, lightZ]} castShadow shadow-mapSize={[1024, 1024]} />
      <ContactShadows position={[0, -1, 0]} opacity={shadowOpacity} scale={20} blur={shadowBlur} far={6} />
    </>
  )
}
