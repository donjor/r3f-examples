import * as THREE from 'three'
import { useRef, useReducer, useMemo, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { CuboidCollider, BallCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'

import cModel from './c-transformed.glb?url'

const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
]

export default function LusionConnectors() {
  const [accent, click] = useReducer((state) => (state + 1) % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
    >
      <SceneStats />
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

type ConnectorProps = {
  position?: [number, number, number]
  children?: ReactNode
  color?: string
  roughness?: number
  accent?: boolean
}

function Connector({ position, children, color, roughness, accent }: ConnectorProps) {
  const vec = useMemo(() => new THREE.Vector3(), [])
  const api = useRef<RapierRigidBody>(null!)
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo(() => position || ([r(10), r(10), r(10)] as [number, number, number]), [])
  useFrame((_state, delta) => {
    delta = Math.min(0.1, delta)
    if (api.current) {
      const t = api.current.translation()
      api.current.applyImpulse(vec.set(t.x, t.y, t.z).negate().multiplyScalar(0.2), true)
    }
  })
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </RigidBody>
  )
}

function Pointer() {
  const vec = useMemo(() => new THREE.Vector3(), [])
  const ref = useRef<RapierRigidBody>(null!)
  useFrame(({ pointer, viewport }) => {
    if (ref.current)
      ref.current.setNextKinematicTranslation(vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Model({
  children,
  color = 'white',
  roughness = 0,
}: {
  children?: ReactNode
  color?: string
  roughness?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const { nodes, materials } = useGLTF(cModel) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.MeshStandardMaterial>
  }
  useFrame((_state, delta) => {
    if (ref.current) easing.dampC((ref.current.material as THREE.MeshStandardMaterial).color, color, 0.2, delta)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow scale={10} geometry={nodes.connector.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.base.map} />
      {children}
    </mesh>
  )
}

useGLTF.preload(cModel)
