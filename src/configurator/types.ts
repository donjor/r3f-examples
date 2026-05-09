export type QualityTier = 'high' | 'med' | 'low'

export interface VehicleMeta {
  key: string
  name: string
  /** Path pattern — replace {tier} with quality tier */
  pathTemplate: string
  scale: number
  position: [number, number, number]
  rotation: [number, number, number]
}

/* ── Environment configuration ─────────────────────────── */

export type EnvSource = 'static-lightformers' | 'animated-lightformers' | 'preset'

export interface EnvironmentConfig {
  name: string
  bgColor: string // UI preview swatch color

  // 3D background
  backgroundColor: string
  envSource: EnvSource
  dreiPreset: string
  envBackground: boolean
  envBlur: number

  // Lighting
  ambientIntensity: number
  hemisphereLight: boolean
  hemisphereIntensity: number
  spotLight: boolean
  spotIntensity: number

  // Lightformer features
  accentRing: boolean
  decorativeRings: boolean
  gradientSphere: boolean
  gradientColorBase: string
  gradientColorA: string
  gradientColorB: string

  // Shadows
  shadowBlur: number
  shadowOpacity: number
}

/* ── Effects configuration ─────────────────────────────── */

export interface EffectsConfig {
  bloomEnabled: boolean
  bloomIntensity: number
  bloomThreshold: number
  aoEnabled: boolean
  aoRadius: number
  aoIntensity: number
  vignetteEnabled: boolean
  vignetteOffset: number
  vignetteDarkness: number
  lutEnabled: boolean
}

/* ── drei preset list ──────────────────────────────────── */

export const DREI_PRESETS = [
  'apartment', 'city', 'dawn', 'forest', 'lobby',
  'night', 'park', 'studio', 'sunset', 'warehouse',
] as const
export type DreiPreset = (typeof DREI_PRESETS)[number]
