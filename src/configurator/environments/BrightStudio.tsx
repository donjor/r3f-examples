import type { ReactNode } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'

/** Faithful to scenes/gltf-reuse: white background, bright ambient, city reflections */
export function BrightStudio({ children }: { children: ReactNode }) {
  return (
    <>
      <color attach="background" args={['#f5f5f5']} />
      <ambientLight intensity={Math.PI} />
      {children}
      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, -0.5, 0]}
        scale={15}
        blur={1.5}
        opacity={0.9}
        far={20}
      />
      <Environment preset="city" />
    </>
  )
}
