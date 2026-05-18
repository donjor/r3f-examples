import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Lightformer, Float } from '@react-three/drei'

interface AnimatedProps {
  positions?: number[]
  intensityScale?: number
  accentColor?: string
}

/** Animated row of circular lightformers + side rails + a red ring lightformer,
 *  with a depth-gradient background sphere. Shared by PorscheShowcase + PorscheLive. */
export function AnimatedLightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0], intensityScale = 1, accentColor = 'red' }: AnimatedProps) {
  const group = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    group.current.position.z += delta * 10
    if (group.current.position.z > 20) group.current.position.z = -60
  })
  return (
    <>
      <Lightformer intensity={0.75 * intensityScale} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer key={i} form="circle" intensity={2 * intensityScale} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
          ))}
        </group>
      </group>
      <Lightformer intensity={4 * intensityScale} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
      <Lightformer intensity={intensityScale} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
      <Lightformer intensity={intensityScale} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer form="ring" color={accentColor} intensity={intensityScale} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
      </Float>
      <GradientSphere />
    </>
  )
}

interface GradientProps {
  baseColor?: string
}

export function GradientSphere({ baseColor = '#444444' }: GradientProps) {
  const shader = useMemo(
    () => ({
      uniforms: {
        colorBase: { value: new THREE.Color(baseColor) },
        colorA: { value: new THREE.Color('#0000ff') },
        colorB: { value: new THREE.Color('#000000') },
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
    }),
    [],
  )
  useEffect(() => {
    shader.uniforms.colorBase.value.set(baseColor)
  }, [baseColor, shader])
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
