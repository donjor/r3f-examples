import { useEffect } from 'react'
import Scene from './Scene'

export default function EnvTransitions() {
  useEffect(() => {
    document.body.style.background = '#f5f5f5'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
