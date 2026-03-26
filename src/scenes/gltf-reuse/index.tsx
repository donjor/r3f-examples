import { useEffect } from 'react'
import Scene from './Scene'

export default function GltfReuse() {
  useEffect(() => {
    document.body.style.background = 'white'
    return () => { document.body.style.background = '' }
  }, [])
  return <Scene />
}
