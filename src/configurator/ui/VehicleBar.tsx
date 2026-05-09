import { useRef, useEffect } from 'react'
import { Car, Undo2, Eye, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CfgTabBar } from './Controls'
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

interface VehicleBarProps {
  panelOpen: boolean
  previewMode: '3d' | 'static'
  onPreviewModeChange: (mode: '3d' | 'static') => void
}

export function VehicleBar({ panelOpen, previewMode, onPreviewModeChange }: VehicleBarProps) {
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
    <div
      className={cn(
        'fixed bottom-3 left-3 z-40 rounded-2xl',
        'bg-black/50 backdrop-blur-3xl border border-white/[0.06] shadow-2xl shadow-black/50',
        'transition-all duration-300 ease-out',
        panelOpen ? 'right-[316px]' : 'right-3',
      )}
    >
      <div className="px-3 pt-3 pb-2.5 space-y-2.5">
        {/* Vehicle carousel */}
        <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-none snap-x snap-mandatory">
          {vehicleKeys.map((key) => {
            const v = vehicles[key]
            const active = key === current
            const modelPath = v.pathTemplate.replace('{tier}', 'low')
            return (
              <button
                key={key}
                data-active={active}
                onClick={() => setVehicle(key)}
                className={cn(
                  'shrink-0 w-[100px] snap-start rounded-xl border overflow-hidden text-left transition-all duration-200 cursor-pointer group',
                  active
                    ? 'border-white/[0.10] bg-white/[0.06] shadow-[0_0_20px_oklch(0.65_0.2_250/0.10)]'
                    : 'border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.03]',
                )}
              >
                <div className="relative w-full aspect-[5/3] bg-black/30 overflow-hidden">
                  {previewMode === '3d' ? (
                    <ModelPreview modelPath={modelPath} className="w-full h-full" quality="low" rotationSpeed={0.2} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className={cn('size-6', active ? 'text-white/[0.06]' : 'text-white/[0.03]')} />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
                <div className="px-2 py-1.5">
                  <span className={cn(
                    'block text-[9px] font-medium leading-tight line-clamp-1',
                    active ? 'text-white/80' : 'text-white/30 group-hover:text-white/50',
                  )}>
                    {v.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Paint + preview toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-1">
            <button
              onClick={() => setPaintColor(null)}
              title="Original color"
              className={cn(
                'size-5 rounded-full border-2 transition-all cursor-pointer hover:scale-110 flex items-center justify-center',
                paintColor === null
                  ? 'border-white/60 bg-white/10 shadow-[0_0_6px_rgba(255,255,255,0.15)] scale-110'
                  : 'border-white/[0.12] hover:border-white/30',
              )}
            >
              <Undo2 className="size-2 text-white/40" />
            </button>
            {PAINT_SWATCHES.map((swatch) => (
              <button
                key={swatch.color}
                onClick={() => setPaintColor(swatch.color)}
                title={swatch.name}
                className={cn(
                  'size-5 rounded-full border-2 transition-all cursor-pointer hover:scale-110',
                  paintColor === swatch.color
                    ? 'border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.15)] scale-110'
                    : 'border-transparent hover:border-white/20',
                )}
                style={{ backgroundColor: swatch.color }}
              />
            ))}
            <label
              className={cn(
                'relative size-5 rounded-full border-2 cursor-pointer overflow-hidden transition-all hover:scale-110',
                paintColor !== null && !PAINT_SWATCHES.some((s) => s.color === paintColor)
                  ? 'border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.15)] scale-110'
                  : 'border-white/[0.12] hover:border-white/30',
              )}
              style={{ background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            >
              <input
                type="color"
                value={paintColor ?? '#ffffff'}
                onChange={(e) => setPaintColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>

          <CfgTabBar
            value={previewMode}
            onChange={onPreviewModeChange}
            items={[
              { key: '3d' as const, label: '3D', icon: <Eye className="size-2.5" /> },
              { key: 'static' as const, label: 'Static', icon: <ImageIcon className="size-2.5" /> },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
