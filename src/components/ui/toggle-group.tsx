import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"

const ToggleGroupContext = React.createContext<{
  variant?: "default" | "outline"
}>({ variant: "default" })

function ToggleGroup({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  variant?: "default" | "outline"
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { variant } = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex items-center justify-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all outline-none",
        "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border-border",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:border-primary/40",
        variant === "outline" ? "border-input bg-transparent" : "border-transparent bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
