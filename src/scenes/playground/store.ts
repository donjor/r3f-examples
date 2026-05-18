import { create } from 'zustand'
import type { ControlValue, ControlValues, Slot } from './controls/types'

export interface PlaygroundControls {
  vehicle: Record<string, ControlValues>
  environment: Record<string, ControlValues>
  effects: Record<string, ControlValues>
  global: ControlValues
}

export interface PlaygroundState {
  vehicleId: string
  environmentId: string
  effectsId: string
  controls: PlaygroundControls
  setVehicle: (id: string) => void
  setEnvironment: (id: string) => void
  setEffects: (id: string) => void
  setControl: (slot: Slot, templateId: string, knobId: string, value: ControlValue) => void
  setGlobal: (knobId: string, value: ControlValue) => void
  resetControls: (slot: Slot, templateId?: string) => void
  resetGlobal: () => void
  resetAll: () => void
}

const emptyControls = (): PlaygroundControls => ({
  vehicle: {},
  environment: {},
  effects: {},
  global: {},
})

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  vehicleId: 'porsche',
  environmentId: 'lambo-studio',
  effectsId: 'none',
  controls: emptyControls(),
  setVehicle: (id) => set({ vehicleId: id }),
  setEnvironment: (id) => set({ environmentId: id }),
  setEffects: (id) => set({ effectsId: id }),
  setControl: (slot, templateId, knobId, value) =>
    set((s) => ({
      controls: {
        ...s.controls,
        [slot]: {
          ...s.controls[slot],
          [templateId]: { ...(s.controls[slot][templateId] ?? {}), [knobId]: value },
        },
      },
    })),
  setGlobal: (knobId, value) =>
    set((s) => ({
      controls: { ...s.controls, global: { ...s.controls.global, [knobId]: value } },
    })),
  resetControls: (slot, templateId) =>
    set((s) => {
      if (!templateId) return { controls: { ...s.controls, [slot]: {} } }
      const next = { ...s.controls[slot] }
      delete next[templateId]
      return { controls: { ...s.controls, [slot]: next } }
    }),
  resetGlobal: () => set((s) => ({ controls: { ...s.controls, global: {} } })),
  resetAll: () => set({ controls: emptyControls() }),
}))
