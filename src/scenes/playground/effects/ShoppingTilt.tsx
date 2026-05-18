import { EffectComposer, N8AO, TiltShift2 } from '@react-three/postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function ShoppingTilt() {
  const c = useResolvedControls('effects', 'shopping-tilt')
  const aoRadius = c.aoRadius as number
  const aoIntensity = c.aoIntensity as number
  const tiltBlur = c.tiltBlur as number
  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <N8AO aoRadius={aoRadius} intensity={aoIntensity} distanceFalloff={0.5} />
      <TiltShift2 blur={tiltBlur} />
    </EffectComposer>
  )
}
