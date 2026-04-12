"use client"

import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ResetMotDePassePage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Card className="border-surface-border bg-linear-to-br from-surface-strong via-brand-sage-50/60 to-brand-sand-50/70">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl">Reinitialiser le mot de passe</CardTitle>
          <CardDescription className="text-base">
            Parcours aligne avec l&apos;API : /api/auth/forgot-password, /api/auth/reset-password/validate et /api/auth/reset-password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Input id="email-reset" type="email" placeholder="utilisateur@example.com" />
          </div>

          <Button className="w-full" size="lg" onClick={() => setSubmitted(true)}>
            Envoyer le lien de reinitialisation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

