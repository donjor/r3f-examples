import * as THREE from 'three'
import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { SceneStats } from '@/components/scene-stats'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

const images = [
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970) },
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574) },
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675) },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) },
] as const

const ActiveCtx = createContext<{ activeId: string | null; setActiveId: (id: string | null) => void }>({
  activeId: null,
  setActiveId: () => {},
})

export default function ImageGallery() {
  const [activeId, setActiveId] = useState<string | null>(null)
  return (
    <ActiveCtx.Provider value={{ activeId, setActiveId }}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
        <SceneStats />
        <color attach="background" args={['#191920']} />
        <fog attach="fog" args={['#191920', 0, 15]} />
        <group position={[0, -0.5, 0]}>
          <Frames />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
        </group>
        <Environment preset="city" />
      </Canvas>
    </ActiveCtx.Provider>
  )
}

function Frames() {
  const q = new THREE.Quaternion()
  const p = new THREE.Vector3()
  const ref = useRef<THREE.Group>(null!)
  const clicked = useRef<THREE.Object3D | null>(null)
  const { activeId, setActiveId } = useContext(ActiveCtx)
  useEffect(() => {
    clicked.current = activeId ? (ref.current.getObjectByName(activeId) ?? null) : null
    if (clicked.current && clicked.current.parent) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setActiveId(clicked.current === e.object ? null : e.object.name)
      }}
      onPointerMissed={() => setActiveId(null)}
    >
      {images.map((props) => (
        <Frame key={props.url} {...(props as any)} />
      ))}
    </group>
  )
}

function Frame({ url, ...props }: { url: string } & React.ComponentProps<'group'>) {
  const c = new THREE.Color()
  void c
  const image = useRef<any>(null)
  const frame = useRef<THREE.Mesh>(null!)
  const { activeId } = useContext(ActiveCtx)
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = activeId === name
  useCursor(hovered)
  useFrame((state, dt) => {
    if (image.current) {
      image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
      easing.damp3(
        image.current.scale,
        [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
        0.1,
        dt,
      )
    }
    if (frame.current)
      easing.dampC((frame.current.material as THREE.MeshBasicMaterial).color, hovered ? 'orange' : 'white', 0.1, dt)
  })
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => {
          e.stopPropagation()
          hover(true)
        }}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text>
    </group>
  )
}
