import { useState } from 'react'
import { useSpring } from '@react-spring/core'
import { a as web } from '@react-spring/web'
import { Scene } from './Scene'

export default function ReactSpringAnimations() {
  const [toggle, set] = useState(0)
  const [{ x }] = useSpring(
    () => ({ x: toggle, config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 } }),
    [toggle],
  )
  return (
    <web.div
      className="absolute inset-0 flex flex-col items-center justify-center font-black uppercase tracking-tighter"
      style={
        {
          backgroundColor: x.to([0, 1], ['#c9ffed', '#ff2558']),
          color: x.to([0, 1], ['#7fffd4', '#c70f46']),
        } as any
      }
    >
      <h1 className="absolute top-10 left-10 text-5xl">{'<h1>'}</h1>
      <h1 className="absolute bottom-10 right-10 text-5xl">{'</h1>'}</h1>
      <web.h1 className="text-[10rem] leading-none">{x.to((v) => (v + 8).toFixed(2)) as any}</web.h1>
      <Scene x={x} set={set} />
    </web.div>
  )
}
