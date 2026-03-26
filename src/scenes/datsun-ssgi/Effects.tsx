import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'

/** Replaces the custom realism-effects SSGI with standard postprocessing (N8AO + Bloom).
 *  Much more compatible and performant — and matches what vone uses. */
export function Effects() {
  return (
    <EffectComposer>
      <N8AO aoRadius={0.5} intensity={2} distanceFalloff={0.5} />
      <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.5} />
    </EffectComposer>
  )
}
