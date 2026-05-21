import * as THREE from 'three'
import { useEffect, useRef, useState, createContext, useContext, type ReactNode } from 'react'
import { Canvas, extend, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Preload } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { easing, geometry } from 'maath'

import model01 from './art_01.glb?url'
import model02 from './art_02.glb?url'
import model03 from './art_03.glb?url'
import fontRegular from '@pmndrs/assets/fonts/inter_regular.woff'
import fontMedium from '@pmndrs/assets/fonts/inter_medium.woff'

extend(geometry as any)

const RouteCtx = createContext<{ activeId: string | null; setActiveId: (id: string | null) => void }>({
  activeId: null,
  setActiveId: () => {},
})

export default function EnterPortals() {
  const [activeId, setActiveId] = useState<string | null>(null)
  return (
    <RouteCtx.Provider value={{ activeId, setActiveId }}>
      <Canvas camera={{ fov: 75, position: [0, 0, 20] }}>
        <SceneStats />
        <color attach="background" args={['#f0f0f0']} />
        <Frame slug="01" label={`art\n01`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
          <Gltf src={model01} scale={8} position={[0, -0.7, -2]} />
        </Frame>
        <Frame slug="02" label="tea" author="Omar Faruq Tawsif">
          <Gltf src={model02} position={[0, -2, -3]} />
        </Frame>
        <Frame slug="03" label="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
          <Gltf src={model03} scale={2} position={[0, -0.8, -4]} />
        </Frame>
        <Rig />
        <Preload all />
      </Canvas>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setActiveId(null)
        }}
        className="fixed top-20 left-6 z-[1000] text-[13px] text-black/70 hover:text-black"
      >
        {activeId ? '< back' : 'double click to enter portal'}
      </a>
    </RouteCtx.Provider>
  )
}

type FrameProps = ThreeElements['group'] & {
  slug: string
  label: string
  author: string
  bg?: string
  width?: number
  height?: number
  children?: ReactNode
}

function Frame({ slug, label, author, bg = '#ffffff', width = 1, height = 1.61803398875, children, ...props }: FrameProps) {
  const portal = useRef<any>(null)
  const { activeId, setActiveId } = useContext(RouteCtx)
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((_state, dt) => {
    if (portal.current) easing.damp(portal.current, 'blend', activeId === slug ? 1 : 0, 0.2, dt)
  })
  return (
    <group {...props}>
      <Text
        font={fontMedium}
        fontSize={0.3}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {label}
      </Text>
      <Text
        font={fontRegular}
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{slug}
      </Text>
      <Text
        font={fontRegular}
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={slug}
        onDoubleClick={(e) => {
          e.stopPropagation()
          setActiveId((e.object as THREE.Object3D).name)
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        {/* @ts-expect-error - extended from maath geometry */}
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={activeId === slug} side={THREE.DoubleSide} blur={0} resolution={512}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
}: {
  position?: THREE.Vector3
  focus?: THREE.Vector3
}) {
  const { controls, scene } = useThree() as any
  const { activeId } = useContext(RouteCtx)
  useEffect(() => {
    const active = activeId ? scene.getObjectByName(activeId) : null
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    } else {
      position.set(0, 0, 2)
      focus.set(0, 0, 0)
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
