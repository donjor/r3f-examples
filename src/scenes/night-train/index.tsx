import * as THREE from 'three'
import { Suspense, useMemo, useRef, type ComponentProps } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useScroll, ScrollControls, Environment, Merged, Text, MeshReflectorMaterial } from '@react-three/drei'

import cabinModel from './cabin-transformed.glb?url'
import seatModel from './seat-transformed.glb?url'

function Train() {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const [cabin, seat] = useGLTF([cabinModel, seatModel]) as unknown as [
    { nodes: Record<string, THREE.Mesh> },
    { nodes: Record<string, THREE.Mesh> },
  ]
  const meshes = useMemo(() => ({ Cabin: cabin.nodes.cabin_1, Seat: seat.nodes.seat }), [cabin, seat])
  useFrame(() => {
    if (ref.current) ref.current.position.z = scroll.offset * 120
  })
  return (
    <Merged castShadow receiveShadow meshes={meshes}>
      {(models: any) => (
        <group ref={ref}>
          <Cabin models={models} color="#252525" seatColor="sandybrown" label="1A" position={[0, 0, -6]} />
          <Cabin models={models} color="#454545" seatColor="gray" label="2B" position={[0, 0, -32]} />
          <Cabin models={models} color="#252525" seatColor="lightskyblue" label="3A" position={[0, 0, -58]} />
          <Cabin models={models} color="#454545" seatColor="gray" label="4B" position={[0, 0, -84]} />
          <Cabin models={models} color="#252525" seatColor="sandybrown" label="5B" position={[0, 0, -110]} />
        </group>
      )}
    </Merged>
  )
}

type ModelsT = { Cabin: any; Seat: any }

function Quarter({ models, color, ...props }: { models: ModelsT; color: string } & ComponentProps<'group'>) {
  return (
    <group {...props}>
      <models.Seat color={color} position={[-0.35, 0, 0.7]} />
      <models.Seat color={color} position={[0.35, 0, 0.7]} />
      <models.Seat color={color} position={[-0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
      <models.Seat color={color} position={[0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

function Row({ models, color, ...props }: { models: ModelsT; color: string } & ComponentProps<'group'>) {
  return (
    <group {...props}>
      <Quarter models={models} color={color} position={[-1.2, -0.45, 9.75]} />
      <Quarter models={models} color={color} position={[1.2, -0.45, 9.75]} />
    </group>
  )
}

function Cabin({
  models,
  color = 'white',
  seatColor = 'white',
  label,
  ...props
}: { models: ModelsT; color?: string; seatColor?: string; label: string } & ComponentProps<'group'>) {
  return (
    <group {...props}>
      <Text fontSize={4} color="#101020" position={[0, 6, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        {label}
      </Text>
      <models.Cabin color={color} />
      <Row models={models} color={seatColor} />
      <Row models={models} color={seatColor} position={[0, 0, -1.9]} />
      <Row models={models} color={seatColor} position={[0, 0, -6.6]} />
      <Row models={models} color={seatColor} position={[0, 0, -8.5]} />
      <Row models={models} color={seatColor} position={[0, 0, -11]} />
      <Row models={models} color={seatColor} position={[0, 0, -12.9]} />
      <Row models={models} color={seatColor} position={[0, 0, -17.6]} />
      <Row models={models} color={seatColor} position={[0, 0, -19.5]} />
    </group>
  )
}

export default function NightTrain() {
  return (
    <Canvas dpr={[1, 1.5]} shadows camera={{ position: [-15, 15, 18], fov: 35 }} gl={{ alpha: false }}>
      <fog attach="fog" args={['#17171b', 30, 40]} />
      <color attach="background" args={['#17171b']} />
      <ambientLight intensity={0.25} />
      <directionalLight castShadow intensity={2} position={[10, 6, 6]} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={-20} />
      </directionalLight>
      <Suspense fallback={null}>
        <ScrollControls pages={3}>
          <Train />
        </ScrollControls>
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={15}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#151515"
            metalness={0.6}
            roughness={1}
          />
        </mesh>
        <Environment preset="dawn" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(cabinModel)
useGLTF.preload(seatModel)
