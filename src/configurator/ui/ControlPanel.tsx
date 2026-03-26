import { Eye, Image as ImageIcon, X, RotateCw } from 'lucide-react'
import { useConfiguratorStore } from '../store'
import { VehicleSelector } from './VehicleSelector'
import { EnvironmentSelector } from './EnvironmentSelector'
import { EffectsPanel } from './EffectsPanel'
import { QualitySelector } from './QualitySelector'

interface ControlPanelProps {
  open: boolean
  onClose: () => void
  previewMode: '3d' | 'static'
  onPreviewModeChange: (mode: '3d' | 'static') => void
}

export function ControlPanel({ open, onClose, previewMode, onPreviewModeChange }: ControlPanelProps) {
  const autoRotate = useConfiguratorStore((s) => s.autoRotate)
  const setAutoRotate = useConfiguratorStore((s) => s.setAutoRotate)

  return (
    <div
      className={`fixed top-3 right-3 bottom-3 w-[360px] z-40 rounded-2xl bg-black/50 backdrop-blur-3xl border border-white/[0.06] shadow-2xl shadow-black/50 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-[120%]'
      }`}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <h2 className="text-[13px] font-semibold tracking-wide text-gradient bg-gradient-to-r from-white via-white/90 to-white/50">
          Configurator
        </h2>
        <div className="flex items-center gap-2">
          {/* 3D / Static toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <PreviewToggle
              active={previewMode === '3d'}
              onClick={() => onPreviewModeChange('3d')}
              icon={<Eye className="size-3" />}
              label="3D"
            />
            <PreviewToggle
              active={previewMode === 'static'}
              onClick={() => onPreviewModeChange('static')}
              icon={<ImageIcon className="size-3" />}
              label="Static"
            />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="gradient-divider mx-4" />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pt-3 pb-4 gap-4">
        {/* Vehicles */}
        <div className="space-y-2.5">
          <SectionLabel title="Vehicles" />
          <VehicleSelector previewMode={previewMode} />
        </div>

        <div className="gradient-divider" />

        {/* Environment */}
        <div className="space-y-2.5">
          <SectionLabel title="Environment" />
          <EnvironmentSelector />
        </div>

        <div className="gradient-divider" />

        {/* Camera */}
        <div className="space-y-2.5">
          <SectionLabel title="Camera" />
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border transition-all duration-150 cursor-pointer ${
              autoRotate
                ? 'border-primary/30 bg-primary/[0.08]'
                : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]'
            }`}
          >
            <div
              className={`flex items-center justify-center size-6 rounded-md transition-colors ${
                autoRotate ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-white/25'
              }`}
            >
              <RotateCw className="size-3" />
            </div>
            <span className={`text-[10px] font-medium ${autoRotate ? 'text-white/80' : 'text-white/40'}`}>
              Auto Rotate
            </span>
            <span className={`ml-auto text-[9px] font-semibold uppercase tracking-wider ${autoRotate ? 'text-primary/70' : 'text-white/20'}`}>
              {autoRotate ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        <div className="gradient-divider" />

        {/* Effects */}
        <div className="space-y-2.5">
          <SectionLabel title="Effects" />
          <EffectsPanel />
        </div>

        <div className="gradient-divider" />

        {/* Quality */}
        <div className="space-y-2">
          <SectionLabel title="Quality" />
          <QualitySelector />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ title }: { title: string }) {
  return (
    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
      {title}
    </span>
  )
}

function PreviewToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-white/[0.08] text-white shadow-sm'
          : 'text-white/25 hover:text-white/50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
