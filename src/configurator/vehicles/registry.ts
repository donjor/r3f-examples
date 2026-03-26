import type { VehicleMeta } from '../types'

export const vehicles: Record<string, VehicleMeta> = {
  'ford-mustang-gt': {
    key: 'ford-mustang-gt',
    name: 'Ford Mustang GT 2025',
    pathTemplate: '/models/ford-mustang-gt/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'ford-mustang-gt-2022': {
    key: 'ford-mustang-gt-2022',
    name: 'Ford Mustang GT 2022',
    pathTemplate: '/models/ford-mustang-gt-2022/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'ford-ranger-sport': {
    key: 'ford-ranger-sport',
    name: 'Ford Ranger Sport 2025',
    pathTemplate: '/models/ford-ranger-sport/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'nissan-navara-gt': {
    key: 'nissan-navara-gt',
    name: 'Nissan Navara GT 2024',
    pathTemplate: '/models/nissan-navara-gt/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'nissan-navara-stx': {
    key: 'nissan-navara-stx',
    name: 'Nissan Navara STX 2024',
    pathTemplate: '/models/nissan-navara-stx/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'toyota-rav4': {
    key: 'toyota-rav4',
    name: 'Toyota RAV4 Hybrid 2021',
    pathTemplate: '/models/toyota-rav4/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'toyota-rav4-prime': {
    key: 'toyota-rav4-prime',
    name: 'Toyota RAV4 Prime 2021',
    pathTemplate: '/models/toyota-rav4-prime/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'toyota-hilux-sr5': {
    key: 'toyota-hilux-sr5',
    name: 'Toyota Hilux SR5 2026',
    pathTemplate: '/models/toyota-hilux-sr5/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
  'toyota-hilux-sr5-no-roll': {
    key: 'toyota-hilux-sr5-no-roll',
    name: 'Toyota Hilux SR5 2026 (No Roll Bar)',
    pathTemplate: '/models/toyota-hilux-sr5-no-roll/model.{tier}.glb',
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
  },
}

export const vehicleKeys = Object.keys(vehicles)
