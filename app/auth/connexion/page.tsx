"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api/services"
import { saveSession } from "@/lib/auth/session"
import { toast } from "sonner"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      saveSession(data)
      toast.success("Connexion reussie", {
        description: `Bienvenue ${data.prenom}`,
      })
      router.push(data.role === "ROLE_ADMIN" ? "/admin" : "/profil")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Connexion impossible"
      toast.error(message)
    },
  })

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error("Email et mot de passe requis")
      return
    }
    loginMutation.mutate({
      email: email.trim(),
      password,
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl">Connexion</CardTitle>
          <CardDescription className="text-base">
            Accédez à votre espace de suivi personnel sécurisé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-dark" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="utilisateur@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-dark" htmlFor="password">Mot de passe</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <Link href="/auth/inscription" className="text-primary hover:underline">Créer un compte</Link>
            <Link href="/auth/reset-mot-de-passe" className="text-muted-foreground hover:text-foreground">Mot de passe oublié</Link>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
