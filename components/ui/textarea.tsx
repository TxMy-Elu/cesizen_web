import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-28 w-full rounded-xl border border-border/80 bg-surface-strong px-3.5 py-2.5 text-sm text-foreground shadow-subtle transition-all duration-200 placeholder:text-muted-foreground/80 hover:border-brand-olive/55 hover:bg-surface-muted focus-visible:outline-none focus-visible:border-brand-olive-300 focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
