import * as THREE from 'three'
import { useLayoutEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useConfiguratorStore } from '../store'
import { vehicles } from './registry'
import { GROUND_Y } from '../environments/EnvironmentRenderer'

/** Find the best candidate body/paint material in the model */
function findPaintMaterial(materials: Record<string, THREE.Material>): THREE.MeshStandardMaterial | null {
  const paintNames = ['paint', 'body', 'Body', 'car_body', 'Paint', 'CAR_PAINT', 'carbody']
  for (const name of paintNames) {
    const mat = materials[name]
    if (mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
      return mat as THREE.MeshStandardMaterial
    }
  }

  let best: THREE.MeshStandardMaterial | null = null
  let bestCount = 0
  const counts = new Map<THREE.Material, number>()

  for (const mat of Object.values(materials)) {
    if (!(mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) continue
    const c = (counts.get(mat) ?? 0) + 1
    counts.set(mat, c)
    if (c > bestCount) {
      bestCount = c
      best = mat as THREE.MeshStandardMaterial
    }
  }
  return best
}

export function VehicleModel() {
  const vehicleKey = useConfiguratorStore((s) => s.vehicle)
  const qualityTier = useConfiguratorStore((s) => s.qualityTier)
  const paintColor = useConfiguratorStore((s) => s.paintColor)

  const meta = vehicles[vehicleKey]
  const modelPath = meta
    ? meta.pathTemplate.replace('{tier}', qualityTier)
    : ''

  const { scene, materials } = useGLTF(modelPath)

  const { cloned, paintMat, originalColor, groundOffset } = useMemo(() => {
    const c = scene.clone(true)

    const box = new THREE.Box3().setFromObject(c)
    const offset = -box.min.y

    const srcMat = findPaintMaterial(materials as Record<string, THREE.Material>)
    if (!srcMat) return { cloned: c, paintMat: null, originalColor: null, groundOffset: offset }

    const clonedMat = srcMat.clone()
    const origColor = '#' + srcMat.color.getHexString()

    c.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && mesh.material === srcMat) {
        mesh.material = clonedMat
      }
    })

    return { cloned: c, paintMat: clonedMat, originalColor: origColor, groundOffset: offset }
  }, [scene, materials])

  useLayoutEffect(() => {
    if (!meta) return

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    if (paintMat) {
      if (paintColor) {
        paintMat.color.set(paintColor)
      } else if (originalColor) {
        paintMat.color.set(originalColor)
      }
      paintMat.needsUpdate = true
    }
  }, [cloned, paintColor, meta, paintMat, originalColor])

  if (!meta) return null

  return (
    <group
      position={[
        meta.position[0],
        meta.position[1] + groundOffset * meta.scale + GROUND_Y,
        meta.position[2],
      ]}
    >
      <primitive
        object={cloned}
        scale={meta.scale}
        rotation={meta.rotation}
      />
    </group>
  )
}
