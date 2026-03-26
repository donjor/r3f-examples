import { useEffect } from 'react'
import Scene from './Scene'

export default function PorscheGroundProjection() {
  useEffect(() => {
    document.body.style.background = '#333'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
