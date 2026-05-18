import { useLoader } from '@react-three/fiber'
import { EffectComposer, LUT } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import cubicleLutUrl from '../../color-grading/cubicle-99.cube?url'

/** LUT pulled from the color-grading example. Original uses three-stdlib's
 *  LUTPass via drei <Effects>; we use postprocessing's LUT with the same .cube
 *  to fit the playground's shared EffectComposer pipeline. */
export function ColorGrading() {
  const lut = useLoader(LUTCubeLoader, cubicleLutUrl)
  return (
    <EffectComposer enableNormalPass={false}>
      <LUT lut={lut} />
    </EffectComposer>
  )
}
