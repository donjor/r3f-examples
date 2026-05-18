import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function LusionN8AO() {
  const c = useResolvedControls('effects', 'lusion-n8ao')
  const aoRadius = c.aoRadius as number
  const aoIntensity = c.aoIntensity as number
  return (
    <EffectComposer multisampling={8}>
      <N8AO distanceFalloff={1} aoRadius={aoRadius} intensity={aoIntensity} />
    </EffectComposer>
  )
}
