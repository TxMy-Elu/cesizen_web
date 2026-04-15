"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { clearSession } from "@/lib/auth/session"
import { useSession } from "@/lib/auth/use-session"
import { legalNavigation, secondaryNavigation } from "@/lib/navigation"

const emergencyLines = [
  { label: "SAMU", number: "15" },
  { label: "Urgences Europe", number: "112" },
  { label: "Prévention suicide", number: "3114" },
]

export function SiteFooter() {
  const router = useRouter()
  const { session, ready } = useSession()
  const isAuthenticated = ready && Boolean(session)

  const logout = () => {
    clearSession()
    router.push("/")
  }

  const accountLinks = isAuthenticated
    ? [
        { label: "Mon profil", href: "/profil" },
        { label: "Contact", href: "/contact" },
      ]
    : secondaryNavigation

  return (
    <footer className="border-t border-border/70 bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <section className="space-y-4">
          <p className="text-sm font-bold tracking-wide text-brand-dark">CESIZEN</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Plateforme de respiration et de prévention conçue pour agir vite,
            rassurer et accompagner chaque citoyen, y compris en contexte de stress.
          </p>
          <p className="text-xs text-muted-foreground">
            RGAA, anonymat visiteur et accès d&apos;urgence prioritaire.
          </p>
        </section>

        <nav className="space-y-3" aria-label="Ressources utiles">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ressources
          </p>
          <div className="flex flex-col gap-2">
            {accountLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button
                type="button"
                variant="link"
                className="h-auto w-fit justify-start px-0 text-sm text-foreground/80 hover:text-primary"
                onClick={logout}
              >
                Déconnexion
              </Button>
            ) : null}
          </div>
        </nav>

        <nav className="space-y-3" aria-label="Liens légaux">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Légal
          </p>
          <div className="flex flex-col gap-2">
            {legalNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Lignes d&apos;urgence
            </p>
            {emergencyLines.map((line) => (
              <Link
                key={line.number}
                href={`tel:${line.number}`}
                className="flex items-center justify-between rounded-lg border border-border/75 bg-surface-strong px-3 py-2 text-sm shadow-subtle transition-colors hover:border-brand-olive-300"
              >
                <span className="text-foreground/80">{line.label}</span>
                <span className="font-bold text-brand-dark">{line.number}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} CESIZEN. Tous droits réservés.</p>
          <p>Interface conçue pour l&apos;accessibilité RGAA, la confidentialité et la santé mentale.</p>
        </div>
      </div>
    </footer>
  )
}
