"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

type TabsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

function Tabs({ value, defaultValue, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const currentValue = value ?? internalValue

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [onValueChange, value]
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs>")
  }
  return context
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center rounded-xl border border-border/70 bg-surface p-1 shadow-subtle", className)}
      {...props}
    />
  )
}

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const context = useTabsContext()
  const isActive = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => context.setValue(value)}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "border border-border/70 bg-surface-strong text-brand-dark shadow-subtle"
          : "text-muted-foreground hover:bg-brand-sage-50/60 hover:text-brand-dark",
        className
      )}
      {...props}
    />
  )
}

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
}

function TabsContent({ className, value, ...props }: TabsContentProps) {
  const context = useTabsContext()
  if (context.value !== value) {
    return null
  }

  return <div role="tabpanel" className={cn("mt-4", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
