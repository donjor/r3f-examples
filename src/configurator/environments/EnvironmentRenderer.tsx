import type { ReactNode } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { useConfiguratorStore } from '../store'
import { StaticLightformers, AnimatedLightformers, GradientSphere, DecorativeRings } from './Lightformers'

const GROUND_Y = -1.16

export function EnvironmentRenderer({ children }: { children: ReactNode }) {
  const config = useConfiguratorStore((s) => s.envConfig)

  return (
    <>
      {/* Background */}
      <color attach="background" args={[config.backgroundColor]} />

      {/* Lighting */}
      {config.hemisphereLight && <hemisphereLight intensity={config.hemisphereIntensity} />}
      {config.ambientIntensity > 0 && <ambientLight intensity={config.ambientIntensity} />}
      {config.spotLight && (
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={config.spotIntensity}
          shadow-bias={-0.0001}
        />
      )}

      {children}

      {/* Shadows */}
      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, GROUND_Y, 0]}
        scale={15}
        blur={config.shadowBlur}
        opacity={config.shadowOpacity}
        far={20}
      />

      {/* Decorative elements */}
      {config.decorativeRings && <DecorativeRings />}

      {/* Gradient sphere — scene-level so it's visible sky without polluting reflections */}
      {config.gradientSphere && (
        <GradientSphere
          colorBase={config.gradientColorBase}
          colorA={config.gradientColorA}
          colorB={config.gradientColorB}
        />
      )}

      {/* Environment map (reflections only for lightformer modes) */}
      {config.envSource === 'static-lightformers' ? (
        <Environment resolution={512}>
          <StaticLightformers accentRing={config.accentRing} />
        </Environment>
      ) : config.envSource === 'animated-lightformers' ? (
        <Environment frames={Infinity} resolution={256}>
          <AnimatedLightformers accentRing={config.accentRing} />
        </Environment>
      ) : (
        <Environment
          preset={config.dreiPreset as 'city'}
          background={config.envBackground}
          blur={config.envBlur}
        />
      )}
    </>
  )
}

export { GROUND_Y }
