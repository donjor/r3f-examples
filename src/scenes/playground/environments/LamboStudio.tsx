import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import { useResolvedControls } from '../controls/resolve'

export function LamboStudio() {
  const c = useResolvedControls('environment', 'lambo-studio')
  const envIntensity = c.envIntensity as number
  const shadowOpacity = c.shadowOpacity as number
  const shadowBlur = c.shadowBlur as number
  const lightformerIntensity = c.lightformerIntensity as number
  const accentColor = c.accentColor as string

  return (
    <>
      <color attach="background" args={['#15151a']} />
      <hemisphereLight intensity={0.5} />
      <ContactShadows
        resolution={1024}
        frames={10}
        position={[0, -1.0, 0]}
        scale={15}
        blur={shadowBlur}
        opacity={shadowOpacity}
        far={20}
      />
      <mesh scale={4} position={[3, -1.001, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.001, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <Environment resolution={512} environmentIntensity={envIntensity}>
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={lightformerIntensity} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer form="ring" color={accentColor} intensity={10 * (lightformerIntensity / 2)} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
    </>
  )
}
