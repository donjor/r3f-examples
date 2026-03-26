import type { EnvironmentPreset } from '../types'

export const presets: Record<string, EnvironmentPreset> = {
  'dark-studio': {
    key: 'dark-studio',
    name: 'Dark Studio',
    description: 'Dramatic ceiling Lightformers with accent ring',
    bgColor: '#15151a',
    groundY: -1.16,
  },
  'animated-studio': {
    key: 'animated-studio',
    name: 'Animated Studio',
    description: 'Moving Lightformers with gradient background',
    bgColor: '#000000',
    groundY: -1.16,
  },
  'sunset-studio': {
    key: 'sunset-studio',
    name: 'Sunset',
    description: 'Sunset preset with soft blurred background',
    bgColor: '#c27d4e',
    groundY: -0.65,
  },
  'bright-studio': {
    key: 'bright-studio',
    name: 'Bright Studio',
    description: 'Bright white backdrop with city reflections',
    bgColor: '#f5f5f5',
    groundY: -0.5,
  },
}

export const presetKeys = Object.keys(presets)
