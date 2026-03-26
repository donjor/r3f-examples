import { useConfiguratorStore } from '../store'
import { Slider } from '@/components/ui/slider'
import { Sparkles, Circle, Frame, Palette, type LucideIcon } from 'lucide-react'

interface EffectDef {
  id: string
  label: string
  icon: LucideIcon
  storeKey: 'bloomEnabled' | 'aoEnabled' | 'vignetteEnabled' | 'lutEnabled'
  setter: 'setBloomEnabled' | 'setAoEnabled' | 'setVignetteEnabled' | 'setLutEnabled'
}

const effects: EffectDef[] = [
  { id: 'bloom', label: 'Bloom', icon: Sparkles, storeKey: 'bloomEnabled', setter: 'setBloomEnabled' },
  { id: 'ao', label: 'AO', icon: Circle, storeKey: 'aoEnabled', setter: 'setAoEnabled' },
  { id: 'vignette', label: 'Vignette', icon: Frame, storeKey: 'vignetteEnabled', setter: 'setVignetteEnabled' },
  { id: 'lut', label: 'LUT', icon: Palette, storeKey: 'lutEnabled', setter: 'setLutEnabled' },
]

export function EffectsPanel() {
  const store = useConfiguratorStore()

  return (
    <div className="space-y-2.5">
      {/* Effect toggle row */}
      <div className="flex gap-1">
        {effects.map((effect) => {
          const enabled = store[effect.storeKey]
          const toggle = store[effect.setter] as (v: boolean) => void
          const Icon = effect.icon

          return (
            <button
              key={effect.id}
              onClick={() => toggle(!enabled)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                enabled
                  ? 'border-primary/30 bg-primary/[0.08]'
                  : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]'
              }`}
            >
              <div
                className={`flex items-center justify-center size-7 rounded-md transition-colors ${
                  enabled ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-white/25'
                }`}
              >
                <Icon className="size-3.5" />
              </div>
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${enabled ? 'text-white/80' : 'text-white/25'}`}>
                {effect.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Bloom intensity slider (conditional) */}
      {store.bloomEnabled && (
        <div className="flex items-center gap-2.5 px-1">
          <span className="text-[9px] text-white/30 shrink-0">Intensity</span>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={[store.bloomIntensity]}
            onValueChange={([v]) => store.setBloomIntensity(v)}
            className="flex-1"
          />
          <span className="text-[9px] text-white/30 tabular-nums w-6 text-right">
            {store.bloomIntensity.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}
