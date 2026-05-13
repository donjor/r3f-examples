import * as THREE from 'three'
import { useRef, forwardRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Clouds,
  Cloud,
  MotionPathControls,
  useMotion,
  useTexture,
  OrbitControls,
  MeshWobbleMaterial,
  Gltf,
  Float,
  Environment,
} from '@react-three/drei'
import { EffectComposer, TiltShift2, HueSaturation, DotScreen } from '@react-three/postprocessing'
import { useControls } from 'leva'
import * as CURVES from './curves'

import sonyModel from './sony_cinema_camera-transformed.glb?url'
import stickerImg from './Sticjer_1024x1024@2x.png'
import stickerInvertImg from './Sticjer_1024x1024@2x_invert.png'

type CurveKey = 'Circle' | 'Rollercoaster' | 'Infinity' | 'Heart'

export default function MotionPathControlsScene() {
  const poi = useRef<THREE.Group>(null!)
  const motionRef = useRef<THREE.Group>(null!)
  const { float, attachCamera, debug, path } = useControls({
    attachCamera: true,
    debug: false,
    float: true,
    path: { value: 'Circle' as CurveKey, options: ['Circle', 'Rollercoaster', 'Infinity', 'Heart'] as CurveKey[] },
  })
  const Curve = CURVES[path as CurveKey]
  return (
    <Canvas camera={{ position: [10, 15, -10], fov: 45 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {!attachCamera && <OrbitControls />}
      <MotionPathControls
        object={(attachCamera ? undefined : motionRef) as any}
        focus={poi as any}
        debug={debug}
        damping={0.2}
        focusDamping={0.15}
      >
        <Curve />
        <Loop />
      </MotionPathControls>
      <Gltf visible={!attachCamera} src={sonyModel} scale={0.03} ref={motionRef as any} />
      <Float floatIntensity={20} rotationIntensity={25} speed={float ? 4 : 0}>
        <Sticker position={[1, 0, 1]} scale={2} ref={poi as any} />
      </Float>
      <Environment preset="city" background blur={0.5} />
      <Clouds>
        <Cloud
          concentrate="outside"
          seed={1}
          segments={100}
          bounds={20 as any}
          volume={20}
          growth={10}
          opacity={0.15}
          position={[0, 0, -10]}
          speed={1}
        />
      </Clouds>
      <EffectComposer multisampling={4}>
        <HueSaturation saturation={-1} />
        <TiltShift2 blur={0.5} />
        <DotScreen scale={2} />
      </EffectComposer>
    </Canvas>
  )
}

function Loop({ factor = 0.2 }: { factor?: number }) {
  const motion = useMotion()
  useFrame((_state, delta) => {
    motion.current += Math.min(0.1, delta) * factor
  })
  return null
}

type StickerProps = React.ComponentProps<'mesh'>
const Sticker = forwardRef<THREE.Mesh, StickerProps>((props, ref) => {
  const [smiley, invert] = useTexture([stickerImg, stickerInvertImg])
  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshWobbleMaterial
        factor={4}
        speed={2}
        depthTest={false}
        transparent
        map={smiley}
        map-flipY={false}
        roughness={1}
        roughnessMap={invert}
        roughnessMap-flipY={false}
        map-anisotropy={16}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})
