interface Props {
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}

export function Select({ value, options, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/[0.04] border border-white/10 text-white/85 text-[12px] rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-zinc-900">
          {o.label}
        </option>
      ))}
    </select>
  )
}
