import { create } from 'zustand'
import type { QualityTier, EnvironmentConfig, EffectsConfig } from './types'
import { presets, DEFAULT_EFFECTS } from './environments/presets'

interface ConfiguratorState {
  // Vehicle
  vehicle: string
  qualityTier: QualityTier
  paintColor: string | null

  // Environment
  activePreset: string
  envConfig: EnvironmentConfig

  // Effects
  effects: EffectsConfig

  // Camera
  autoRotate: boolean

  // Actions
  setVehicle: (key: string) => void
  setQualityTier: (tier: QualityTier) => void
  setPaintColor: (color: string | null) => void
  loadPreset: (key: string) => void
  updateEnv: (partial: Partial<EnvironmentConfig>) => void
  updateEffects: (partial: Partial<EffectsConfig>) => void
  setAutoRotate: (enabled: boolean) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  vehicle: 'ford-mustang-gt',
  qualityTier: 'high',
  paintColor: null,

  activePreset: 'dark-studio',
  envConfig: { ...presets['dark-studio'] },

  effects: { ...DEFAULT_EFFECTS },

  autoRotate: true,

  setVehicle: (key) => set({ vehicle: key }),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setPaintColor: (color) => set({ paintColor: color }),

  loadPreset: (key) => {
    const preset = presets[key]
    if (preset) set({ activePreset: key, envConfig: { ...preset } })
  },

  updateEnv: (partial) =>
    set((s) => ({ envConfig: { ...s.envConfig, ...partial } })),

  updateEffects: (partial) =>
    set((s) => ({ effects: { ...s.effects, ...partial } })),

  setAutoRotate: (enabled) => set({ autoRotate: enabled }),
}))
