import { useState, useRef, type ComponentPropsWithoutRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const URL = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models'

function useHover(): [boolean, { onPointerOver: () => void; onPointerOut: () => void }] {
  const [hovered, hover] = useState(false)
  return [hovered, { onPointerOver: () => hover(true), onPointerOut: () => hover(false) }]
}

export function Soda(props: ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<THREE.Group>(null!)
  const [hovered, spread] = useHover()
  const { nodes, materials } = useGLTF(`${URL}/soda-bottle/model.gltf`) as unknown as {
    nodes: Record<string, THREE.Mesh>
    materials: Record<string, THREE.Material>
  }
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta
  })
  return (
    <group ref={ref} {...props} {...spread} dispose={null}>
      <mesh geometry={nodes.Mesh_sodaBottle.geometry}>
        <meshStandardMaterial color={hovered ? 'red' : 'green'} roughness={0.33} metalness={0.8} envMapIntensity={2} />
      </mesh>
      <mesh geometry={nodes.Mesh_sodaBottle_1.geometry} material={materials.red} material-envMapIntensity={0} />
    </group>
  )
}

export function Duck(props: ComponentPropsWithoutRef<'primitive'>) {
  const { scene } = useGLTF(`${URL}/duck/model.gltf`)
  return <primitive object={scene} {...props} />
}

export function Candy(props: ComponentPropsWithoutRef<'primitive'>) {
  const { scene } = useGLTF(`${URL}/candy-bucket/model.gltf`)
  useFrame((_state, delta) => {
    scene.rotation.z = scene.rotation.y += delta
  })
  return <primitive object={scene} {...props} />
}

export function Flash(props: ComponentPropsWithoutRef<'primitive'>) {
  const { scene } = useGLTF(`${URL}/lightning/model.gltf`)
  useFrame((_state, delta) => {
    scene.rotation.y += delta
  })
  return <primitive object={scene} {...props} />
}

export function Apple(props: ComponentPropsWithoutRef<'primitive'>) {
  const { scene } = useGLTF(`${URL}/apple-half/model.gltf`)
  useFrame((_state, delta) => {
    scene.rotation.y += delta
  })
  return <primitive object={scene} {...props} />
}

export function Target(props: ComponentPropsWithoutRef<'primitive'>) {
  const { scene } = useGLTF(`${URL}/target-stand/model.gltf`)
  useFrame((_state, delta) => {
    scene.rotation.y += delta
  })
  return <primitive object={scene} {...props} />
}
