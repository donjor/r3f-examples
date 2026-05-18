import { useEffect, useRef, useState } from 'react'
import { ChevronUp, Settings2, RotateCcw } from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import { usePlaygroundStore } from '../store'
import { vehicleById } from '../vehicles/registry'
import { environmentById } from '../environments/registry'
import { effectsById } from '../effects/registry'
import { globalSchema } from '../controls/global'
import { resolveValues } from '../controls/resolve'
import type { ControlValue, Slot } from '../controls/types'
import { ControlGroup } from './inputs/ControlGroup'

type TabId = 'global' | Slot

interface TabDef {
  id: TabId
  label: string
}

const TABS: TabDef[] = [
  { id: 'global', label: 'Global' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'environment', label: 'Environment' },
  { id: 'effects', label: 'Effects' },
]

export function ControlsPanel() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<TabId>('global')
  const ref = useRef<HTMLDivElement>(null)

  const vehicleId = usePlaygroundStore((s) => s.vehicleId)
  const environmentId = usePlaygroundStore((s) => s.environmentId)
  const effectsId = usePlaygroundStore((s) => s.effectsId)
  const controls = usePlaygroundStore((s) => s.controls)
  const setControl = usePlaygroundStore((s) => s.setControl)
  const setGlobal = usePlaygroundStore((s) => s.setGlobal)
  const resetControls = usePlaygroundStore((s) => s.resetControls)
  const resetGlobal = usePlaygroundStore((s) => s.resetGlobal)
  const resetAll = usePlaygroundStore((s) => s.resetAll)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [open])

  const vehicle = vehicleById(vehicleId)
  const environment = environmentById(environmentId)
  const effects = effectsById(effectsId)

  const globalValues = resolveValues(globalSchema, controls.global)
  const vehicleValues = resolveValues(vehicle.controls ?? [], controls.vehicle[vehicleId])
  const envValues = resolveValues(environment.controls ?? [], controls.environment[environmentId])
  const effectValues = resolveValues(effects.controls ?? [], controls.effects[effectsId])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-full bg-black/60 backdrop-blur-2xl border border-white/[0.08] text-[12px] font-medium text-white/85 hover:bg-black/80 hover:border-white/[0.14] transition-all duration-200 select-none min-w-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <span className="relative size-7 rounded-full overflow-hidden border border-white/[0.08] shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30">
          <Settings2 className="size-3.5 text-white/80" />
        </span>
        <Settings2 className="size-3.5 text-white/40" />
        <span className="text-[10px] uppercase tracking-wider text-white/40">Controls</span>
        <span className="ml-auto text-white/85 truncate max-w-[110px]">Tweak</span>
        <ChevronUp className={`size-3.5 text-white/40 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Controls"
          className="absolute bottom-full right-0 mb-2 w-[min(480px,calc(100vw-2rem))] rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150"
        >
          <Tabs.Root value={tab} onValueChange={(v) => setTab(v as TabId)}>
            <Tabs.List className="flex border-b border-white/[0.06] px-2 pt-2">
              {TABS.map((t) => (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className="flex-1 text-[11px] font-medium uppercase tracking-wider text-white/40 data-[state=active]:text-white/90 data-[state=active]:border-white/30 border-b-2 border-transparent px-2 pb-2 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-t"
                >
                  {t.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="max-h-[60vh] overflow-y-auto px-3 py-2">
              <Tabs.Content value="global">
                <Header label="Global" sub="Camera · Tone" />
                <ControlGroup
                  schema={globalSchema}
                  values={globalValues}
                  onChange={(id, v) => setGlobal(id, v)}
                  onReset={resetGlobal}
                  resetLabel="Reset global"
                />
              </Tabs.Content>
              <Tabs.Content value="vehicle">
                <Header label={vehicle.label} sub="Vehicle controls" />
                <ControlGroup
                  schema={vehicle.controls ?? []}
                  values={vehicleValues}
                  onChange={(id, v) => setControl('vehicle', vehicleId, id, v)}
                  onReset={() => resetControls('vehicle', vehicleId)}
                  resetLabel="Reset vehicle"
                />
              </Tabs.Content>
              <Tabs.Content value="environment">
                <Header label={environment.label} sub={environment.source} />
                <ControlGroup
                  schema={environment.controls ?? []}
                  values={envValues}
                  onChange={(id, v) => setControl('environment', environmentId, id, v)}
                  onReset={() => resetControls('environment', environmentId)}
                  resetLabel="Reset env"
                />
              </Tabs.Content>
              <Tabs.Content value="effects">
                <Header label={effects.label} sub={effects.source ?? 'none'} />
                <ControlGroup
                  schema={effects.controls ?? []}
                  values={effectValues}
                  onChange={(id, v: ControlValue) => setControl('effects', effectsId, id, v)}
                  onReset={() => resetControls('effects', effectsId)}
                  resetLabel="Reset effects"
                />
              </Tabs.Content>
            </div>

            <div className="border-t border-white/[0.06] px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-white/30">Tweaks persist when switching presets.</span>
              <button
                type="button"
                onClick={resetAll}
                className="text-[11px] text-white/40 hover:text-white/80 transition px-2 py-1 rounded flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <RotateCcw className="size-3" /> Reset all
              </button>
            </div>
          </Tabs.Root>
        </div>
      )}
    </div>
  )
}

function Header({ label, sub }: { label: string; sub?: string | null }) {
  return (
    <div className="px-1 py-2 flex items-baseline gap-2">
      <span className="text-[13px] font-medium text-white/90">{label}</span>
      {sub && <span className="text-[10px] text-white/30">{sub}</span>}
    </div>
  )
}
