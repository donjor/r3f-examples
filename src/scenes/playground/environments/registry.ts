import type { ComponentType } from 'react'
import type { TemplatePreview } from '../ui/preview'
import type { ControlSchema } from '../controls/types'
import { LamboStudio } from './LamboStudio'
import { PorscheShowcase } from './PorscheShowcase'
import { PorscheLive } from './PorscheLive'
import { DatsunDawn } from './DatsunDawn'
import { GroundProjection } from './GroundProjection'
import { NightTrain } from './NightTrain'
import { ImageGalleryFloor } from './ImageGalleryFloor'
import { CitySoft } from './CitySoft'
import { ShoppingSky } from './ShoppingSky'
import { CloudsSky } from './CloudsSky'
import { StudioPreset } from './StudioPreset'
import { WarehousePreset } from './WarehousePreset'
import { SunsetPreset } from './SunsetPreset'
import { ForestPreset } from './ForestPreset'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

export interface EnvironmentTemplate {
  id: string
  label: string
  source: string
  Component: ComponentType
  camera: CameraPreset
  preview: TemplatePreview
  accent: string
  controls?: ControlSchema
}

const DEFAULT_CAMERA: CameraPreset = { position: [5, 1.5, 12], target: [0, 0, 0], fov: 30 }

const envIntensity: ControlSchema = [
  { kind: 'slider', id: 'envIntensity', label: 'Env intensity', default: 1, min: 0, max: 2, step: 0.01, group: 'Lighting' },
]
const shadowSliders: ControlSchema = [
  { kind: 'slider', id: 'shadowOpacity', label: 'Shadow opacity', default: 0.6, min: 0, max: 1, step: 0.01, group: 'Shadows' },
  { kind: 'slider', id: 'shadowBlur', label: 'Shadow blur', default: 1.5, min: 0, max: 4, step: 0.05, group: 'Shadows' },
]

export const environmentTemplates: EnvironmentTemplate[] = [
  {
    id: 'lambo-studio',
    label: 'Lambo Studio',
    source: 'lambo-envmaps',
    Component: LamboStudio,
    camera: { position: [0, 0, 15], target: [0, 0, 0], fov: 25 },
    preview: { type: 'model', path: '/lambo.glb' },
    accent: '#f59e0b',
    controls: [
      { kind: 'slider', id: 'envIntensity', label: 'Env intensity', default: 1, min: 0, max: 2, step: 0.01, group: 'Lighting' },
      { kind: 'slider', id: 'lightformerIntensity', label: 'Lightformer intensity', default: 2, min: 0, max: 4, step: 0.05, group: 'Lighting' },
      { kind: 'color', id: 'accentColor', label: 'Accent ring color', default: '#ff0000', group: 'Lighting' },
      { kind: 'slider', id: 'shadowOpacity', label: 'Shadow opacity', default: 1, min: 0, max: 1, step: 0.01, group: 'Shadows' },
      { kind: 'slider', id: 'shadowBlur', label: 'Shadow blur', default: 0.5, min: 0, max: 4, step: 0.05, group: 'Shadows' },
    ],
  },
  {
    id: 'porsche-showcase',
    label: 'Porsche Showcase',
    source: 'porsche-showcase',
    Component: PorscheShowcase,
    camera: { position: [5, 0, 15], target: [0, 0, 0], fov: 30 },
    preview: { type: 'model', path: '/911-transformed.glb' },
    accent: '#a78bfa',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'lightformerIntensity', label: 'Lightformer intensity', default: 1, min: 0, max: 4, step: 0.05, group: 'Lighting' },
      { kind: 'color', id: 'accentColor', label: 'Accent ring color', default: '#ff0000', group: 'Lighting' },
      { kind: 'color', id: 'bgColor', label: 'Background tint', default: '#444444', group: 'Background' },
    ],
  },
  {
    id: 'porsche-live',
    label: 'Porsche Live Envmaps',
    source: 'porsche-live-envmaps',
    Component: PorscheLive,
    camera: { position: [5, 0, 15], target: [0, 0, 0], fov: 30 },
    preview: { type: 'model', path: '/911-transformed.glb' },
    accent: '#818cf8',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'lightformerIntensity', label: 'Lightformer intensity', default: 1, min: 0, max: 4, step: 0.05, group: 'Lighting' },
      { kind: 'color', id: 'accentColor', label: 'Accent ring color', default: '#ff0000', group: 'Lighting' },
      { kind: 'color', id: 'bgColor', label: 'Background tint', default: '#444444', group: 'Background' },
    ],
  },
  {
    id: 'datsun-dawn',
    label: 'Datsun Dawn',
    source: 'datsun-ssgi',
    Component: DatsunDawn,
    camera: { position: [4, 1, 6], target: [0, 0, 0], fov: 35 },
    preview: { type: 'model', path: '/datsun-transformed.glb' },
    accent: '#fbbf24',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'shadowOpacity', label: 'Shadow opacity', default: 0.9, min: 0, max: 1, step: 0.01, group: 'Shadows' },
      { kind: 'slider', id: 'fogNear', label: 'Fog near', default: 200, min: 1, max: 200, step: 0.5, group: 'Fog' },
      { kind: 'slider', id: 'fogFar', label: 'Fog far', default: 300, min: 5, max: 300, step: 0.5, group: 'Fog' },
    ],
  },
  {
    id: 'ground-projection',
    label: 'HDRI Ground Projection',
    source: 'porsche-ground-projection',
    Component: GroundProjection,
    camera: { position: [8, 3, 12], target: [0, 0, 0], fov: 35 },
    preview: { type: 'model', path: '/porsche-transformed.glb' },
    accent: '#34d399',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'groundRadius', label: 'Ground radius', default: 60, min: 30, max: 250, step: 1, group: 'HDRI Ground' },
      { kind: 'slider', id: 'groundHeight', label: 'Ground height', default: 5, min: 0, max: 50, step: 0.5, group: 'HDRI Ground' },
      ...shadowSliders,
    ],
  },
  {
    id: 'night-train',
    label: 'Night Fog + Reflector',
    source: 'night-train',
    Component: NightTrain,
    camera: { position: [-10, 6, 12], target: [0, 0, 0], fov: 35 },
    preview: { type: 'image', path: '/thumbs/night-train.webp' },
    accent: '#94a3b8',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'fogNear', label: 'Fog near', default: 30, min: 1, max: 60, step: 0.5, group: 'Fog' },
      { kind: 'slider', id: 'fogFar', label: 'Fog far', default: 60, min: 10, max: 120, step: 0.5, group: 'Fog' },
      { kind: 'slider', id: 'reflectorMixStrength', label: 'Reflector strength', default: 15, min: 0, max: 30, step: 0.1, group: 'Reflector' },
    ],
  },
  {
    id: 'image-gallery',
    label: 'Gallery Reflector',
    source: 'image-gallery',
    Component: ImageGalleryFloor,
    camera: { position: [4, 1.5, 8], target: [0, 0, 0], fov: 35 },
    preview: { type: 'image', path: '/thumbs/image-gallery.webp' },
    accent: '#fb7185',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'reflectorMixStrength', label: 'Reflector strength', default: 40, min: 0, max: 80, step: 0.1, group: 'Reflector' },
    ],
  },
  {
    id: 'city-soft',
    label: 'City Soft',
    source: 'floating-laptop',
    Component: CitySoft,
    camera: { position: [0, 2, 9], target: [0, 0, 0], fov: 30 },
    preview: { type: 'image', path: '/thumbs/floating-laptop.webp' },
    accent: '#d25578',
    controls: [...envIntensity, ...shadowSliders],
  },
  {
    id: 'shopping-sky',
    label: 'Daylight Sky',
    source: 'shopping',
    Component: ShoppingSky,
    camera: { position: [6, 3, 10], target: [0, 0, 0], fov: 35 },
    preview: { type: 'image', path: '/thumbs/shopping.webp' },
    accent: '#fbbf24',
    controls: [
      { kind: 'slider', id: 'sunInclination', label: 'Sun inclination', default: 0.6, min: 0, max: 1, step: 0.01, group: 'Sky' },
      { kind: 'slider', id: 'sunAzimuth', label: 'Sun azimuth', default: 0.25, min: 0, max: 1, step: 0.01, group: 'Sky' },
      ...shadowSliders,
    ],
  },
  {
    id: 'clouds-sky',
    label: 'Clouds + Sky',
    source: 'clouds',
    Component: CloudsSky,
    camera: { position: [0, 2, 18], target: [0, 0, 0], fov: 45 },
    preview: { type: 'image', path: '/thumbs/clouds.webp' },
    accent: '#e2e8f0',
    controls: [
      { kind: 'slider', id: 'sunInclination', label: 'Sun inclination', default: 0.6, min: 0, max: 1, step: 0.01, group: 'Sky' },
      { kind: 'slider', id: 'sunAzimuth', label: 'Sun azimuth', default: 0.25, min: 0, max: 1, step: 0.01, group: 'Sky' },
      ...shadowSliders,
    ],
  },
  {
    id: 'studio-preset',
    label: 'Studio',
    source: 'drei',
    Component: StudioPreset,
    camera: DEFAULT_CAMERA,
    preview: { type: 'swatch', label: 'Studio', gradient: 'linear-gradient(180deg, #555 0%, #1a1a1a 100%)' },
    accent: '#cbd5e1',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'shadowOpacity', label: 'Shadow opacity', default: 0.85, min: 0, max: 1, step: 0.01, group: 'Shadows' },
    ],
  },
  {
    id: 'warehouse-preset',
    label: 'Warehouse',
    source: 'drei',
    Component: WarehousePreset,
    camera: DEFAULT_CAMERA,
    preview: { type: 'swatch', label: 'Warehouse', gradient: 'linear-gradient(180deg, #7d6b50 0%, #2a2418 100%)' },
    accent: '#fbbf24',
    controls: [
      ...envIntensity,
      { kind: 'slider', id: 'shadowOpacity', label: 'Shadow opacity', default: 0.85, min: 0, max: 1, step: 0.01, group: 'Shadows' },
    ],
  },
  {
    id: 'sunset-preset',
    label: 'Sunset',
    source: 'drei',
    Component: SunsetPreset,
    camera: DEFAULT_CAMERA,
    preview: { type: 'swatch', label: 'Sunset', gradient: 'linear-gradient(180deg, #ff8a4d 0%, #5b1f3d 100%)' },
    accent: '#fb7185',
    controls: [...envIntensity, ...shadowSliders],
  },
  {
    id: 'forest-preset',
    label: 'Forest',
    source: 'drei',
    Component: ForestPreset,
    camera: DEFAULT_CAMERA,
    preview: { type: 'swatch', label: 'Forest', gradient: 'linear-gradient(180deg, #4d8a3c 0%, #1a2e18 100%)' },
    accent: '#86efac',
    controls: [...envIntensity, ...shadowSliders],
  },
]

export const environmentById = (id: string): EnvironmentTemplate =>
  environmentTemplates.find((e) => e.id === id) ?? environmentTemplates[0]
