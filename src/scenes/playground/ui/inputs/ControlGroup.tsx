import { useMemo } from 'react'
import type { ControlSchema, ControlValue, ControlValues, Knob } from '../../controls/types'
import { Slider } from './Slider'
import { OptionalSlider } from './OptionalSlider'
import { Toggle } from './Toggle'
import { ColorInput } from './ColorInput'
import { Select } from './Select'

interface Props {
  schema: ControlSchema
  values: ControlValues
  onChange: (knobId: string, value: ControlValue) => void
  onReset?: () => void
  resetLabel?: string
  emptyMessage?: string
}

export function ControlGroup({ schema, values, onChange, onReset, resetLabel = 'Reset', emptyMessage }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, Knob[]>()
    for (const k of schema) {
      const g = k.group ?? 'General'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(k)
    }
    return Array.from(map.entries())
  }, [schema])

  if (schema.length === 0) {
    return (
      <div className="text-[12px] text-white/40 italic px-3 py-6 text-center">
        {emptyMessage ?? 'No controls for this preset.'}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {grouped.map(([group, knobs]) => (
        <section key={group} className="flex flex-col gap-2.5">
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold px-1">{group}</div>
          {knobs.map((knob) => (
            <KnobRow key={knob.id} knob={knob} value={values[knob.id]} onChange={(v) => onChange(knob.id, v)} />
          ))}
        </section>
      ))}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="self-end text-[11px] text-white/40 hover:text-white/80 transition px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          ↺ {resetLabel}
        </button>
      )}
    </div>
  )
}

function KnobRow({
  knob,
  value,
  onChange,
}: {
  knob: Knob
  value: ControlValue | undefined
  onChange: (v: ControlValue) => void
}) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="text-[11px] text-white/70 w-[42%] truncate">{knob.label}</div>
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <KnobInput knob={knob} value={value} onChange={onChange} />
      </div>
    </div>
  )
}

function KnobInput({
  knob,
  value,
  onChange,
}: {
  knob: Knob
  value: ControlValue | undefined
  onChange: (v: ControlValue) => void
}) {
  if (knob.kind === 'slider') {
    const v = typeof value === 'number' ? value : knob.default
    return (
      <div className="flex items-center gap-2 flex-1">
        <Slider value={v} min={knob.min} max={knob.max} step={knob.step} onChange={onChange} />
        <span className="text-[10px] font-mono text-white/50 w-12 text-right shrink-0">{v.toFixed(2)}</span>
      </div>
    )
  }
  if (knob.kind === 'slider-optional') {
    const v = value && typeof value === 'object' && 'value' in value
      ? value
      : { value: knob.default, enabled: knob.enabledDefault ?? false }
    return (
      <div className="flex items-center gap-2 flex-1">
        <OptionalSlider value={v} min={knob.min} max={knob.max} step={knob.step} onChange={onChange} />
        <span className="text-[10px] font-mono text-white/50 w-12 text-right shrink-0">{v.value.toFixed(1)}</span>
      </div>
    )
  }
  if (knob.kind === 'color') {
    const v = typeof value === 'string' ? value : knob.default
    return <ColorInput value={v} onChange={onChange} />
  }
  if (knob.kind === 'toggle') {
    const v = typeof value === 'boolean' ? value : knob.default
    return <Toggle value={v} onChange={onChange} />
  }
  const v = typeof value === 'string' ? value : knob.default
  return <Select value={v} options={knob.options} onChange={onChange} />
}
