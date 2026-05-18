import type { ControlSchema } from './types'

export const globalSchema: ControlSchema = [
  {
    kind: 'slider-optional',
    id: 'fov',
    label: 'FOV (override)',
    default: 30,
    min: 18,
    max: 55,
    step: 0.5,
    enabledDefault: false,
    group: 'Camera',
  },
  {
    kind: 'slider',
    id: 'exposure',
    label: 'Exposure',
    default: 1.0,
    min: 0.3,
    max: 2.0,
    step: 0.01,
    group: 'Tone',
  },
  { kind: 'toggle', id: 'autoRotate', label: 'Auto-rotate', default: false, group: 'Camera' },
  {
    kind: 'slider',
    id: 'autoRotateSpeed',
    label: 'Auto-rotate speed',
    default: 1.0,
    min: 0.2,
    max: 4.0,
    step: 0.1,
    group: 'Camera',
  },
]
