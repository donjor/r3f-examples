import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

import helloFragmentsModel from './hello-fragments.glb?url'
import helloTextModel from './hello-text.glb?url'

const normalMaterial = new THREE.MeshNormalMaterial()

export function Fragments({ visible, ...props }: { visible: boolean } & Omit<React.ComponentProps<'primitive'>, 'object'>) {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations, materials } = useGLTF(helloFragmentsModel) as unknown as {
    scene: THREE.Group
    animations: THREE.AnimationClip[]
    materials: Record<string, THREE.Material>
  }
  const { actions } = useAnimations(animations, group)
  useMemo(
    () =>
      scene.traverse((o: any) => {
        if (o.type === 'Mesh' && o.material === materials.inner) o.material = normalMaterial
      }),
    [],
  )
  useEffect(() => {
    if (visible)
      Object.keys(actions).forEach((key) => {
        const a = actions[key]
        if (!a) return
        a.repetitions = 0
        a.clampWhenFinished = true
        a.play()
      })
  }, [visible, actions])
  return <primitive {...props} ref={group} object={scene} />
}

export function Model(props: Omit<React.ComponentProps<'primitive'>, 'object'>) {
  const { scene } = useGLTF(helloTextModel) as unknown as { scene: THREE.Group }
  return <primitive object={scene} {...props} />
}

useGLTF.preload(helloFragmentsModel)
useGLTF.preload(helloTextModel)
