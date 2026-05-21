import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { Canvas, applyProps, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, AccumulativeShadows, RandomizedLight, Environment, Lightformer, Float, useGLTF } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'

export default function Scene() {
  const [degraded, degrade] = useState(false)
  return (
    <Canvas shadows camera={{ position: [5, 0, 15], fov: 30 }}>
      <SceneStats />
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
      <ambientLight intensity={0.5} />
      <Porsche scale={1.6} position={[-0.5, -0.18, 0]} rotation={[0, Math.PI / 5, 0]} />
      <AccumulativeShadows position={[0, -1.16, 0]} frames={100} alphaTest={0.9} scale={10}>
        <RandomizedLight amount={8} radius={10} ambient={0.5} position={[1, 5, -1]} />
      </AccumulativeShadows>
      <PerformanceMonitor onDecline={() => degrade(true)} />
      <Environment frames={degraded ? 1 : Infinity} resolution={256} background blur={1}>
        <Lightformers />
      </Environment>
      <CameraRig />
    </Canvas>
  )
}

function Porsche(props: React.JSX.IntrinsicElements['group']) {
  const { scene, nodes, materials } = useGLTF('/911-transformed.glb')
  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.receiveShadow = node.castShadow = true
      }
    })
    applyProps(materials.rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.window, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.coat, { envMapIntensity: 4, roughness: 0.5, metalness: 1 })
    applyProps(materials.paint, { envMapIntensity: 2, roughness: 0.45, metalness: 0.8, color: '#555' })
  }, [nodes, materials])
  return <primitive object={scene} {...props} />
}

function CameraRig() {
  const v = useMemo(() => new THREE.Vector3(), [])
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }: { positions?: number[] }) {
  const group = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    group.current.position.z += delta * 10
    if (group.current.position.z > 20) group.current.position.z = -60
  })
  return (
    <>
      <Lightformer intensity={0.75} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer key={i} form="circle" intensity={2} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
          ))}
        </group>
      </group>
      <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
      <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
      <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer form="ring" color="red" intensity={1} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
      </Float>
      <GradientSphere />
    </>
  )
}

/** Replaces lamina LayerMaterial — depth-based gradient background sphere */
function GradientSphere() {
  const shader = useMemo(() => ({
    uniforms: {
      colorBase: { value: new THREE.Color('#444') },
      colorA: { value: new THREE.Color('blue') },
      colorB: { value: new THREE.Color('black') },
      origin: { value: new THREE.Vector3(100, 100, 100) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 colorBase;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec3 origin;
      varying vec3 vWorldPos;
      void main() {
        float d = clamp(length(vWorldPos - origin) / 300.0, 0.0, 1.0);
        vec3 depth = mix(colorA, colorB, d);
        gl_FragColor = vec4(mix(colorBase, depth, 0.5), 1.0);
      }
    `,
  }), [])

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={shader.uniforms}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
      />
    </mesh>
  )
}
