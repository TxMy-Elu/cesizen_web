"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "@/lib/auth/use-session"

type AdminGuardProps = {
  children: React.ReactNode
}

function AccessDenied() {
  return (
    <div className="mx-auto flex w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="w-full border-destructive/25 bg-linear-to-br from-white to-brand-sand-50/50 shadow-soft">
        <CardHeader className="space-y-3">
          <p className="w-fit rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-destructive">
            Accès refusé
          </p>
          <CardTitle className="text-3xl md:text-4xl">Vous n&apos;êtes pas autorisé</CardTitle>
          <CardDescription className="text-base">
            Cette zone est réservée aux administrateurs de la solution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Si vous pensez voir cette page par erreur, reconnectez-vous avec un compte administrateur.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/connexion">Se connecter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingAccess() {
  return (
    <div className="mx-auto flex w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="w-full border-border/70 bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <p className="w-fit rounded-full bg-brand-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Vérification
          </p>
          <CardTitle className="text-3xl md:text-4xl">Chargement de votre session</CardTitle>
          <CardDescription className="text-base">
            Nous vérifions votre accès avant d&apos;ouvrir le back-office.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { session, ready } = useSession()

  if (!ready) {
    return <LoadingAccess />
  }

  if (!session || session.role !== "ROLE_ADMIN") {
    return <AccessDenied />
  }

  return children
}

