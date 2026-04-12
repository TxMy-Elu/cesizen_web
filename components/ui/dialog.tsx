"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog />")
  }
  return context
}

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    if (open) window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useDialogContext()
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: () => void }>
  return React.cloneElement(child, {
    onClick: () => {
      child.props.onClick?.()
      onOpenChange(true)
    },
  })
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open, onOpenChange } = useDialogContext()
    if (!open) return null

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Fermer la fenêtre"
          className="absolute inset-0 cursor-default bg-brand-dark/20 backdrop-blur-[2px]"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-10 w-full max-w-lg rounded-2xl border border-surface-border bg-surface-strong p-6 text-card-foreground shadow-soft",
            className
          )}
          {...props}
        />
        <button
          type="button"
          aria-label="Fermer la fenêtre"
          className="absolute right-4 top-4 rounded-full border border-border/70 bg-surface-strong px-3 py-1 text-xs text-muted-foreground shadow-subtle transition-colors hover:bg-surface-muted"
          onClick={() => onOpenChange(false)}
        >
          Fermer
        </button>
      </div>,
      document.body
    )
  }
)
DialogContent.displayName = "DialogContent"

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-end gap-2 pt-4", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger }

