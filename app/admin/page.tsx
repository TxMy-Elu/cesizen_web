import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "Statistiques globales",
    description: "Suivez les indicateurs agrégés et anonymisés de la plateforme.",
    href: "/admin/statistiques",
  },
  {
    title: "Gestion des contenus",
    description: "Publiez, modifiez et dépubliez les ressources de prévention.",
    href: "/admin/contenus",
  },
  {
    title: "Utilisateurs & conformité",
    description: "Gérez les rôles et les demandes RGPD (droit à l'oubli).",
    href: "/admin/utilisateurs",
  },
]

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl md:text-4xl">Back-office CESIZEN</CardTitle>
          <CardDescription className="text-base">
            Tableau de pilotage ministère avec accès rapide aux fonctions métier.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((item) => {
          const isPrimary = item.href === "/admin/statistiques"

          return (
            <Card
              key={item.href}
              className="h-full border-border/75 bg-surface-strong transition-all hover:-translate-y-1 hover:border-brand-olive-300 hover:shadow-soft"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl text-brand-dark">{item.title}</CardTitle>
                  {isPrimary ? <Badge variant="secondary">Recommande</Badge> : null}
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href={item.href}>
                    <span>Ouvrir la section</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
