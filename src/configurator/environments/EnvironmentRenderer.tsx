import type { ReactNode } from 'react'
import { useConfiguratorStore } from '../store'
import { DarkStudio } from './DarkStudio'
import { AnimatedStudio } from './AnimatedStudio'
import { SunsetStudio } from './SunsetStudio'
import { BrightStudio } from './BrightStudio'

const envComponents: Record<string, React.ComponentType<{ children: ReactNode }>> = {
  'dark-studio': DarkStudio,
  'animated-studio': AnimatedStudio,
  'sunset-studio': SunsetStudio,
  'bright-studio': BrightStudio,
}

export function EnvironmentRenderer({ children }: { children: ReactNode }) {
  const environment = useConfiguratorStore((s) => s.environment)
  const Env = envComponents[environment] ?? DarkStudio
  return <Env>{children}</Env>
}
