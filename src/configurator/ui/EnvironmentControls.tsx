import { cn } from '@/lib/utils'
import { useConfiguratorStore } from '../store'
import { DREI_PRESETS } from '../types'
import type { EnvSource } from '../types'
import { CfgSlider, CfgSwitch, CfgCard } from './Controls'

const ENV_SOURCES: { key: EnvSource; label: string }[] = [
  { key: 'static-lightformers', label: 'Static' },
  { key: 'animated-lightformers', label: 'Animated' },
  { key: 'preset', label: 'Preset' },
]

export function EnvironmentControls() {
  const config = useConfiguratorStore((s) => s.envConfig)
  const updateEnv = useConfiguratorStore((s) => s.updateEnv)

  return (
    <div className="space-y-2 pt-1">
      {/* Source */}
      <CfgCard title="Source">
        <div className="flex gap-0.5 p-0.5 rounded-md bg-white/[0.03] border border-white/[0.04]">
          {ENV_SOURCES.map((s) => (
            <button
              key={s.key}
              onClick={() => updateEnv({ envSource: s.key })}
              className={cn(
                'flex-1 py-1 rounded text-[9px] font-semibold text-center transition-all cursor-pointer',
                config.envSource === s.key
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/20 hover:text-white/45',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {config.envSource === 'preset' && (
          <div className="flex gap-1 overflow-x-auto scrollbar-none pt-0.5">
            {DREI_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => updateEnv({ dreiPreset: p })}
                className={cn(
                  'shrink-0 px-2 py-[3px] rounded-full text-[8px] font-semibold uppercase tracking-[0.08em] border transition-all cursor-pointer',
                  config.dreiPreset === p
                    ? 'border-white/[0.10] bg-white/[0.06] text-white/70'
                    : 'border-white/[0.04] bg-white/[0.015] text-white/15 hover:text-white/40 hover:border-white/[0.08]',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <CfgSwitch label="Show as Background" checked={config.envBackground} onChange={(v) => updateEnv({ envBackground: v })} />
        <CfgSlider label="Blur" value={config.envBlur} onChange={(v) => updateEnv({ envBlur: v })} min={0} max={2} />
      </CfgCard>

      {/* Background */}
      <CfgCard title="Background">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/25">Color</span>
          <div className="flex items-center gap-2">
            <label
              className="size-5 rounded-md border border-white/[0.08] cursor-pointer hover:border-white/[0.15] transition-colors"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateEnv({ backgroundColor: e.target.value })}
                className="absolute opacity-0 w-0 h-0"
              />
            </label>
            <span className="text-[9px] text-white/15 font-mono">{config.backgroundColor}</span>
          </div>
        </div>
      </CfgCard>

      {/* Lighting */}
      <CfgCard title="Lighting">
        <CfgSlider label="Ambient" value={config.ambientIntensity} onChange={(v) => updateEnv({ ambientIntensity: v })} min={0} max={Math.PI * 2} />
        <CfgSwitch label="Hemisphere" checked={config.hemisphereLight} onChange={(v) => updateEnv({ hemisphereLight: v })} />
        {config.hemisphereLight && (
          <CfgSlider label="Intensity" value={config.hemisphereIntensity} onChange={(v) => updateEnv({ hemisphereIntensity: v })} min={0} max={3} />
        )}
        <CfgSwitch label="Spot Light" checked={config.spotLight} onChange={(v) => updateEnv({ spotLight: v })} />
        {config.spotLight && (
          <CfgSlider label="Intensity" value={config.spotIntensity} onChange={(v) => updateEnv({ spotIntensity: v })} min={0} max={10} />
        )}
      </CfgCard>

      {/* Features */}
      <CfgCard title="Features">
        <CfgSwitch label="Accent Ring" checked={config.accentRing} onChange={(v) => updateEnv({ accentRing: v })} />
        <CfgSwitch label="Floor Rings" checked={config.decorativeRings} onChange={(v) => updateEnv({ decorativeRings: v })} />
        <CfgSwitch label="Gradient Sphere" checked={config.gradientSphere} onChange={(v) => updateEnv({ gradientSphere: v })} />
        {config.gradientSphere && (
          <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
            <ColorRow label="Base" value={config.gradientColorBase} onChange={(v) => updateEnv({ gradientColorBase: v })} />
            <ColorRow label="Color A" value={config.gradientColorA} onChange={(v) => updateEnv({ gradientColorA: v })} />
            <ColorRow label="Color B" value={config.gradientColorB} onChange={(v) => updateEnv({ gradientColorB: v })} />
          </div>
        )}
      </CfgCard>

      {/* Shadows */}
      <CfgCard title="Shadows">
        <CfgSlider label="Blur" value={config.shadowBlur} onChange={(v) => updateEnv({ shadowBlur: v })} min={0} max={5} />
        <CfgSlider label="Opacity" value={config.shadowOpacity} onChange={(v) => updateEnv({ shadowOpacity: v })} min={0} max={1} />
      </CfgCard>
    </div>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/25">{label}</span>
      <div className="flex items-center gap-2">
        <label
          className="size-5 rounded-md border border-white/[0.08] cursor-pointer hover:border-white/[0.15] transition-colors"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
        </label>
        <span className="text-[9px] text-white/15 font-mono">{value}</span>
      </div>
    </div>
  )
}
