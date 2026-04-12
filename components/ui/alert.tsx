import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm shadow-soft transition-all duration-200 hover:border-brand-sage-300/80 hover:shadow-lg [&>p]:leading-relaxed",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        soft: "border-brand-sage-200 bg-brand-sage-50/70 text-brand-dark",
        warning: "border-brand-sand-300 bg-brand-sand-50/80 text-brand-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>

function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-medium tracking-tight", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-brand-dark/80", className)} {...props} />
}

export { Alert, AlertDescription, AlertTitle }
