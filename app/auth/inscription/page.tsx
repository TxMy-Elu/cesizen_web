"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function InscriptionPage() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  })
  const [consent, setConsent] = useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nom || !form.prenom || !form.email || !form.password) {
      toast.error("Tous les champs sont requis")
      return
    }
    if (!consent) {
      toast.error("Consentement RGPD obligatoire")
      return
    }
    toast.success("Compte cree en mode simulation", {
      description: `Bienvenue ${form.prenom}`,
    })
    setForm({ nom: "", prenom: "", email: "", password: "" })
    setConsent(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="border-surface-border bg-linear-to-br from-surface-strong via-brand-sage-50/60 to-brand-sand-50/70">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl">Inscription</CardTitle>
          <CardDescription className="text-base">
            Créez votre compte pour activer le suivi personnel à long terme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-dark" htmlFor="nom">Nom</label>
              <Input
                id="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={(event) => setForm((prev) => ({ ...prev, nom: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brand-dark" htmlFor="prenom">Prénom</label>
              <Input
                id="prenom"
                placeholder="Prénom"
                value={form.prenom}
                onChange={(event) => setForm((prev) => ({ ...prev, prenom: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-dark" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="utilisateur@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-dark" htmlFor="password">Mot de passe</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Le mot de passe est haché avant stockage côté serveur.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border/75 bg-surface-strong px-4 py-3 text-sm text-foreground shadow-subtle">
            <Checkbox
              className="mt-0.5"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              J&apos;accepte explicitement le stockage de mes données de santé pour le
              suivi, conformément au RGPD.
            </span>
          </label>

          <Button className="w-full" size="lg" type="submit">
            Créer mon compte
          </Button>

          <p className="text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/auth/connexion" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
