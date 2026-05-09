import { useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom, LUT, Vignette, N8AO } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { useConfiguratorStore } from '../store'

export function PostProcessing() {
  const fx = useConfiguratorStore((s) => s.effects)
  const texture = useLoader(LUTCubeLoader, '/F-6800-STD.cube')

  const hasAnyEffect = fx.bloomEnabled || fx.aoEnabled || fx.vignetteEnabled || fx.lutEnabled
  if (!hasAnyEffect) return null

  const effects: React.ReactElement[] = []

  if (fx.bloomEnabled) {
    effects.push(
      <Bloom
        key="bloom"
        luminanceThreshold={fx.bloomThreshold}
        mipmapBlur
        luminanceSmoothing={0}
        intensity={fx.bloomIntensity}
      />
    )
  }
  if (fx.aoEnabled) {
    effects.push(
      <N8AO
        key="ao"
        aoRadius={fx.aoRadius}
        intensity={fx.aoIntensity}
        distanceFalloff={1}
      />
    )
  }
  if (fx.lutEnabled) {
    effects.push(<LUT key="lut" lut={texture} />)
  }
  if (fx.vignetteEnabled) {
    effects.push(<Vignette key="vignette" offset={fx.vignetteOffset} darkness={fx.vignetteDarkness} />)
  }

  return (
    <EffectComposer enableNormalPass={fx.aoEnabled}>
      {effects}
    </EffectComposer>
  )
}
