import { cn } from '@/lib/utils'
import { Sparkles, Circle, Frame, Palette, type LucideIcon } from 'lucide-react'
import { useConfiguratorStore } from '../store'
import { CfgSlider, CfgCard } from './Controls'

interface EffectDef {
  id: string
  label: string
  icon: LucideIcon
  key: 'bloomEnabled' | 'aoEnabled' | 'vignetteEnabled' | 'lutEnabled'
}

const effects: EffectDef[] = [
  { id: 'bloom', label: 'Bloom', icon: Sparkles, key: 'bloomEnabled' },
  { id: 'ao', label: 'AO', icon: Circle, key: 'aoEnabled' },
  { id: 'vignette', label: 'Vignette', icon: Frame, key: 'vignetteEnabled' },
  { id: 'lut', label: 'LUT', icon: Palette, key: 'lutEnabled' },
]

export function EffectsPanel({ advanced }: { advanced: boolean }) {
  const fx = useConfiguratorStore((s) => s.effects)
  const updateEffects = useConfiguratorStore((s) => s.updateEffects)

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {effects.map((effect) => {
          const enabled = fx[effect.key]
          const Icon = effect.icon
          return (
            <button
              key={effect.id}
              onClick={() => updateEffects({ [effect.key]: !enabled })}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer',
                enabled
                  ? 'border-white/[0.08] bg-white/[0.06] shadow-[0_0_12px_oklch(0.65_0.2_250/0.06)]'
                  : 'border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.03]',
              )}
            >
              <Icon className={cn('size-3.5', enabled ? 'text-white/60' : 'text-white/15')} />
              <span className={cn('text-[7px] font-semibold uppercase tracking-wider', enabled ? 'text-white/60' : 'text-white/15')}>
                {effect.label}
              </span>
            </button>
          )
        })}
      </div>

      {fx.bloomEnabled && (
        <CfgSlider label="Bloom" value={fx.bloomIntensity} onChange={(v) => updateEffects({ bloomIntensity: v })} min={0} max={5} />
      )}

      {advanced && (fx.bloomEnabled || fx.aoEnabled || fx.vignetteEnabled) && (
        <CfgCard title="Parameters">
          {fx.bloomEnabled && (
            <CfgSlider label="Threshold" value={fx.bloomThreshold} onChange={(v) => updateEffects({ bloomThreshold: v })} min={0} max={1} />
          )}
          {fx.aoEnabled && (
            <>
              <CfgSlider label="AO Radius" value={fx.aoRadius} onChange={(v) => updateEffects({ aoRadius: v })} min={0} max={5} />
              <CfgSlider label="AO Power" value={fx.aoIntensity} onChange={(v) => updateEffects({ aoIntensity: v })} min={0} max={5} />
            </>
          )}
          {fx.vignetteEnabled && (
            <>
              <CfgSlider label="Offset" value={fx.vignetteOffset} onChange={(v) => updateEffects({ vignetteOffset: v })} min={0} max={1} />
              <CfgSlider label="Darkness" value={fx.vignetteDarkness} onChange={(v) => updateEffects({ vignetteDarkness: v })} min={0} max={1} />
            </>
          )}
        </CfgCard>
      )}
    </div>
  )
}
