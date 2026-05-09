import { useRef, useEffect } from 'react'
import { Car, Undo2 } from 'lucide-react'
import ModelPreview from '@/components/ModelPreview'
import { useConfiguratorStore } from '../store'
import { vehicles, vehicleKeys } from '../vehicles/registry'

const PAINT_SWATCHES = [
  { name: 'Midnight Blue', color: '#1a1a2e' },
  { name: 'Racing Red', color: '#8b1a1a' },
  { name: 'Pearl White', color: '#e8e4df' },
  { name: 'Obsidian Black', color: '#0a0a0a' },
  { name: 'British Racing Green', color: '#1a4d2e' },
  { name: 'Velocity Orange', color: '#c45e1a' },
  { name: 'Gunmetal Grey', color: '#3a3a3a' },
  { name: 'Electric Blue', color: '#1a3d8b' },
]

interface VehicleSelectorProps {
  previewMode: '3d' | 'static'
}

export function VehicleSelector({ previewMode }: VehicleSelectorProps) {
  const current = useConfiguratorStore((s) => s.vehicle)
  const setVehicle = useConfiguratorStore((s) => s.setVehicle)
  const paintColor = useConfiguratorStore((s) => s.paintColor)
  const setPaintColor = useConfiguratorStore((s) => s.setPaintColor)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeCard = container.querySelector('[data-active="true"]')
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [current])

  return (
    <div className="space-y-3">
      {/* Horizontal vehicle carousel */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-1 px-1 pb-1"
      >
        {vehicleKeys.map((key) => {
          const v = vehicles[key]
          const active = key === current
          const modelPath = v.pathTemplate.replace('{tier}', 'low')
          return (
            <button
              key={key}
              data-active={active}
              onClick={() => setVehicle(key)}
              className={`shrink-0 w-[120px] snap-start rounded-xl border overflow-hidden text-left transition-all duration-200 cursor-pointer group ${
                active
                  ? 'border-primary/40 shadow-[0_0_24px_oklch(0.65_0.2_250/0.12)] bg-white/[0.06]'
                  : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.04]'
              }`}
            >
              <div className="relative w-full aspect-[4/3] bg-black/30 overflow-hidden">
                {previewMode === '3d' ? (
                  <ModelPreview
                    modelPath={modelPath}
                    className="w-full h-full"
                    quality="low"
                    rotationSpeed={0.2}
                  />
                ) : (
                  <VehicleStaticPreview active={active} />
                )}
                <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
              <div className="px-2.5 py-2">
                <span
                  className={`block text-[10px] font-medium leading-tight line-clamp-2 transition-colors ${
                    active ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                  }`}
                >
                  {v.name}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Paint swatches */}
      <div className="space-y-2">
        <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em]">Paint</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setPaintColor(null)}
            title="Original color"
            className={`size-6 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-110 flex items-center justify-center ${
              paintColor === null
                ? 'border-white bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-110'
                : 'border-white/20 bg-white/[0.04] hover:border-white/40'
            }`}
          >
            <Undo2 className="size-2.5 text-white/60" />
          </button>
          {PAINT_SWATCHES.map((swatch) => {
            const active = paintColor === swatch.color
            return (
              <button
                key={swatch.color}
                onClick={() => setPaintColor(swatch.color)}
                title={swatch.name}
                className={`size-6 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-110 ${
                  active
                    ? 'border-white shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-110'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{ backgroundColor: swatch.color }}
              />
            )
          })}
          <label
            className={`relative size-6 rounded-full border-2 cursor-pointer overflow-hidden transition-all hover:scale-110 ${
              paintColor !== null && !PAINT_SWATCHES.some((s) => s.color === paintColor)
                ? 'border-white shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-110'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{
              background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          >
            <input
              type="color"
              value={paintColor ?? '#ffffff'}
              onChange={(e) => setPaintColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function VehicleStaticPreview({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        className={`absolute inset-0 transition-opacity ${active ? 'opacity-100' : 'opacity-50'}`}
        style={{
          background: 'radial-gradient(circle at 50% 60%, oklch(0.65 0.2 250 / 0.08), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <Car className={`size-8 transition-colors ${active ? 'text-white/[0.08]' : 'text-white/[0.04]'}`} />
    </div>
  )
}
