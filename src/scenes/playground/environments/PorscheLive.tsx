import { Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { AnimatedLightformers, GradientSphere } from './_shared/LightformerStudio'
import { useResolvedControls } from '../controls/resolve'

export function PorscheLive() {
  const c = useResolvedControls('environment', 'porsche-live')
  const envIntensity = c.envIntensity as number
  const lightformerIntensity = c.lightformerIntensity as number
  const accentColor = c.accentColor as string
  const bgColor = c.bgColor as string

  return (
    <>
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
      <ambientLight intensity={0.5} />
      <AccumulativeShadows position={[0, -1, 0]} frames={100} alphaTest={0.9} scale={12}>
        <RandomizedLight amount={8} radius={10} ambient={0.5} position={[1, 5, -1]} />
      </AccumulativeShadows>
      <GradientSphere baseColor={bgColor} />
      <Environment frames={Infinity} resolution={256} blur={1} environmentIntensity={envIntensity}>
        <AnimatedLightformers intensityScale={lightformerIntensity} accentColor={accentColor} />
      </Environment>
    </>
  )
}
