import { useEffect, Suspense } from 'react'
import { ConfiguratorScene } from './ConfiguratorScene'

export default function Configurator() {
  useEffect(() => {
    document.body.style.background = 'oklch(0.12 0.005 260)'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-lg text-muted-foreground">Loading configurator...</div>}>
      <ConfiguratorScene />
    </Suspense>
  )
}
