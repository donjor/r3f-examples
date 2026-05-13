import { useState, useRef, type ComponentPropsWithoutRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Note: upstream demo references gLTFs at vazxmixjsiawhamofees.supabase.co which
// is no longer reachable. Substituted with procedural primitives so the
// View-tracking technique still demonstrates with six distinct shapes.

function useHover(): [boolean, { onPointerOver: () => void; onPointerOut: () => void }] {
  const [hovered, hover] = useState(false)
  return [hovered, { onPointerOver: () => hover(true), onPointerOut: () => hover(false) }]
}

export function Soda(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  const [hovered, spread] = useHover()
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props} {...spread} dispose={null}>
      <mesh>
        <capsuleGeometry args={[0.05, 0.15, 4, 16]} />
        <meshStandardMaterial color={hovered ? 'red' : 'green'} roughness={0.33} metalness={0.8} envMapIntensity={2} />
      </mesh>
    </group>
  )
}

export function Duck(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props}>
      <mesh>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}

export function Candy(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta
      ref.current.rotation.z += delta
    }
  })
  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fb923c" roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  )
}

export function Flash(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props}>
      <mesh>
        <tetrahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.2} metalness={0.7} />
      </mesh>
    </group>
  )
}

export function Apple(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props}>
      <mesh>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  )
}

export function Target(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props}>
      <mesh>
        <torusGeometry args={[0.35, 0.12, 16, 32]} />
        <meshStandardMaterial color="#e879f9" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}
