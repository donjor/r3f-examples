import { EffectComposer, TiltShift2, Bloom } from '@react-three/postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function SoftTiltBloom() {
  const c = useResolvedControls('effects', 'soft-tilt-bloom')
  const bloomIntensity = c.bloomIntensity as number
  const tiltBlur = c.tiltBlur as number
  return (
    <EffectComposer multisampling={4}>
      <Bloom luminanceThreshold={0.9} mipmapBlur intensity={bloomIntensity} />
      <TiltShift2 blur={tiltBlur} />
    </EffectComposer>
  )
}
