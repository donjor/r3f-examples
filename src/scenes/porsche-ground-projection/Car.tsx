import type React from 'react'
import * as THREE from 'three'
import { useLayoutEffect, useRef } from 'react'
import { useGLTF, CubeCamera } from '@react-three/drei'

export default function Car(props: React.JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF('/porsche-transformed.glb')

  useLayoutEffect(() => {
    const paint = materials.paint as THREE.MeshPhysicalMaterial
    paint.color.set('#ffdf71')
    paint.metalness = 0.2
    paint.roughness = 0
    paint.clearcoat = 1
    paint.envMapIntensity = 1.5
    paint.aoMapIntensity = 1.5

    const chromes = materials['930_chromes'] as THREE.MeshStandardMaterial
    chromes.metalness = 1
    chromes.roughness = 0.3
    chromes.color = new THREE.Color('white')

    const glass = materials['glass'] as THREE.MeshStandardMaterial
    glass.color = new THREE.Color('white')
    glass.opacity = 0.6

    const plastics = materials['930_plastics'] as THREE.MeshStandardMaterial
    plastics.roughness = 0.8

    const lights = materials['930_lights'] as THREE.MeshStandardMaterial
    lights.emissiveMap = lights.map
    lights.emissiveIntensity = 50

    const tire = materials['930_tire'] as THREE.MeshStandardMaterial
    tire.color.set('black')
    tire.roughness = 0.7
  }, [materials])

  const n = nodes as Record<string, THREE.Mesh>

  return (
    <group ref={group} {...props} dispose={null}>
      <CubeCamera frames={1} position={[0, 1.5, 0]} near={0.1} resolution={128}>
        {(texture) => (
          <group position={[0, -1.5, 0]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh geometry={n.mesh_1_instance_0.geometry} material={materials['930_plastics']} position={[-7.966238, -0.10155, -7.966238]} scale={0.000973} />
              <mesh geometry={n.mesh_1_instance_1.geometry} material={materials['930_plastics']} position={[-7.966238, -0.10155, -7.966238]} scale={0.000973} />
            </group>
            <group position={[-7.966238, -0.10155, -7.966238]} scale={0.000973}>
              <mesh geometry={n.mesh_0.geometry} material={materials.paint} material-envMap={texture} />
              <mesh geometry={n.mesh_0_1.geometry} material={materials['930_chromes']} />
              <mesh geometry={n.mesh_0_2.geometry} material={materials.black} />
              <mesh geometry={n.mesh_0_3.geometry} material={materials['930_lights']} />
              <mesh geometry={n.mesh_0_4.geometry} material={materials.glass} />
              <mesh geometry={n.mesh_0_5.geometry} material={materials['930_stickers']} />
              <mesh geometry={n.mesh_0_6.geometry} material={materials['930_plastics']} material-polygonOffset material-polygonOffsetFactor={-10} />
              <mesh geometry={n.mesh_0_7.geometry} material={materials['930_lights_refraction']} />
              <mesh geometry={n.mesh_0_8.geometry} material={materials['930_rim']} />
              <mesh geometry={n.mesh_0_9.geometry} material={materials['930_tire']} />
            </group>
          </group>
        )}
      </CubeCamera>
      <group position={[-7.966238, -0.10155, -7.966238]} scale={0.000973}>
        <mesh geometry={n.mesh_2.geometry} material={materials.plate} material-roughness={1} />
        <mesh geometry={n.mesh_2_1.geometry} material={materials.DefaultMaterial} />
        <mesh geometry={n.mesh_2_2.geometry} material={materials['Material.001']} material-depthWrite={false} material-opacity={0.6} />
      </group>
    </group>
  )
}

useGLTF.preload('/porsche-transformed.glb')
