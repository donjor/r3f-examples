import { Slider } from './Slider'
import { Toggle } from './Toggle'

interface Props {
  value: { value: number; enabled: boolean }
  min: number
  max: number
  step?: number
  onChange: (v: { value: number; enabled: boolean }) => void
}

export function OptionalSlider({ value, min, max, step, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 w-full">
      <Toggle value={value.enabled} onChange={(enabled) => onChange({ ...value, enabled })} />
      <div className="flex-1 opacity-[var(--alpha)]" style={{ ['--alpha' as never]: value.enabled ? 1 : 0.4 }}>
        <Slider
          value={value.value}
          min={min}
          max={max}
          step={step}
          disabled={!value.enabled}
          onChange={(v) => onChange({ ...value, value: v })}
        />
      </div>
    </div>
  )
}
