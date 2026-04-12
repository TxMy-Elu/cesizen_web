import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-transparent text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
        zen:
          "border-primary/35 bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border-border bg-surface-strong text-foreground shadow-subtle hover:-translate-y-0.5 hover:border-[#6ba382] hover:bg-[#6ba382] hover:text-white hover:shadow-soft",
        secondary:
          "border-border/70 bg-secondary text-secondary-foreground shadow-subtle hover:-translate-y-0.5 hover:bg-brand-sage-100",
        ghost: "text-foreground hover:bg-brand-sage-100/70",
        link: "text-primary underline-offset-4 hover:text-brand-olive-700 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
