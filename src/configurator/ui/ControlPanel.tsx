import { useState } from 'react'
import { X, RotateCw, Settings2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfiguratorStore } from '../store'
import { CfgTabBar, CfgToggle, CfgLabel, CfgDivider } from './Controls'
import { EnvironmentSelector } from './EnvironmentSelector'
import { EnvironmentControls } from './EnvironmentControls'
import { EffectsPanel } from './EffectsPanel'
import { QualitySelector } from './QualitySelector'

interface ControlPanelProps {
  open: boolean
  onClose: () => void
}

export function ControlPanel({ open, onClose }: ControlPanelProps) {
  const autoRotate = useConfiguratorStore((s) => s.autoRotate)
  const setAutoRotate = useConfiguratorStore((s) => s.setAutoRotate)
  const [advanced, setAdvanced] = useState(false)

  return (
    <div
      className={cn(
        'fixed top-3 right-3 bottom-3 w-[300px] z-40 rounded-2xl',
        'bg-black/50 backdrop-blur-3xl border border-white/[0.06] shadow-2xl shadow-black/50',
        'flex flex-col overflow-hidden transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : 'translate-x-[120%]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <h2 className="text-sm font-semibold tracking-wide text-gradient bg-gradient-to-r from-white via-white/90 to-white/50">
          Scene
        </h2>
        <div className="flex items-center gap-1.5">
          <CfgTabBar
            value={advanced ? 'advanced' : 'simple'}
            onChange={(v) => setAdvanced(v === 'advanced')}
            items={[
              { key: 'simple', label: 'Simple', icon: <Zap className="size-3" /> },
              { key: 'advanced', label: 'Advanced', icon: <Settings2 className="size-3" /> },
            ]}
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <CfgDivider />

      {/* Content */}
      <div className={cn('flex-1 flex flex-col min-h-0 px-4 pt-3 pb-4 gap-3', advanced && 'overflow-y-auto scrollbar-thin')}>
        <Section title="Environment">
          <EnvironmentSelector />
          {advanced && <EnvironmentControls />}
        </Section>

        <CfgDivider />

        <div className="flex items-center gap-2.5">
          <CfgLabel>Camera</CfgLabel>
          <CfgToggle active={autoRotate} onClick={() => setAutoRotate(!autoRotate)} className="flex-1 flex items-center gap-2 py-1.5 text-xs">
            <RotateCw className={cn('size-3', autoRotate ? 'text-white/60' : 'text-white/20')} />
            <span>Spin</span>
            <span className={cn('ml-auto text-[9px] uppercase font-semibold', autoRotate ? 'text-white/40' : 'text-white/15')}>
              {autoRotate ? 'On' : 'Off'}
            </span>
          </CfgToggle>
        </div>

        <CfgDivider />

        <Section title="Effects">
          <EffectsPanel advanced={advanced} />
        </Section>

        <CfgDivider />

        <Section title="Quality">
          <QualitySelector />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <CfgLabel>{title}</CfgLabel>
      {children}
    </div>
  )
}
