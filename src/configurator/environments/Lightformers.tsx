import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Lightformer, Float } from '@react-three/drei'

/* ── Static lightformers (Dark Studio style) ───────────── */

export function StaticLightformers({ accentRing }: { accentRing: boolean }) {
  return (
    <>
      {/* Ceiling strip lights */}
      {[-9, -6, -3, 0, 3, 6, 9].map((z) => (
        <Lightformer
          key={z}
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, z]}
          scale={[10, 1, 1]}
        />
      ))}
      {/* Side walls */}
      <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
      <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
      {/* Accent ring */}
      {accentRing && (
        <Lightformer
          form="ring"
          color="red"
          intensity={10}
          scale={2}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      )}
    </>
  )
}

/* ── Animated lightformers (Animated Studio style) ─────── */

export function AnimatedLightformers({ accentRing }: { accentRing: boolean }) {
  return (
    <>
      <MovingLightformers />
      {accentRing && (
        <Float speed={5} floatIntensity={2} rotationIntensity={2}>
          <Lightformer form="ring" color="red" intensity={1} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
        </Float>
      )}
    </>
  )
}

export { GradientSphere }

function MovingLightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }: { positions?: number[] }) {
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
            <Lightformer
              key={i}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[3, 1, 1]}
            />
          ))}
        </group>
      </group>
      <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
      <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
      <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
    </>
  )
}

/* ── Gradient sphere background (custom shader) ────────── */

const GRAD_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GRAD_FRAG = /* glsl */ `
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
`

function GradientSphere({
  colorBase,
  colorA,
  colorB,
}: {
  colorBase: string
  colorA: string
  colorB: string
}) {
  const ref = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(() => ({
    colorBase: { value: new THREE.Color(colorBase) },
    colorA: { value: new THREE.Color(colorA) },
    colorB: { value: new THREE.Color(colorB) },
    origin: { value: new THREE.Vector3(100, 100, 100) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  useEffect(() => {
    const mat = ref.current
    if (!mat) return
    mat.uniforms.colorBase.value.set(colorBase)
    mat.uniforms.colorA.value.set(colorA)
    mat.uniforms.colorB.value.set(colorB)
    mat.uniformsNeedUpdate = true
  }, [colorBase, colorA, colorB])

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={ref}
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={GRAD_VERT}
        fragmentShader={GRAD_FRAG}
      />
    </mesh>
  )
}

/* ── Decorative floor rings (Dark Studio style) ────────── */

export function DecorativeRings() {
  return (
    <>
      <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
    </>
  )
}
