import { ArrowLeft } from 'lucide-react'
import { createRef, useEffect, useState, type RefObject } from 'react'

export const statsHostRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement>()

interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
}

function MemoryReadout() {
  const [mb, setMb] = useState<number | null>(null)
  useEffect(() => {
    const perf = performance as Performance & { memory?: MemoryInfo }
    if (!perf.memory) return
    const tick = () => {
      const used = perf.memory!.usedJSHeapSize / 1048576
      setMb(used)
    }
    tick()
    const id = window.setInterval(tick, 500)
    return () => window.clearInterval(id)
  }, [])
  if (mb == null) return null
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-black/50 backdrop-blur-2xl border border-white/[0.08] text-[12px] font-medium text-white/70 tabular-nums">
      <span className="text-white/40">MEM</span>
      <span>{mb.toFixed(0)}<span className="text-white/40">MB</span></span>
    </div>
  )
}

export function SceneHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed top-4 left-4 z-[1000] flex items-center gap-2 pointer-events-none">
      <button
        onClick={onBack}
        className="pointer-events-auto flex items-center gap-2 pl-3.5 pr-4 h-8 rounded-lg bg-black/50 backdrop-blur-2xl border border-white/[0.08] text-[13px] font-medium text-white/70 hover:bg-black/70 hover:text-white transition-all duration-200"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>
      <div ref={statsHostRef} className="scene-stats-host pointer-events-auto" />
      <MemoryReadout />
    </div>
  )
}
