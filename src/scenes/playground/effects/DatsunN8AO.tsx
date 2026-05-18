import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function DatsunN8AO() {
  const c = useResolvedControls('effects', 'datsun-n8ao')
  const aoRadius = c.aoRadius as number
  const aoIntensity = c.aoIntensity as number
  const bloomIntensity = c.bloomIntensity as number
  return (
    <EffectComposer>
      <N8AO aoRadius={aoRadius} intensity={aoIntensity} distanceFalloff={0.5} />
      <Bloom luminanceThreshold={0.8} mipmapBlur intensity={bloomIntensity} />
    </EffectComposer>
  )
}
