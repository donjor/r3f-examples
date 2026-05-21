import { Canvas } from '@react-three/fiber'
import { Center, AccumulativeShadows, RandomizedLight, Environment, OrbitControls } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { useControls, button } from 'leva'
import { Datsun } from './Datsun'
import { Effects } from './Effects'

export default function Scene() {
  const { color, effects } = useControls({
    color: '#ff9621',
    effects: true,
    screenshot: button(() => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return
      const link = document.createElement('a')
      link.setAttribute('download', 'canvas.png')
      link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click()
    })
  })
  return (
    <Canvas gl={{ antialias: false, preserveDrawingBuffer: true }} shadows camera={{ position: [4, 0, 6], fov: 35 }}>
      <SceneStats />
      <group position={[0, -0.75, 0]}>
        <Center top>
          <Datsun color={color} />
        </Center>
        <AccumulativeShadows>
          <RandomizedLight position={[2, 5, 5]} />
        </AccumulativeShadows>
      </group>
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      {effects && <Effects />}
      <Environment preset="dawn" background blur={1} />
    </Canvas>
  )
}
