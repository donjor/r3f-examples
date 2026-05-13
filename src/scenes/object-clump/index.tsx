import * as THREE from 'three'
import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Outlines, Environment, useTexture } from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon'
import type { Triplet } from '@react-three/cannon'
import { EffectComposer, N8AO, SMAA } from '@react-three/postprocessing'
import { useControls } from 'leva'

import adamsbridgeHdr from './adamsbridge.hdr?url'
import crossImg from './cross.jpg'

const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: 'white', roughness: 0, envMapIntensity: 1 })

export default function ObjectClump() {
  return (
    <Suspense fallback={null}>
      <Canvas
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
      >
        <ambientLight intensity={0.5} />
        <color attach="background" args={['#dfdfdf']} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
        <Physics gravity={[0, 2, 0]} iterations={10}>
          <Pointer />
          <Clump />
        </Physics>
        <Environment files={adamsbridgeHdr} />
        <EffectComposer multisampling={0}>
          <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </Suspense>
  )
}

function Clump() {
  const mat = new THREE.Matrix4()
  const vec = new THREE.Vector3()
  const { outlines } = useControls({ outlines: { value: 0.0, step: 0.01, min: 0, max: 0.05 } })
  const texture = useTexture(crossImg)
  const [ref, api] = useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20), rfs(20)] as Triplet,
  }))
  useFrame(() => {
    if (!ref.current) return
    for (let i = 0; i < 40; i++) {
      ref.current.getMatrixAt(i, mat)
      api
        .at(i)
        .applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-40).toArray() as Triplet, [0, 0, 0])
    }
  })
  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[sphereGeometry, baubleMaterial, 40]} material-map={texture}>
      <Outlines thickness={outlines} />
    </instancedMesh>
  )
}

function Pointer() {
  const viewport = useThree((state) => state.viewport)
  const [, api] = useSphere(() => ({ type: 'Kinematic', args: [3], position: [0, 0, 0] }))
  useFrame((state) =>
    api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0),
  )
  return null
}
