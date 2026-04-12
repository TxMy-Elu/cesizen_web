"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { primaryNavigation } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-transparent px-3 pt-3 md:px-6">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 rounded-3xl border border-surface-border bg-surface px-4 py-3 shadow-soft backdrop-blur-xl md:px-6">
        <Link href="/" className="group inline-flex items-center gap-2 justify-self-start">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-sage-100 text-sm font-bold text-brand-dark transition-colors group-hover:bg-brand-sage-200">
            CZ
          </span>
          <span className="text-sm font-bold tracking-wide text-brand-dark group-hover:text-primary">
            CESIZEN
          </span>
        </Link>

        <nav
          className="hidden items-center justify-self-center rounded-full border border-border/75 bg-surface-muted p-1 shadow-subtle md:inline-flex"
          aria-label="Navigation principale"
        >
          {primaryNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full border border-transparent px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#548068] text-white shadow-subtle"
                    : "text-brand-dark/75 hover:border-[#6ba382] hover:bg-[#6ba382] hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <span className="hidden rounded-full border border-border/75 bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:inline-flex">
            Mode admin
          </span>
          <Button asChild size="sm" variant="zen" className="hidden md:inline-flex">
            <Link href="/respiration">Mode respiration</Link>
          </Button>
          <Button asChild size="sm" variant="destructive">
            <Link href="tel:112">Urgence 112</Link>
          </Button>
        </div>
      </div>

      <nav
        className="mx-auto mt-2 flex w-full max-w-7xl items-center gap-2 overflow-x-auto rounded-2xl border border-border/75 bg-surface px-3 py-2 shadow-subtle backdrop-blur md:hidden"
        aria-label="Navigation mobile"
      >
        {primaryNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
               className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                 isActive
                  ? "border-transparent bg-[#548068] text-white shadow-subtle"
                  : "border-border/70 bg-surface-strong text-brand-dark/75 hover:border-[#6ba382] hover:bg-[#6ba382] hover:text-white"
               )}
             >
               {item.label}
             </Link>
          )
        })}
      </nav>
    </header>
  )
}
