import { motion, AnimatePresence } from 'framer-motion'
import { AiFillCamera, AiOutlineArrowLeft, AiOutlineHighlight, AiOutlineShopping } from 'react-icons/ai'
import { useSnapshot } from 'valtio'
import { state } from './store'

export function Overlay() {
  const snap = useSnapshot(state)
  const transition = { type: 'spring' as const, duration: 0.8 }
  const config = {
    initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
    animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
    exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } },
  }
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.header
        className="pointer-events-auto fixed top-0 inset-x-0 flex items-center justify-between px-10 py-6 z-50"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <div className="text-2xl font-black">PMND.RS</div>
        <motion.div animate={{ x: snap.intro ? 0 : 100, opacity: snap.intro ? 1 : 0 }} transition={transition}>
          <AiOutlineShopping size="3em" />
        </motion.div>
      </motion.header>
      <AnimatePresence>
        {snap.intro ? (
          <motion.section key="main" className="pointer-events-auto fixed inset-0 flex items-center" {...config}>
            <div className="px-10 max-w-xl">
              <motion.div
                key="title"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 5, stiffness: 40, restDelta: 0.001, duration: 0.3 }}
              >
                <h1 className="text-5xl font-black mb-4">LET'S DO IT.</h1>
              </motion.div>
              <motion.div
                key="p"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 7,
                  stiffness: 30,
                  restDelta: 0.001,
                  duration: 0.6,
                  delay: 0.2,
                  delayChildren: 0.2,
                }}
              >
                <p className="text-base leading-relaxed mb-6">
                  Create your unique and exclusive shirt with our brand-new 3D customization tool.{' '}
                  <strong>Unleash your imagination</strong> and define your own style.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white"
                  style={{ background: snap.color }}
                  onClick={() => (state.intro = false)}
                >
                  CUSTOMIZE IT <AiOutlineHighlight size="1.3em" />
                </button>
              </motion.div>
            </div>
          </motion.section>
        ) : (
          <motion.section key="custom" {...config}>
            <Customizer />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

function Customizer() {
  const snap = useSnapshot(state)
  return (
    <div className="pointer-events-auto fixed bottom-10 inset-x-0 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {snap.colors.map((color) => (
          <div
            key={color}
            className="size-9 rounded-full cursor-pointer border-2 border-white"
            style={{ background: color }}
            onClick={() => (state.color = color)}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {snap.decals.map((decal) => (
          <div
            key={decal.full}
            className="size-12 rounded-md cursor-pointer overflow-hidden bg-white/70"
            onClick={() => (state.decal = decal.full)}
          >
            <img src={decal.thumb} alt="brand" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-semibold"
          style={{ background: snap.color }}
          onClick={() => {
            const link = document.createElement('a')
            link.setAttribute('download', 'canvas.png')
            const canvas = document.querySelector('canvas')
            if (canvas) {
              link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
              link.click()
            }
          }}
        >
          DOWNLOAD
          <AiFillCamera size="1.3em" />
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-semibold"
          style={{ background: snap.color }}
          onClick={() => (state.intro = true)}
        >
          GO BACK
          <AiOutlineArrowLeft size="1.3em" />
        </button>
      </div>
    </div>
  )
}
