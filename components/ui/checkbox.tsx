import * as React from "react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type ?? "checkbox"}
        className={cn(
          "h-4.5 w-4.5 rounded-md border border-input/90 bg-white text-brand-olive accent-brand-olive shadow-sm transition-all duration-200 hover:border-brand-olive/65 hover:bg-brand-sage-50 hover:shadow focus-visible:outline-none focus-visible:border-brand-olive-300 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
