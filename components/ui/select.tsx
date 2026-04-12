import * as React from "react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full cursor-pointer rounded-xl border border-border/80 bg-surface-strong px-3.5 py-2 text-sm text-foreground shadow-subtle transition-all duration-200 hover:border-brand-olive/55 hover:bg-surface-muted focus-visible:outline-none focus-visible:border-brand-olive-300 focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
