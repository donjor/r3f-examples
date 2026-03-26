import { create } from 'zustand'
import type { QualityTier } from './types'

interface ConfiguratorState {
  vehicle: string
  environment: string
  qualityTier: QualityTier
  paintColor: string | null
  bloomEnabled: boolean
  bloomIntensity: number
  aoEnabled: boolean
  vignetteEnabled: boolean
  lutEnabled: boolean
  autoRotate: boolean

  setVehicle: (key: string) => void
  setEnvironment: (key: string) => void
  setQualityTier: (tier: QualityTier) => void
  setPaintColor: (color: string | null) => void
  setBloomEnabled: (enabled: boolean) => void
  setBloomIntensity: (intensity: number) => void
  setAoEnabled: (enabled: boolean) => void
  setVignetteEnabled: (enabled: boolean) => void
  setLutEnabled: (enabled: boolean) => void
  setAutoRotate: (enabled: boolean) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  vehicle: 'ford-mustang-gt',
  environment: 'dark-studio',
  qualityTier: 'high',
  paintColor: null,
  bloomEnabled: true,
  bloomIntensity: 1.5,
  aoEnabled: false,
  vignetteEnabled: false,
  lutEnabled: true,
  autoRotate: true,

  setVehicle: (key) => set({ vehicle: key }),
  setEnvironment: (key) => set({ environment: key }),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setPaintColor: (color) => set({ paintColor: color }),
  setBloomEnabled: (enabled) => set({ bloomEnabled: enabled }),
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
  setAoEnabled: (enabled) => set({ aoEnabled: enabled }),
  setVignetteEnabled: (enabled) => set({ vignetteEnabled: enabled }),
  setLutEnabled: (enabled) => set({ lutEnabled: enabled }),
  setAutoRotate: (enabled) => set({ autoRotate: enabled }),
}))
