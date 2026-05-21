import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { usePlaygroundStore } from './store'
import { vehicleById, GROUND_Y } from './vehicles/registry'
import { environmentById } from './environments/registry'
import { effectsById } from './effects/registry'
import { PlaygroundPanel } from './ui/PlaygroundPanel'
import { CameraRig } from './CameraRig'
import { GlobalEffects } from './GlobalEffects'
import { useResolvedGlobal } from './controls/resolve'

export default function Playground() {
  const vehicleId = usePlaygroundStore((s) => s.vehicleId)
  const environmentId = usePlaygroundStore((s) => s.environmentId)
  const effectsId = usePlaygroundStore((s) => s.effectsId)
  const global = useResolvedGlobal()
  const fovOverride = global.fov as { value: number; enabled: boolean }
  const overrideFov = fovOverride?.enabled ? fovOverride.value : null

  const vehicle = vehicleById(vehicleId)
  const environment = environmentById(environmentId)
  const effects = effectsById(effectsId)

  const Vehicle = vehicle.Component
  const EnvComponent = environment.Component
  const EffectsComponent = effects.Component

  return (
    <>
      <Canvas
        shadows
        gl={{ logarithmicDepthBuffer: true, antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: environment.camera.position, fov: environment.camera.fov }}
      >
        <SceneStats />
        <Suspense fallback={null}>
          <group position={[0, GROUND_Y, 0]}>
            <Center key={vehicle.id} bottom disableX disableZ>
              <Vehicle scale={vehicle.scale} rotation={vehicle.rotation} />
            </Center>
          </group>
          <EnvComponent key={`${environment.id}:${vehicle.id}`} />
        </Suspense>
        {EffectsComponent && (
          <Suspense fallback={null}>
            <EffectsComponent key={effects.id} />
          </Suspense>
        )}
        <OrbitControls
          makeDefault
          minDistance={2}
          maxDistance={60}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.02}
          enablePan
          enableDamping
          dampingFactor={0.08}
        />
        <CameraRig preset={environment.camera} envId={environment.id} overrideFov={overrideFov} />
        <GlobalEffects />
      </Canvas>
      <PlaygroundPanel />
    </>
  )
}
