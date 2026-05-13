import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'
import { useFrame, useLoader } from '@react-three/fiber'
import bladeDiffuse from './resources/blade_diffuse.jpg'
import bladeAlpha from './resources/blade_alpha.jpg'
import './GrassMaterial'

const noise2D = createNoise2D()

function getYPosition(x: number, z: number) {
  let y = 2 * noise2D(x / 50, z / 50)
  y += 4 * noise2D(x / 100, z / 100)
  y += 0.2 * noise2D(x / 10, z / 10)
  return y
}

function multiplyQuaternions(q1: THREE.Vector4, q2: THREE.Vector4) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w
  return new THREE.Vector4(x, y, z, w)
}

function getAttributeData(instances: number, width: number) {
  const offsets: number[] = []
  const orientations: number[] = []
  const stretches: number[] = []
  const halfRootAngleSin: number[] = []
  const halfRootAngleCos: number[] = []

  let q0 = new THREE.Vector4()
  const q1 = new THREE.Vector4()
  const min = -0.25
  const max = 0.25

  for (let i = 0; i < instances; i++) {
    const offsetX = Math.random() * width - width / 2
    const offsetZ = Math.random() * width - width / 2
    const offsetY = getYPosition(offsetX, offsetZ)
    offsets.push(offsetX, offsetY, offsetZ)

    let angle = Math.PI - Math.random() * (2 * Math.PI)
    halfRootAngleSin.push(Math.sin(0.5 * angle))
    halfRootAngleCos.push(Math.cos(0.5 * angle))

    let axis = new THREE.Vector3(0, 1, 0)
    q0.set(axis.x * Math.sin(angle / 2), axis.y * Math.sin(angle / 2), axis.z * Math.sin(angle / 2), Math.cos(angle / 2)).normalize()

    angle = Math.random() * (max - min) + min
    axis = new THREE.Vector3(1, 0, 0)
    q1.set(axis.x * Math.sin(angle / 2), axis.y * Math.sin(angle / 2), axis.z * Math.sin(angle / 2), Math.cos(angle / 2)).normalize()
    q0 = multiplyQuaternions(q0, q1)

    angle = Math.random() * (max - min) + min
    axis = new THREE.Vector3(0, 0, 1)
    q1.set(axis.x * Math.sin(angle / 2), axis.y * Math.sin(angle / 2), axis.z * Math.sin(angle / 2), Math.cos(angle / 2)).normalize()
    q0 = multiplyQuaternions(q0, q1)

    orientations.push(q0.x, q0.y, q0.z, q0.w)

    if (i < instances / 3) stretches.push(Math.random() * 1.8)
    else stretches.push(Math.random())
  }

  return { offsets, orientations, stretches, halfRootAngleCos, halfRootAngleSin }
}

export default function Grass({
  options = { bW: 0.12, bH: 1, joints: 5 },
  width = 100,
  instances = 50000,
  ...props
}: {
  options?: { bW: number; bH: number; joints: number }
  width?: number
  instances?: number
} & React.ComponentProps<'group'>) {
  const { bW, bH, joints } = options
  const materialRef = useRef<any>(null)
  const [texture, alphaMap] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha])
  const attributeData = useMemo(() => getAttributeData(instances, width), [instances, width])
  const baseGeom = useMemo(
    () => new THREE.PlaneGeometry(bW, bH, 1, joints).translate(0, bH / 2, 0),
    [bW, bH, joints],
  )
  const groundGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, width, 32, 32)
    geo.attributes.position.needsUpdate = true
    geo.lookAt(new THREE.Vector3(0, 1, 0))
    const positions = geo.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) positions[i + 1] = getYPosition(positions[i], positions[i + 2])
    geo.computeVertexNormals()
    return geo
  }, [width])
  const boundingSphere = useMemo(() => new THREE.Sphere(new THREE.Vector3(), (Math.sqrt(2) * width) / 2), [width])

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.time.value = state.clock.elapsedTime / 4
  })

  return (
    <group {...props}>
      <mesh>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
          boundingSphere={boundingSphere}
        >
          <instancedBufferAttribute attach="attributes-offset" args={[new Float32Array(attributeData.offsets), 3]} />
          <instancedBufferAttribute attach="attributes-orientation" args={[new Float32Array(attributeData.orientations), 4]} />
          <instancedBufferAttribute attach="attributes-stretch" args={[new Float32Array(attributeData.stretches), 1]} />
          <instancedBufferAttribute attach="attributes-halfRootAngleSin" args={[new Float32Array(attributeData.halfRootAngleSin), 1]} />
          <instancedBufferAttribute attach="attributes-halfRootAngleCos" args={[new Float32Array(attributeData.halfRootAngleCos), 1]} />
        </instancedBufferGeometry>
        {/* @ts-expect-error - grassMaterial extended at runtime */}
        <grassMaterial ref={materialRef} map={texture} alphaMap={alphaMap} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0]} geometry={groundGeo}>
        <meshStandardMaterial color="#000f00" />
      </mesh>
    </group>
  )
}
