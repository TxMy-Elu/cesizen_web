"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("rounded-2xl border border-border/60 bg-white p-3", className)}
      classNames={{
        month: "space-y-3",
        caption: "flex items-center justify-between pb-2",
        caption_label: "text-sm font-semibold",
        nav: "flex items-center gap-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-9 text-xs text-muted-foreground",
        row: "mt-2 flex w-full",
        cell: "w-9 text-center text-sm",
        day: "h-9 w-9 rounded-xl hover:bg-brand-sage-50",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary",
        day_today: "border border-brand-olive-300",
        day_outside: "text-muted-foreground/60",
        ...classNames,
      }}
      {...props}
    />
  )
}

