"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within <DropdownMenu />")
  }
  return context
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    if (open) window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children }: { children: React.ReactElement<React.HTMLAttributes<HTMLElement>> }) {
  const { setOpen, open } = useDropdownContext()
  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    children.props.onClick?.(event)
    setOpen(!open)
  }

  return React.cloneElement(children, { onClick: handleClick })
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useDropdownContext()
    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border/70 bg-card p-2 shadow-soft",
          className
        )}
        {...props}
      />
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

export function DropdownMenuItem({ className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDropdownContext()
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted",
        className
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        setOpen(false)
      }}
    />
  )
}

export function DropdownMenuSeparator() {
  return <div className="my-2 h-px bg-border" />
}


