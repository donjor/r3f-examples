import type { ComponentType } from 'react'
import type { TemplatePreview } from '../ui/preview'
import type { ControlSchema } from '../controls/types'
import { LamboBloomLut } from './LamboBloomLut'
import { DatsunN8AO } from './DatsunN8AO'
import { ShoppingTilt } from './ShoppingTilt'
import { MotionPathCinema } from './MotionPathCinema'
import { DiamondBloom } from './DiamondBloom'
import { SoftTiltBloom } from './SoftTiltBloom'
import { ColorGrading } from './ColorGrading'
import { LusionN8AO } from './LusionN8AO'

export interface EffectsTemplate {
  id: string
  label: string
  source: string | null
  Component: ComponentType | null
  preview: TemplatePreview
  accent: string
  controls?: ControlSchema
}

export const effectsTemplates: EffectsTemplate[] = [
  {
    id: 'none',
    label: 'None',
    source: null,
    Component: null,
    preview: { type: 'swatch', label: 'OFF' },
    accent: '#64748b',
  },
  {
    id: 'lambo-bloom-lut',
    label: 'Bloom + LUT',
    source: 'lambo-envmaps',
    Component: LamboBloomLut,
    preview: { type: 'model', path: '/lambo.glb' },
    accent: '#f59e0b',
    controls: [
      { kind: 'slider', id: 'bloomIntensity', label: 'Bloom intensity', default: 1.75, min: 0, max: 4, step: 0.01, group: 'Bloom' },
      { kind: 'slider', id: 'bloomThreshold', label: 'Bloom threshold', default: 0.2, min: 0, max: 1, step: 0.01, group: 'Bloom' },
    ],
  },
  {
    id: 'datsun-n8ao',
    label: 'N8AO + Bloom',
    source: 'datsun-ssgi',
    Component: DatsunN8AO,
    preview: { type: 'model', path: '/datsun-transformed.glb' },
    accent: '#fbbf24',
    controls: [
      { kind: 'slider', id: 'aoRadius', label: 'AO radius', default: 0.5, min: 0.1, max: 3, step: 0.01, group: 'N8AO' },
      { kind: 'slider', id: 'aoIntensity', label: 'AO intensity', default: 2, min: 0, max: 4, step: 0.01, group: 'N8AO' },
      { kind: 'slider', id: 'bloomIntensity', label: 'Bloom intensity', default: 0.5, min: 0, max: 4, step: 0.01, group: 'Bloom' },
    ],
  },
  {
    id: 'shopping-tilt',
    label: 'N8AO + TiltShift',
    source: 'shopping',
    Component: ShoppingTilt,
    preview: { type: 'image', path: '/thumbs/shopping.webp' },
    accent: '#f472b6',
    controls: [
      { kind: 'slider', id: 'aoRadius', label: 'AO radius', default: 0.5, min: 0.1, max: 3, step: 0.01, group: 'N8AO' },
      { kind: 'slider', id: 'aoIntensity', label: 'AO intensity', default: 2, min: 0, max: 4, step: 0.01, group: 'N8AO' },
      { kind: 'slider', id: 'tiltBlur', label: 'Tilt blur', default: 0.25, min: 0, max: 3, step: 0.01, group: 'Tilt' },
    ],
  },
  {
    id: 'motionpath-cinema',
    label: 'DotScreen + HueSat + Tilt',
    source: 'motionpathcontrols',
    Component: MotionPathCinema,
    preview: { type: 'image', path: '/thumbs/motionpathcontrols.webp' },
    accent: '#fb923c',
    controls: [
      { kind: 'slider', id: 'dotScreenScale', label: 'Dot scale', default: 1.5, min: 0.2, max: 3, step: 0.01, group: 'Dot screen' },
      { kind: 'slider', id: 'hue', label: 'Hue', default: 0, min: -Math.PI, max: Math.PI, step: 0.01, group: 'Color' },
      { kind: 'slider', id: 'saturation', label: 'Saturation', default: -0.2, min: -1, max: 1, step: 0.01, group: 'Color' },
      { kind: 'slider', id: 'tiltBlur', label: 'Tilt blur', default: 0.25, min: 0, max: 3, step: 0.01, group: 'Tilt' },
    ],
  },
  {
    id: 'diamond-bloom',
    label: 'Cinematic Bloom',
    source: 'diamond-refraction',
    Component: DiamondBloom,
    preview: { type: 'image', path: '/thumbs/diamond-refraction.webp' },
    accent: '#a5f3fc',
    controls: [
      { kind: 'slider', id: 'bloomIntensity', label: 'Bloom intensity', default: 2, min: 0, max: 4, step: 0.01, group: 'Bloom' },
      { kind: 'slider', id: 'bloomThreshold', label: 'Bloom threshold', default: 1, min: 0, max: 1, step: 0.01, group: 'Bloom' },
    ],
  },
  {
    id: 'soft-tilt-bloom',
    label: 'Soft Tilt + Bloom',
    source: 'gltf-animations-tied-to-scroll',
    Component: SoftTiltBloom,
    preview: { type: 'image', path: '/thumbs/gltf-animations-tied-to-scroll.webp' },
    accent: '#10b981',
    controls: [
      { kind: 'slider', id: 'bloomIntensity', label: 'Bloom intensity', default: 0.4, min: 0, max: 4, step: 0.01, group: 'Bloom' },
      { kind: 'slider', id: 'tiltBlur', label: 'Tilt blur', default: 0.3, min: 0, max: 3, step: 0.01, group: 'Tilt' },
    ],
  },
  {
    id: 'color-grading',
    label: 'LUT (Cubicle-99)',
    source: 'color-grading',
    Component: ColorGrading,
    preview: { type: 'image', path: '/thumbs/color-grading.webp' },
    accent: '#fde047',
  },
  {
    id: 'lusion-n8ao',
    label: 'Heavy N8AO',
    source: 'lusion-connectors',
    Component: LusionN8AO,
    preview: { type: 'image', path: '/thumbs/lusion-connectors.webp' },
    accent: '#4060ff',
    controls: [
      { kind: 'slider', id: 'aoRadius', label: 'AO radius', default: 1, min: 0.1, max: 6, step: 0.01, group: 'N8AO' },
      { kind: 'slider', id: 'aoIntensity', label: 'AO intensity', default: 4, min: 0, max: 8, step: 0.01, group: 'N8AO' },
    ],
  },
]

export const effectsById = (id: string): EffectsTemplate =>
  effectsTemplates.find((e) => e.id === id) ?? effectsTemplates[0]
