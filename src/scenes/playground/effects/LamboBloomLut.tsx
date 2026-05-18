import { useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom, LUT } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function LamboBloomLut() {
  const texture = useLoader(LUTCubeLoader, '/F-6800-STD.cube')
  const c = useResolvedControls('effects', 'lambo-bloom-lut')
  const bloomIntensity = c.bloomIntensity as number
  const bloomThreshold = c.bloomThreshold as number
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={bloomThreshold} mipmapBlur luminanceSmoothing={0} intensity={bloomIntensity} />
      <LUT lut={texture} />
    </EffectComposer>
  )
}
