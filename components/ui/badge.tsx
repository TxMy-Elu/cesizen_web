import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/90 text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:brightness-105 hover:shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-brand-sage-100 hover:shadow",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground shadow-sm hover:-translate-y-0.5 hover:brightness-105 hover:shadow",
        outline: "border-border bg-card text-foreground hover:border-brand-olive/45 hover:bg-brand-sage-50/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
