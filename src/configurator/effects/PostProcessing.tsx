import { useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom, LUT, Vignette, N8AO } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { useConfiguratorStore } from '../store'

export function PostProcessing() {
  const bloomEnabled = useConfiguratorStore((s) => s.bloomEnabled)
  const bloomIntensity = useConfiguratorStore((s) => s.bloomIntensity)
  const aoEnabled = useConfiguratorStore((s) => s.aoEnabled)
  const vignetteEnabled = useConfiguratorStore((s) => s.vignetteEnabled)
  const lutEnabled = useConfiguratorStore((s) => s.lutEnabled)

  const texture = useLoader(LUTCubeLoader, '/F-6800-STD.cube')

  const hasAnyEffect = bloomEnabled || aoEnabled || vignetteEnabled || lutEnabled
  if (!hasAnyEffect) return null

  // Build effects array to avoid conditional JSX children in EffectComposer
  const effects: React.ReactElement[] = []

  if (bloomEnabled) {
    effects.push(
      <Bloom
        key="bloom"
        luminanceThreshold={0.2}
        mipmapBlur
        luminanceSmoothing={0}
        intensity={bloomIntensity}
      />
    )
  }
  if (aoEnabled) {
    effects.push(
      <N8AO
        key="ao"
        aoRadius={0.5}
        intensity={1}
        distanceFalloff={1}
      />
    )
  }
  if (lutEnabled) {
    effects.push(<LUT key="lut" lut={texture} />)
  }
  if (vignetteEnabled) {
    effects.push(<Vignette key="vignette" offset={0.3} darkness={0.7} />)
  }

  return (
    <EffectComposer enableNormalPass={aoEnabled}>
      {effects}
    </EffectComposer>
  )
}
