import { EffectComposer, TiltShift2, HueSaturation, DotScreen } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useResolvedControls } from '../controls/resolve'

export function MotionPathCinema() {
  const c = useResolvedControls('effects', 'motionpath-cinema')
  const dotScreenScale = c.dotScreenScale as number
  const hue = c.hue as number
  const saturation = c.saturation as number
  const tiltBlur = c.tiltBlur as number
  return (
    <EffectComposer multisampling={4}>
      <DotScreen blendFunction={BlendFunction.MULTIPLY} scale={dotScreenScale} />
      <HueSaturation hue={hue} saturation={saturation} />
      <TiltShift2 blur={tiltBlur} />
    </EffectComposer>
  )
}
