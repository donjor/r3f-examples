import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Clouds, Cloud, Sky as SkyImpl, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function CloudsSky() {
  const c = useResolvedControls('environment', 'clouds-sky')
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  const sunInclination = c.sunInclination as number
  const sunAzimuth = c.sunAzimuth as number

  const group = useRef<THREE.Group>(null!)
  const cloud0 = useRef<any>(null!)
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.cos(state.clock.elapsedTime / 4) / 4
      group.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) / 4
    }
    if (cloud0.current) cloud0.current.rotation.y -= delta * 0.5
  })
  return (
    <>
      <SkyImpl inclination={sunInclination} azimuth={sunAzimuth} />
      <ambientLight intensity={1.0} />
      <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={30} />
      <spotLight position={[-20, 10, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={6} />
      <spotLight position={[20, 5, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={4} />
      <group ref={group} position={[0, 6, -8]}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud ref={cloud0} seed={1} segments={20} volume={5} opacity={0.7} fade={10} growth={4} speed={0.1} bounds={[6, 1, 1] as any} color="white" />
          <Cloud seed={2} segments={20} volume={4} opacity={0.6} fade={10} growth={4} speed={0.1} bounds={[6, 1, 1] as any} color="#eed0d0" position={[12, 0, 0]} />
          <Cloud seed={3} segments={20} volume={4} opacity={0.6} fade={10} growth={4} speed={0.1} bounds={[6, 1, 1] as any} color="#d0e0d0" position={[-12, 0, 0]} />
        </Clouds>
      </group>
      <ContactShadows position={[0, -1, 0]} opacity={shadowOpacity} scale={20} blur={shadowBlur} far={6} />
    </>
  )
}
