import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function DiamondBloom() {
  const c = useResolvedControls('effects', 'diamond-bloom')
  const bloomIntensity = c.bloomIntensity as number
  const bloomThreshold = c.bloomThreshold as number
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={bloomThreshold} intensity={bloomIntensity} levels={9} mipmapBlur />
    </EffectComposer>
  )
}
