import { useEffect, Suspense } from 'react'
import Scene from './Scene'

export default function LamboEnvmaps() {
  useEffect(() => {
    document.body.style.background = '#15151a'
    return () => { document.body.style.background = '' }
  }, [])
  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  )
}
