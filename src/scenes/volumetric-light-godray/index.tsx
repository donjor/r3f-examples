import * as THREE from 'three'
import { forwardRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CubeCamera, Float, MeshReflectorMaterial } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'

import vid10 from './10.mp4'

export default function VolumetricLightGodray() {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 35, near: 1, far: 60 }} gl={{ antialias: false }}>
      <SceneStats />
      <color attach="background" args={['#050505']} />
      <ambientLight />
      <Screen />
      <Float rotationIntensity={3} floatIntensity={3} speed={1}>
        <CubeCamera position={[-3, -1, -5]} resolution={256} frames={Infinity}>
          {(texture) => (
            <mesh>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial metalness={1} roughness={0.1} envMap={texture as THREE.Texture} />
            </mesh>
          )}
        </CubeCamera>
      </Float>
      <Floor />
      <Rig />
    </Canvas>
  )
}

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        5 + state.pointer.x,
        0 + state.pointer.y,
        18 + Math.atan2(state.pointer.x, state.pointer.y) * 2,
      ],
      0.4,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

const Floor = () => (
  <mesh position={[0, -5.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[50, 50]} />
    <MeshReflectorMaterial
      blur={[300, 50]}
      resolution={1024}
      mixBlur={1}
      mixStrength={100}
      roughness={1}
      depthScale={1.2}
      minDepthThreshold={0.4}
      maxDepthThreshold={1.4}
      color="#202020"
      metalness={0.8}
    />
  </mesh>
)

const Emitter = forwardRef<THREE.Mesh, React.ComponentProps<'mesh'>>((props, forwardedRef) => {
  const [video] = useState(() =>
    Object.assign(document.createElement('video'), {
      src: vid10,
      crossOrigin: 'Anonymous',
      loop: true,
      muted: true,
    }),
  )
  useEffect(() => {
    void video.play()
  }, [video])
  return (
    <mesh ref={forwardedRef} position={[0, 0, -16]} {...props}>
      <planeGeometry args={[16, 10]} />
      <meshBasicMaterial>
        <videoTexture attach="map" args={[video]} colorSpace={THREE.SRGBColorSpace} />
      </meshBasicMaterial>
      <mesh scale={[16.05, 10.05, 1]} position={[0, 0, -0.01]}>
        <planeGeometry />
        <meshBasicMaterial color="black" />
      </mesh>
    </mesh>
  )
})

function Screen() {
  const [material, set] = useState<THREE.Mesh | null>(null)
  return (
    <>
      <Emitter ref={set as any} />
      {material && (
        <EffectComposer multisampling={8}>
          <GodRays sun={material} exposure={0.34} decay={0.8} blur />
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
        </EffectComposer>
      )}
    </>
  )
}
