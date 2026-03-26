import type React from 'react'
import * as THREE from 'three'
import { useMemo } from 'react'
import { applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

/*
Author: Steven Grey (https://sketchfab.com/Steven007)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/lamborghini-urus-2650599973b649ddb4460ff6c03e4aa2
Title: Lamborghini Urus
*/
export function Lamborghini(props: React.JSX.IntrinsicElements['group']) {
  const { scene, nodes, materials } = useGLTF('/lambo.glb')
  useMemo(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh
        if (mesh.name.startsWith('glass')) mesh.geometry.computeVertexNormals()
        if (mesh.name === 'silver_001_BreakDiscs_0') {
          mesh.material = applyProps(
            (materials.BreakDiscs as THREE.MeshStandardMaterial).clone(),
            { color: '#ddd' }
          )
        }
      }
    })
    ;(nodes['glass_003'] as THREE.Mesh).scale.setScalar(2.7)
    applyProps(materials.FrameBlack, { metalness: 0.75, roughness: 0, color: 'black' })
    applyProps(materials.Chrome, { metalness: 1, roughness: 0, color: '#333' })
    applyProps(materials.BreakDiscs, { metalness: 0.2, roughness: 0.2, color: '#555' })
    applyProps(materials.TiresGum, { metalness: 0, roughness: 0.4, color: '#181818' })
    applyProps(materials.GreyElements, { metalness: 0, color: '#292929' })
    applyProps(materials.emitbrake, { emissiveIntensity: 3, toneMapped: false })
    applyProps(materials.LightsFrontLed, { emissiveIntensity: 3, toneMapped: false })
    ;(nodes.yellow_WhiteCar_0 as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
      roughness: 0.3,
      metalness: 0.05,
      color: '#111',
      envMapIntensity: 0.75,
      clearcoatRoughness: 0,
      clearcoat: 1
    })
  }, [nodes, materials])
  return <primitive object={scene} {...props} />
}
