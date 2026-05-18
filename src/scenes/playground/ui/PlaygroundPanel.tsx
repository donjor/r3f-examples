import { useState, useRef, useEffect, useMemo, type ComponentType } from 'react'
import { ChevronUp, Car, Mountain, Wand2, Check } from 'lucide-react'
import { usePlaygroundStore } from '../store'
import { vehicleTemplates } from '../vehicles/registry'
import { environmentTemplates } from '../environments/registry'
import { effectsTemplates } from '../effects/registry'
import type { TemplatePreview } from './preview'
import { PreviewTile } from './PreviewTile'
import { ControlsPanel } from './ControlsPanel'

interface Option {
  id: string
  label: string
  source?: string | null
  preview: TemplatePreview
  accent: string
}

type Slot = 'vehicle' | 'environment' | 'effects'

export function PlaygroundPanel() {
  const vehicleId = usePlaygroundStore((s) => s.vehicleId)
  const environmentId = usePlaygroundStore((s) => s.environmentId)
  const effectsId = usePlaygroundStore((s) => s.effectsId)
  const setVehicle = usePlaygroundStore((s) => s.setVehicle)
  const setEnvironment = usePlaygroundStore((s) => s.setEnvironment)
  const setEffects = usePlaygroundStore((s) => s.setEffects)

  const [openSlot, setOpenSlot] = useState<Slot | null>(null)

  const vehicleOpts: Option[] = useMemo(
    () => vehicleTemplates.map((v) => ({ id: v.id, label: v.label, preview: v.preview, accent: v.accent })),
    [],
  )
  const envOpts: Option[] = useMemo(
    () => environmentTemplates.map((e) => ({ id: e.id, label: e.label, source: e.source, preview: e.preview, accent: e.accent })),
    [],
  )
  const effOpts: Option[] = useMemo(
    () => effectsTemplates.map((e) => ({ id: e.id, label: e.label, source: e.source, preview: e.preview, accent: e.accent })),
    [],
  )

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <SlotButton
        slot="vehicle"
        icon={Car}
        label="Vehicle"
        options={vehicleOpts}
        value={vehicleId}
        onChange={setVehicle}
        open={openSlot === 'vehicle'}
        onToggle={() => setOpenSlot((s) => (s === 'vehicle' ? null : 'vehicle'))}
        onClose={() => setOpenSlot(null)}
      />
      <SlotButton
        slot="environment"
        icon={Mountain}
        label="Environment"
        options={envOpts}
        value={environmentId}
        onChange={setEnvironment}
        open={openSlot === 'environment'}
        onToggle={() => setOpenSlot((s) => (s === 'environment' ? null : 'environment'))}
        onClose={() => setOpenSlot(null)}
      />
      <SlotButton
        slot="effects"
        icon={Wand2}
        label="Effects"
        options={effOpts}
        value={effectsId}
        onChange={setEffects}
        open={openSlot === 'effects'}
        onToggle={() => setOpenSlot((s) => (s === 'effects' ? null : 'effects'))}
        onClose={() => setOpenSlot(null)}
      />
      <ControlsPanel />
    </div>
  )
}

interface SlotButtonProps {
  slot: Slot
  icon: ComponentType<{ className?: string }>
  label: string
  options: Option[]
  value: string
  onChange: (id: string) => void
  open: boolean
  onToggle: () => void
  onClose: () => void
}

function SlotButton({ icon: Icon, label, options, value, onChange, open, onToggle, onClose }: SlotButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.id === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-full bg-black/60 backdrop-blur-2xl border border-white/[0.08] text-[12px] font-medium text-white/85 hover:bg-black/80 hover:border-white/[0.14] transition-all duration-200 select-none min-w-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <span className="relative size-7 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
          <PreviewTile preview={current.preview} accent={current.accent} live={false} />
        </span>
        <Icon className="size-3.5 text-white/40" />
        <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
        <span className="ml-auto text-white/85 truncate max-w-[110px]">{current.label}</span>
        <ChevronUp className={`size-3.5 text-white/40 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label} picker`}
          className="absolute bottom-full right-0 mb-2 w-[min(420px,calc(100vw-2rem))] rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150"
        >
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">{label}</span>
            <span className="text-[10px] text-white/30">{options.length} options</span>
          </div>
          <div className="max-h-[440px] overflow-y-auto p-2 grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <Card
                key={opt.id}
                opt={opt}
                active={opt.id === value}
                onClick={() => {
                  onChange(opt.id)
                  onClose()
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ opt, active, onClick }: { opt: Option; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative rounded-xl overflow-hidden border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        active
          ? 'border-white/30 bg-white/[0.06] shadow-[0_0_24px_-6px_rgba(255,255,255,0.18)]'
          : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.15] hover:bg-white/[0.04]'
      }`}
    >
      <div className="relative w-full h-[92px]">
        <PreviewTile preview={opt.preview} accent={opt.accent} live={false} />
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        {active && (
          <span className="absolute top-2 right-2 size-5 rounded-full bg-white/90 flex items-center justify-center shadow">
            <Check className="size-3 text-black" />
          </span>
        )}
      </div>
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full shrink-0" style={{ background: opt.accent }} />
          <span className="text-[12px] font-medium text-white/90 truncate">{opt.label}</span>
        </div>
        {opt.source && (
          <div className="text-[10px] text-white/30 mt-0.5 truncate">{opt.source}</div>
        )}
      </div>
    </button>
  )
}
