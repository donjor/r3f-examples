import { Slider as RadixSlider } from '@/components/ui/slider'

interface Props {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function Slider({ value, min, max, step = 0.01, onChange, disabled }: Props) {
  return (
    <RadixSlider
      value={[value]}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(v) => onChange(v[0])}
      className="w-full"
    />
  )
}
