import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function Datsun(props: React.JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/datsun-transformed.glb')
  const n = nodes as Record<string, THREE.Mesh>
  const c = useResolvedControls('vehicle', 'datsun')
  const paintColor = c.paintColor as string
  const paintRoughness = c.paintRoughness as number
  const envMapIntensity = c.envMapIntensity as number

  useLayoutEffect(() => {
    const paint = materials.paint as THREE.MeshStandardMaterial
    paint.color.set(paintColor)
    paint.roughness = paintRoughness
    paint.envMapIntensity = envMapIntensity
    paint.needsUpdate = true
  }, [materials, paintColor, paintRoughness, envMapIntensity])

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_1.geometry} material={materials.alloy} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_2.geometry} material={materials.headlights} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_3.geometry} material={materials.black_paint} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_4.geometry} material={materials.tire} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_5.geometry} material={materials.black_matte} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_6.geometry} material={materials.chrome} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_7.geometry} material={materials.license} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_8.geometry} material={materials.orange_glass} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_9.geometry} material={materials.glass} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_10.geometry} material={materials.paint} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_11.geometry} material={materials.red_glass} />
      <mesh castShadow receiveShadow geometry={n.Cylinder007_alloy_0_12.geometry} material={materials.stickers} />
    </group>
  )
}

useGLTF.preload('/datsun-transformed.glb')
