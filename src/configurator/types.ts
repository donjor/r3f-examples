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

export interface EnvironmentPreset {
  key: string
  name: string
  description: string
  bgColor: string
  /** Y position of the ground/shadow plane */
  groundY: number
}
