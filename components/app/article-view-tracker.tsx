"use client"

import { useEffect, useRef } from "react"

import { consulterApi } from "@/lib/api/services"
import { useSession } from "@/lib/auth/use-session"

type ArticleViewTrackerProps = {
  articleId: number
}

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  const trackedRef = useRef(false)
  const { session, ready } = useSession()

  useEffect(() => {
    if (!ready || trackedRef.current || !session?.token || !session.userId) {
      return
    }

    trackedRef.current = true

    consulterApi
      .create(
        {
          idUtilisateur: session.userId,
          idArticle: articleId,
        },
        session.token
      )
      .catch(() => {
        // Tracking errors are intentionally non-blocking for the reading experience.
      })
  }, [articleId, ready, session])

  return null
}

