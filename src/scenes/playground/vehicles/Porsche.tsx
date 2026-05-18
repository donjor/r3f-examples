import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect } from 'react'
import { applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function Porsche(props: React.JSX.IntrinsicElements['group']) {
  const { scene, nodes, materials } = useGLTF('/911-transformed.glb')
  const c = useResolvedControls('vehicle', 'porsche')
  const paintColor = c.paintColor as string
  const paintRoughness = c.paintRoughness as number
  const clearcoat = c.clearcoat as number
  const envMapIntensity = c.envMapIntensity as number

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.receiveShadow = node.castShadow = true
      }
    })
    applyProps(materials.rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.window, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.coat, { envMapIntensity: 4, roughness: 0.5, metalness: 1 })
  }, [nodes, materials])

  useLayoutEffect(() => {
    const paint = materials.paint as THREE.MeshPhysicalMaterial
    paint.color.set(paintColor)
    paint.roughness = paintRoughness
    paint.metalness = 0.8
    paint.clearcoat = clearcoat
    paint.envMapIntensity = envMapIntensity
    paint.needsUpdate = true
  }, [materials, paintColor, paintRoughness, clearcoat, envMapIntensity])

  return <primitive object={scene} {...props} />
}

useGLTF.preload('/911-transformed.glb')
