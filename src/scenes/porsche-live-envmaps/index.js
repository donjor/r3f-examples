import { useEffect } from 'react'
import Scene from './Scene'

export default function PorscheLiveEnvmaps() {
  useEffect(() => {
    document.body.style.background = 'black'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
