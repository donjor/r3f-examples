import { Children, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useStore } from './store'

const container = {
  hidden: { opacity: 0, height: 0, transition: { staggerChildren: 0.05 } },
  show: {
    opacity: 1,
    height: 'auto' as const,
    transition: { when: 'beforeChildren' as const, staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: '100%' },
  show: { opacity: 1, y: 0 },
}

function List({ children, open }: { children: ReactNode; open: boolean }) {
  return (
    <motion.ul variants={container} initial="hidden" animate={open ? 'show' : 'hidden'} className="m-0 p-0 list-none overflow-hidden">
      {Children.map(children, (child) => (
        <li className="overflow-hidden">
          <motion.div variants={item}>{child}</motion.div>
        </li>
      ))}
    </motion.ul>
  )
}

export function Overlay() {
  const state = useStore()
  return (
    <div className="pointer-events-none fixed inset-0 text-black">
      <a href="https://pmnd.rs/" className="pointer-events-auto absolute bottom-10 left-10 text-[13px] leading-tight">
        PMND.RS
        <br />
        DEV COLLECTIVE
      </a>
      <div className="absolute bottom-10 right-10 text-[13px]">02/02/2023</div>
      <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-md">
        <h1 className="text-[120px] leading-none font-black tracking-tighter">36</h1>
        <List open={state.open}>
          <h3 className="text-3xl font-black tracking-tight">NIKE AIR</h3>
          <h3 className="text-3xl font-black tracking-tight">“ZOOM”</h3>
          <h3 className="text-3xl font-black tracking-tight">
            <span className="text-orange-500">PEGASUS</span>
          </h3>
          <h4 className="text-base font-semibold mt-2">Running Shoes</h4>
          <p className="text-base font-semibold mt-1">$98.97</p>
          <p className="text-[13px] mt-3 leading-relaxed max-w-sm">
            Year after year Pegasus has proven itself on the feet of runners everywhere. Now our most trusted style returns with new
            innovations that make it more itself than ever. Meet the reliable, comfortable, always ready-to-run Nike Air Zoom Pegasus.
          </p>
        </List>
      </div>
    </div>
  )
}
