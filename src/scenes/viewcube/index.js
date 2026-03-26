import { useEffect } from 'react'
import Scene from './Scene'

export default function Viewcube() {
  useEffect(() => {
    document.body.style.background = '#f0f0f0'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
