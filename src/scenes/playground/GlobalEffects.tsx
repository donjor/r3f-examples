import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useResolvedGlobal } from './controls/resolve'

/** Bridges global controls (exposure, autoRotate) to renderer + OrbitControls. */
export function GlobalEffects() {
  const c = useResolvedGlobal()
  const exposure = c.exposure as number
  const autoRotate = c.autoRotate as boolean
  const autoRotateSpeed = c.autoRotateSpeed as number

  const gl = useThree((s) => s.gl)
  const controls = useThree((s) => s.controls) as
    | { autoRotate?: boolean; autoRotateSpeed?: number }
    | null

  useEffect(() => {
    gl.toneMappingExposure = exposure
  }, [gl, exposure])

  useEffect(() => {
    if (!controls) return
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = autoRotateSpeed
  }, [controls, autoRotate, autoRotateSpeed])

  return null
}
