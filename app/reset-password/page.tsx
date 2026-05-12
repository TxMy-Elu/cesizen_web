"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function RedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const target = token
      ? `/auth/reset-mot-de-passe?token=${token}`
      : "/auth/reset-mot-de-passe"
    router.replace(target)
  }, [router, token])

  return null
}

export default function ResetPasswordRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  )
}
