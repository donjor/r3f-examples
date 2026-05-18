import type { ComponentType } from 'react'
import type { TemplatePreview } from '../ui/preview'
import type { ControlSchema } from '../controls/types'
import { Porsche } from './Porsche'
import { Lamborghini } from './Lamborghini'
import { Datsun } from './Datsun'

export const GROUND_Y = -1.0

export interface VehicleTemplate {
  id: string
  label: string
  Component: ComponentType<{
    scale?: number | [number, number, number]
    rotation?: [number, number, number]
  }>
  scale: number | [number, number, number]
  rotation: [number, number, number]
  preview: TemplatePreview
  accent: string
  controls?: ControlSchema
}

export const vehicleTemplates: VehicleTemplate[] = [
  {
    id: 'porsche',
    label: 'Porsche 911',
    Component: Porsche,
    scale: 1.6,
    rotation: [0, Math.PI / 5, 0],
    preview: { type: 'model', path: '/911-transformed.glb' },
    accent: '#a78bfa',
    controls: [
      { kind: 'color', id: 'paintColor', label: 'Paint color', default: '#555555', group: 'Paint' },
      { kind: 'slider', id: 'paintRoughness', label: 'Roughness', default: 0.45, min: 0, max: 1, step: 0.01, group: 'Paint' },
      { kind: 'slider', id: 'clearcoat', label: 'Clearcoat', default: 0, min: 0, max: 1, step: 0.01, group: 'Paint' },
      { kind: 'slider', id: 'envMapIntensity', label: 'Env reflection', default: 2, min: 0, max: 4, step: 0.01, group: 'Paint' },
    ],
  },
  {
    id: 'lamborghini',
    label: 'Lamborghini Urus',
    Component: Lamborghini,
    scale: 0.015,
    rotation: [0, Math.PI / 1.5, 0],
    preview: { type: 'model', path: '/lambo.glb' },
    accent: '#f59e0b',
    controls: [
      { kind: 'color', id: 'paintColor', label: 'Paint color', default: '#111111', group: 'Paint' },
      { kind: 'slider', id: 'paintRoughness', label: 'Roughness', default: 0.3, min: 0, max: 1, step: 0.01, group: 'Paint' },
      { kind: 'slider', id: 'clearcoat', label: 'Clearcoat', default: 1, min: 0, max: 1, step: 0.01, group: 'Paint' },
      { kind: 'slider', id: 'envMapIntensity', label: 'Env reflection', default: 0.75, min: 0, max: 3, step: 0.01, group: 'Paint' },
    ],
  },
  {
    id: 'datsun',
    label: 'Datsun 240Z',
    Component: Datsun,
    scale: 0.75,
    rotation: [0, -Math.PI / 5, 0],
    preview: { type: 'model', path: '/datsun-transformed.glb' },
    accent: '#fbbf24',
    controls: [
      { kind: 'color', id: 'paintColor', label: 'Paint color', default: '#ffffff', group: 'Paint' },
      { kind: 'slider', id: 'paintRoughness', label: 'Roughness', default: 0.4, min: 0, max: 1, step: 0.01, group: 'Paint' },
      { kind: 'slider', id: 'envMapIntensity', label: 'Env reflection', default: 1, min: 0, max: 3, step: 0.01, group: 'Paint' },
    ],
  },
]

export const vehicleById = (id: string): VehicleTemplate =>
  vehicleTemplates.find((v) => v.id === id) ?? vehicleTemplates[0]
