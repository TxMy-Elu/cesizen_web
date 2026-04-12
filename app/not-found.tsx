import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center md:px-8">
      <p className="rounded-full border border-brand-sand-300 bg-brand-sand-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-dark/70">
        Erreur 404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Page introuvable</h1>
      <p className="max-w-lg text-sm leading-relaxed text-brand-dark/70 md:text-base">
        Cette page n&apos;existe pas ou a ete deplacee. Vous pouvez revenir a l&apos;accueil ou continuer vers une section utile.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href="/">Retour a l&apos;accueil</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/prevention">Consulter la prevention</Link>
        </Button>
      </div>
    </div>
  )
}
