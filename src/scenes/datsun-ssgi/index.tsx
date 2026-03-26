import { useEffect } from 'react'
import Scene from './Scene'

export default function DatsunSsgi() {
  useEffect(() => {
    document.body.style.background = '#b78135'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
