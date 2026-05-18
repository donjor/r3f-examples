import { Environment } from '@react-three/drei'
import { AnimatedLightformers, GradientSphere } from './_shared/LightformerStudio'
import { useResolvedControls } from '../controls/resolve'

export function PorscheShowcase() {
  const c = useResolvedControls('environment', 'porsche-showcase')
  const envIntensity = c.envIntensity as number
  const lightformerIntensity = c.lightformerIntensity as number
  const accentColor = c.accentColor as string
  const bgColor = c.bgColor as string

  return (
    <>
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
      <ambientLight intensity={0.5} />
      <GradientSphere baseColor={bgColor} />
      <Environment frames={Infinity} resolution={256} blur={1} environmentIntensity={envIntensity}>
        <AnimatedLightformers intensityScale={lightformerIntensity} accentColor={accentColor} />
      </Environment>
    </>
  )
}
