import { Switch } from '@/components/ui/switch'

interface Props {
  value: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ value, onChange }: Props) {
  return <Switch checked={value} onCheckedChange={onChange} />
}
