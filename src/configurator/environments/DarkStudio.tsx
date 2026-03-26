import type { ReactNode } from 'react'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'

export function DarkStudio({ children }: { children: ReactNode }) {
  return (
    <>
      <color attach="background" args={['#15151a']} />
      <hemisphereLight intensity={0.5} />
      {children}
      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, -1.16, 0]}
        scale={15}
        blur={0.5}
        opacity={1}
        far={20}
      />
      <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <Environment resolution={512}>
        {/* Ceiling strip lights */}
        {[-9, -6, -3, 0, 3, 6, 9].map((z) => (
          <Lightformer
            key={z}
            intensity={2}
            rotation-x={Math.PI / 2}
            position={[0, 4, z]}
            scale={[10, 1, 1]}
          />
        ))}
        {/* Side walls */}
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        {/* Accent ring */}
        <Lightformer
          form="ring"
          color="red"
          intensity={10}
          scale={2}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
    </>
  )
}
