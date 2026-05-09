import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SlidersHorizontal } from 'lucide-react'
import { EnvironmentRenderer } from './environments/EnvironmentRenderer'
import { VehicleModel } from './vehicles/VehicleModel'
import { PostProcessing } from './effects/PostProcessing'
import { ControlPanel } from './ui/ControlPanel'
import { VehicleBar } from './ui/VehicleBar'
import { useConfiguratorStore } from './store'

export function ConfiguratorScene() {
  const autoRotate = useConfiguratorStore((s) => s.autoRotate)
  const [panelOpen, setPanelOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState<'3d' | 'static'>('3d')

  return (
    <div className="relative h-screen w-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ logarithmicDepthBuffer: true, antialias: false }}
        camera={{ position: [5, 2, 10], fov: 30 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <EnvironmentRenderer>
            <VehicleModel />
          </EnvironmentRenderer>
          <PostProcessing />
        </Suspense>
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      <VehicleBar
        panelOpen={panelOpen}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      <ControlPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />

      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
        >
          <SlidersHorizontal className="size-3.5" />
          Configure
        </button>
      )}
    </div>
  )
}
