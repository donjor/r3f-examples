import { useConfiguratorStore } from '../store'
import type { QualityTier } from '../types'

const tiers: { key: QualityTier; label: string }[] = [
  { key: 'high', label: 'High' },
  { key: 'med', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

export function QualitySelector() {
  const current = useConfiguratorStore((s) => s.qualityTier)
  const setQuality = useConfiguratorStore((s) => s.setQualityTier)
  const activeIndex = tiers.findIndex((t) => t.key === current)

  return (
    <div className="relative flex rounded-lg bg-white/[0.03] border border-white/[0.05] p-0.5">
      {/* Sliding indicator */}
      <div
        className="absolute top-0.5 bottom-0.5 rounded-md bg-white/[0.10] border border-white/[0.06] transition-all duration-200 ease-out"
        style={{
          width: `calc(${100 / tiers.length}% - 2px)`,
          left: `calc(${(activeIndex * 100) / tiers.length}% + 1px)`,
        }}
      />
      {tiers.map((t) => {
        const active = t.key === current
        return (
          <button
            key={t.key}
            onClick={() => setQuality(t.key)}
            className={`relative flex-1 z-10 py-1.5 text-center text-[10px] font-semibold transition-colors duration-150 cursor-pointer rounded-md ${
              active ? 'text-white' : 'text-white/30 hover:text-white/50'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
