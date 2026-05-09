import { cn } from '@/lib/utils'
import { useConfiguratorStore } from '../store'
import { presets, presetKeys } from '../environments/presets'

export function EnvironmentSelector() {
  const activePreset = useConfiguratorStore((s) => s.activePreset)
  const loadPreset = useConfiguratorStore((s) => s.loadPreset)

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {presetKeys.map((key) => {
        const p = presets[key]
        const active = key === activePreset
        return (
          <button
            key={key}
            onClick={() => loadPreset(key)}
            className={cn(
              'rounded-lg border overflow-hidden text-center transition-all duration-200 cursor-pointer group',
              active
                ? 'border-white/[0.10] bg-white/[0.06] shadow-[0_0_15px_oklch(0.65_0.2_250/0.08)]'
                : 'border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.03]',
            )}
          >
            <div className="h-5 w-full transition-opacity group-hover:opacity-80" style={{ backgroundColor: p.bgColor }} />
            <div className="px-1.5 py-1.5">
              <span className={cn('block text-[9px] font-medium leading-tight truncate', active ? 'text-white/80' : 'text-white/30')}>
                {p.name}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
