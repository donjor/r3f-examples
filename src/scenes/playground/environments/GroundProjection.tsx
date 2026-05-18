import { Environment, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function GroundProjection() {
  const c = useResolvedControls('environment', 'ground-projection')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  const groundRadius = c.groundRadius as number
  const groundHeight = c.groundHeight as number

  return (
    <>
      <ambientLight intensity={0.3} />
      <Environment
        files="/old_depot_2k.hdr"
        ground={{ height: groundHeight, radius: groundRadius, scale: 100 }}
        environmentIntensity={envIntensity}
      />
      <ContactShadows
        position={[0, -1, 0]}
        frames={10}
        resolution={1024}
        scale={20}
        blur={shadowBlur}
        opacity={shadowOpacity}
        far={20}
      />
    </>
  )
}
