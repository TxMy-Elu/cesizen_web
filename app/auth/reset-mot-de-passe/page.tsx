"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api/services"
import { toast } from "sonner"

function ResetMotDePasseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const validateTokenQuery = useQuery({
    queryKey: ["auth", "reset-token", token],
    queryFn: () => authApi.validateResetToken(token),
    enabled: Boolean(token),
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setSubmitted(true)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Erreur lors de l'envoi"
      toast.error(message)
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Mot de passe reinitialise")
      router.push("/auth/connexion")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Reinitialisation impossible"
      toast.error(message)
    },
  })

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl">Reinitialiser le mot de passe</CardTitle>
          <CardDescription className="text-base">
            Parcours aligne avec l&apos;API : /api/auth/forgot-password, /api/auth/reset-password/validate et /api/auth/reset-password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {token ? (
            <>
              {validateTokenQuery.isLoading ? (
                <Alert variant="soft">
                  <AlertTitle>Verification du lien</AlertTitle>
                  <AlertDescription>Un instant, nous validons votre token de reinitialisation.</AlertDescription>
                </Alert>
              ) : null}

              {validateTokenQuery.error ? (
                <Alert variant="warning">
                  <AlertTitle>Lien invalide</AlertTitle>
                  <AlertDescription className="text-destructive">
                    {validateTokenQuery.error.message}
                  </AlertDescription>
                </Alert>
              ) : null}

              {validateTokenQuery.data && !validateTokenQuery.data.valid ? (
                <Alert variant="warning">
                  <AlertTitle>Lien invalide ou expiré</AlertTitle>
                  <AlertDescription className="text-destructive">
                    {validateTokenQuery.data.error ?? "Demandez un nouveau lien de reinitialisation."}
                  </AlertDescription>
                </Alert>
              ) : null}

              {validateTokenQuery.data?.valid ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark" htmlFor="new-password">
                      Nouveau mot de passe
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark" htmlFor="confirm-password">
                      Confirmer le mot de passe
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirmez le mot de passe"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={resetPasswordMutation.isPending}
                    onClick={() => {
                      if (!newPassword.trim() || !confirmPassword.trim()) {
                        toast.error("Tous les champs sont requis")
                        return
                      }
                      if (newPassword !== confirmPassword) {
                        toast.error("Les mots de passe ne correspondent pas")
                        return
                      }
                      resetPasswordMutation.mutate({ token, newPassword })
                    }}
                  >
                    {resetPasswordMutation.isPending ? "Reinitialisation..." : "Reinitialiser le mot de passe"}
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/reset-mot-de-passe">Demander un nouveau lien</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              {submitted ? (
                <Alert variant="soft">
                  <AlertTitle>Lien envoye</AlertTitle>
                  <AlertDescription>
                    Si l&apos;email existe, un lien de reinitialisation a ete envoye.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark" htmlFor="email-reset">
                  Email
                </label>
                <Input
                  id="email-reset"
                  type="email"
                  placeholder="utilisateur@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={forgotPasswordMutation.isPending}
                onClick={() => {
                  if (!email.trim()) {
                    toast.error("Email requis")
                    return
                  }
                  forgotPasswordMutation.mutate(email.trim())
                }}
              >
                {forgotPasswordMutation.isPending ? "Envoi..." : "Envoyer le lien de reinitialisation"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetMotDePassePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
          <Card className="border-surface-border bg-surface-strong shadow-soft">
            <CardContent className="py-8">
              <Alert variant="soft">
                <AlertTitle>Chargement</AlertTitle>
                <AlertDescription>Un instant, nous preparons la page.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetMotDePasseContent />
    </Suspense>
  )
}

