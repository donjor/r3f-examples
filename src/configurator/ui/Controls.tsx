import * as SliderPrimitive from '@radix-ui/react-slider'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* ── Slider ────────────────────────────────────────────── */

export function CfgSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.05,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] text-white/25 shrink-0 w-14">{label}</span>
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="relative flex w-full touch-none items-center select-none h-4 flex-1"
      >
        <SliderPrimitive.Track className="relative h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-white/10 to-white/25 rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-2.5 rounded-full bg-white/50 border border-white/20 shadow-[0_0_6px_rgba(255,255,255,0.1)] transition-colors hover:bg-white/70 focus-visible:bg-white/70 focus-visible:outline-none cursor-grab active:cursor-grabbing" />
      </SliderPrimitive.Root>
      <span className="text-[10px] text-white/20 tabular-nums w-7 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

/* ── Switch ────────────────────────────────────────────── */

export function CfgSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/25">{label}</span>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          'inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full border border-white/[0.06] transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20',
          checked ? 'bg-white/[0.12]' : 'bg-white/[0.04]',
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block size-3 rounded-full transition-all duration-200',
            checked
              ? 'translate-x-[15px] bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.2)]'
              : 'translate-x-[2px] bg-white/25',
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
}

/* ── Toggle button ─────────────────────────────────────── */

export function CfgToggle({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer',
        active
          ? 'border-white/[0.08] bg-white/[0.06] text-white/80 shadow-[0_0_15px_oklch(0.65_0.2_250/0.06)]'
          : 'border-white/[0.04] bg-white/[0.015] text-white/25 hover:border-white/[0.08] hover:bg-white/[0.03] hover:text-white/40',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ── Card (grouping) ───────────────────────────────────── */

export function CfgCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-2.5 space-y-2">
      <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-white/15">
        {title}
      </span>
      {children}
    </div>
  )
}

/* ── Tab bar (pill toggle group) ───────────────────────── */

export function CfgTabBar<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T
  onChange: (v: T) => void
  items: { key: T; label: string; icon?: React.ReactNode }[]
}) {
  return (
    <div className="flex gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.04]">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 cursor-pointer',
            value === item.key
              ? 'bg-white/[0.08] text-white/90'
              : 'text-white/25 hover:text-white/50',
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}

/* ── Section label ─────────────────────────────────────── */

export function CfgLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20 shrink-0">
      {children}
    </span>
  )
}

/* ── Divider ───────────────────────────────────────────── */

export function CfgDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
}
