import { StatsGl } from '@react-three/drei'
import type { RefObject } from 'react'
import { statsHostRef } from './scene-header'

export function SceneStats() {
  return (
    <StatsGl
      trackGPU
      logsPerSecond={4}
      samplesLog={40}
      samplesGraph={10}
      parent={statsHostRef as RefObject<HTMLElement>}
      className="scene-stats-panel"
    />
  )
}
