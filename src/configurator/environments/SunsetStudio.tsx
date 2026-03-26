import type { ReactNode } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'

/** Faithful to scenes/env-transitions: sunset preset with blurred background */
export function SunsetStudio({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, -0.65, 0]}
        scale={15}
        blur={1.5}
        opacity={0.7}
        far={20}
      />
      <Environment preset="sunset" background blur={0.65} />
    </>
  )
}
