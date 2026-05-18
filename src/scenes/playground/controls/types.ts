export type ControlValue = number | string | boolean | { value: number; enabled: boolean }

export type Knob =
  | {
      kind: 'slider'
      id: string
      label: string
      default: number
      min: number
      max: number
      step?: number
      group?: string
    }
  | {
      kind: 'slider-optional'
      id: string
      label: string
      default: number
      min: number
      max: number
      step?: number
      enabledDefault?: boolean
      group?: string
    }
  | { kind: 'color'; id: string; label: string; default: string; group?: string }
  | { kind: 'toggle'; id: string; label: string; default: boolean; group?: string }
  | {
      kind: 'select'
      id: string
      label: string
      default: string
      options: { value: string; label: string }[]
      group?: string
    }

export type ControlSchema = readonly Knob[]

export type ControlValues = Record<string, ControlValue>

export type Slot = 'vehicle' | 'environment' | 'effects'
