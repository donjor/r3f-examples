import type React from 'react'
import * as THREE from 'three'
import { useRef, useState, useContext, createContext, forwardRef, useImperativeHandle, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { Hud, OrbitControls, RenderTexture, OrthographicCamera, PerspectiveCamera, Text, Environment } from '@react-three/drei'
import { suspend } from 'suspend-react'

const medium = import('@pmndrs/assets/fonts/inter_medium.woff')
const HoverContext = createContext<number | false>(false)

export default function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5 * Math.PI} />
      <Torus scale={1.75} />
      <ViewcubeHud />
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}

function Torus(props: ThreeElements['mesh']) {
  const [hovered, hover] = useState(false)
  return (
    <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} {...props}>
      <torusGeometry args={[1, 0.25, 32, 100]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function ViewcubeHud({ renderPriority = 1 }: { renderPriority?: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const matrix = useRef(new THREE.Matrix4())
  const { camera, viewport } = useThree()

  useFrame(() => {
    matrix.current.copy(camera.matrix).invert()
    mesh.current.quaternion.setFromRotationMatrix(matrix.current)
  })

  return (
    <Hud renderPriority={renderPriority}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <Box ref={mesh} position={[viewport.width / 2 - 1, viewport.height / 2 - 1, 0] as [number, number, number]}>
        <FaceMaterial index={0}>front</FaceMaterial>
        <FaceMaterial index={1}>back</FaceMaterial>
        <FaceMaterial index={2}>top</FaceMaterial>
        <FaceMaterial index={3}>bottom</FaceMaterial>
        <FaceMaterial index={4}>left</FaceMaterial>
        <FaceMaterial index={5}>right</FaceMaterial>
      </Box>
      <ambientLight intensity={1} />
      <pointLight position={[200, 200, 100]} intensity={0.5} />
    </Hud>
  )
}

type BoxProps = ThreeElements['mesh'] & { children: ReactNode }

const Box = forwardRef<THREE.Mesh, BoxProps>(({ children, ...props }, fref) => {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState<number | false>(false)
  const [clicked, click] = useState(false)
  useFrame((_state, delta) => { ref.current.rotation.x += delta })
  useImperativeHandle(fref, () => ref.current, [])
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerMove={(event) => { event.stopPropagation(); hover(event.face?.materialIndex ?? false) }}
      onPointerOut={() => hover(false)}>
      <boxGeometry />
      <HoverContext.Provider value={hovered}>{children}</HoverContext.Provider>
    </mesh>
  )
})

function FaceMaterial({ children, index }: { children: string; index: number }) {
  const hovered = useContext(HoverContext)
  const mod = suspend(() => medium, ['inter-medium-font']) as { default: string }
  const font = mod.default
  return (
    <meshStandardMaterial attach={`material-${index}`} color={hovered === index ? 'hotpink' : 'orange'}>
      <RenderTexture frames={6} attach="map" anisotropy={16}>
        <color attach="background" args={['white']} />
        <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} position={[0, 0, 10]} zoom={0.5} />
        <Text font={font} color="black">
          {children}
        </Text>
      </RenderTexture>
    </meshStandardMaterial>
  )
}
