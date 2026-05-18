import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect, useRef } from 'react'
import { applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function Lamborghini(props: React.JSX.IntrinsicElements['group']) {
  const { scene, nodes, materials } = useGLTF('/lambo.glb')
  const c = useResolvedControls('vehicle', 'lamborghini')
  const paintColor = c.paintColor as string
  const paintRoughness = c.paintRoughness as number
  const clearcoat = c.clearcoat as number
  const envMapIntensity = c.envMapIntensity as number
  const paintMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh
        mesh.castShadow = mesh.receiveShadow = true
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
    const paintMat = new THREE.MeshPhysicalMaterial({
      roughness: paintRoughness,
      metalness: 0.05,
      color: paintColor,
      envMapIntensity: envMapIntensity,
      clearcoatRoughness: 0,
      clearcoat: clearcoat,
    })
    ;(nodes.yellow_WhiteCar_0 as THREE.Mesh).material = paintMat
    paintMatRef.current = paintMat
  }, [nodes, materials])

  useLayoutEffect(() => {
    const m = paintMatRef.current
    if (!m) return
    m.color.set(paintColor)
    m.roughness = paintRoughness
    m.clearcoat = clearcoat
    m.envMapIntensity = envMapIntensity
    m.needsUpdate = true
  }, [paintColor, paintRoughness, clearcoat, envMapIntensity])

  return <primitive object={scene} {...props} />
}

useGLTF.preload('/lambo.glb')
