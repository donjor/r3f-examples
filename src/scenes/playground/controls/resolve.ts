import { useMemo } from 'react'
import { usePlaygroundStore } from '../store'
import { vehicleById } from '../vehicles/registry'
import { environmentById } from '../environments/registry'
import { effectsById } from '../effects/registry'
import { globalSchema } from './global'
import type { ControlSchema, ControlValues, Slot } from './types'

/** Merge per-template overrides over schema defaults. Missing keys fill from defaults. */
export function resolveValues(schema: ControlSchema, overrides: ControlValues | undefined): ControlValues {
  const out: ControlValues = {}
  for (const knob of schema) {
    if (knob.kind === 'slider-optional') {
      const override = overrides?.[knob.id]
      if (override && typeof override === 'object' && 'value' in override) {
        out[knob.id] = override
      } else {
        out[knob.id] = { value: knob.default, enabled: knob.enabledDefault ?? false }
      }
    } else {
      out[knob.id] = overrides?.[knob.id] ?? knob.default
    }
  }
  return out
}

function schemaForSlot(slot: Slot, id: string): ControlSchema {
  if (slot === 'vehicle') return vehicleById(id).controls ?? []
  if (slot === 'environment') return environmentById(id).controls ?? []
  return effectsById(id).controls ?? []
}

/** Resolve the active per-template controls for a slot, reactive to store changes. */
export function useResolvedControls(slot: Slot, id: string): ControlValues {
  const overrides = usePlaygroundStore((s) => s.controls[slot][id])
  return useMemo(() => resolveValues(schemaForSlot(slot, id), overrides), [slot, id, overrides])
}

/** Resolve global controls. */
export function useResolvedGlobal(): ControlValues {
  const overrides = usePlaygroundStore((s) => s.controls.global)
  return useMemo(() => resolveValues(globalSchema, overrides), [overrides])
}
