import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import type { CameraPreset } from './environments/registry'

interface CameraRigProps {
  preset: CameraPreset
  /** Stable id — when this changes, the camera animates to the preset. */
  envId: string
  /** If set, takes precedence over preset.fov live. null/undefined → use preset. */
  overrideFov?: number | null
}

/**
 * Animates the active camera + the default OrbitControls target to a per-env
 * preset whenever envId changes. First mount snaps instantly; subsequent
 * changes ease over ~600ms. overrideFov (when set) supersedes preset.fov live.
 */
export function CameraRig({ preset, envId, overrideFov }: CameraRigProps) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & { target?: THREE.Vector3; update?: () => void })
    | null

  const lastEnvId = useRef<string | null>(null)
  const anim = useRef<{
    from: THREE.Vector3
    to: THREE.Vector3
    targetFrom: THREE.Vector3
    targetTo: THREE.Vector3
    fovFrom: number
    fovTo: number
    start: number
    duration: number
  } | null>(null)

  const effectiveFov = (presetFov: number) =>
    typeof overrideFov === 'number' ? overrideFov : presetFov

  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera
    const targetVec = new THREE.Vector3(...preset.target)
    const posVec = new THREE.Vector3(...preset.position)
    const targetFov = effectiveFov(preset.fov)

    if (lastEnvId.current === null) {
      persp.position.copy(posVec)
      if (persp.isPerspectiveCamera) {
        persp.fov = targetFov
        persp.updateProjectionMatrix()
      }
      if (controls?.target) {
        controls.target.copy(targetVec)
        controls.update?.()
      } else {
        persp.lookAt(targetVec)
      }
      lastEnvId.current = envId
      anim.current = null
      return
    }

    if (lastEnvId.current === envId) return

    anim.current = {
      from: persp.position.clone(),
      to: posVec,
      targetFrom: controls?.target ? controls.target.clone() : new THREE.Vector3(0, 0, 0),
      targetTo: targetVec,
      fovFrom: persp.isPerspectiveCamera ? persp.fov : targetFov,
      fovTo: targetFov,
      start: performance.now(),
      duration: 600,
    }
    lastEnvId.current = envId

    let raf = 0
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const tick = () => {
      const a = anim.current
      if (!a) return
      const t = Math.min(1, (performance.now() - a.start) / a.duration)
      const k = easeInOut(t)
      persp.position.lerpVectors(a.from, a.to, k)
      if (persp.isPerspectiveCamera) {
        persp.fov = a.fovFrom + (a.fovTo - a.fovFrom) * k
        persp.updateProjectionMatrix()
      }
      if (controls?.target) {
        controls.target.lerpVectors(a.targetFrom, a.targetTo, k)
        controls.update?.()
      } else {
        persp.lookAt(a.targetTo)
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        anim.current = null
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      anim.current = null
    }
  }, [envId, preset, camera, controls])

  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera
    if (!persp.isPerspectiveCamera) return
    const fov = effectiveFov(preset.fov)
    const a = anim.current
    if (a) {
      a.fovTo = fov
    } else {
      persp.fov = fov
      persp.updateProjectionMatrix()
    }
  }, [overrideFov, preset.fov, camera])

  return null
}
