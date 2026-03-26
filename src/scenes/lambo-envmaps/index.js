import { useEffect } from 'react'
import { Suspense } from 'react'
import { Stats } from '@react-three/drei'
import Scene from './Scene'

export default function LamboEnvmaps() {
  useEffect(() => {
    document.body.style.background = '#15151a'
    return () => { document.body.style.background = '' }
  }, [])
  return (
    <Suspense fallback={null}>
      <Scene />
      <Stats />
    </Suspense>
  )
}
