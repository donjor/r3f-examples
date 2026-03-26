import { useConfiguratorStore } from '../store'
import { presets, presetKeys } from '../environments/presets'

export function EnvironmentSelector() {
  const current = useConfiguratorStore((s) => s.environment)
  const setEnvironment = useConfiguratorStore((s) => s.setEnvironment)

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {presetKeys.map((key) => {
        const p = presets[key]
        const active = key === current
        return (
          <button
            key={key}
            onClick={() => setEnvironment(key)}
            className={`rounded-lg border overflow-hidden text-center transition-all duration-150 cursor-pointer group ${
              active
                ? 'border-primary/40 shadow-[0_0_16px_oklch(0.65_0.2_250/0.10)]'
                : 'border-white/[0.04] hover:border-white/[0.10]'
            }`}
          >
            <div
              className="h-6 w-full transition-opacity group-hover:opacity-90"
              style={{ backgroundColor: p.bgColor }}
            />
            <div className={`px-1.5 py-1.5 ${active ? 'bg-white/[0.06]' : 'bg-white/[0.02]'}`}>
              <span className={`block text-[9px] font-medium leading-tight truncate ${active ? 'text-white' : 'text-white/45'}`}>
                {p.name}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
