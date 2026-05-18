import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function ColorInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="size-7 rounded-md border border-white/15 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ background: value }}
        aria-label="Pick color"
      />
      {open && (
        <div className="absolute z-10 right-0 mt-2 p-2 rounded-lg bg-black/90 border border-white/10 shadow-2xl">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="mt-2 text-[10px] font-mono text-white/60 text-center select-all">{value}</div>
        </div>
      )}
    </div>
  )
}
