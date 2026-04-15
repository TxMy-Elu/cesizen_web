"use client"

import { useSyncExternalStore } from "react"

import { SESSION_CHANGE, getSession } from "@/lib/auth/session"

let cachedSnapshot: ReturnType<typeof getSession> = null
let cachedRawSession = ""

const getSnapshot = () => {
  if (typeof window === "undefined") {
    return null
  }

  const rawSession = window.localStorage.getItem("cesizen.session") ?? ""
  if (rawSession === cachedRawSession) {
    return cachedSnapshot
  }

  cachedRawSession = rawSession
  cachedSnapshot = getSession()
  return cachedSnapshot
}

export function useSession() {
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )

  const session = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => undefined
      }

      window.addEventListener("storage", callback)
      window.addEventListener(SESSION_CHANGE, callback)

      return () => {
        window.removeEventListener("storage", callback)
        window.removeEventListener(SESSION_CHANGE, callback)
      }
    },
    getSnapshot,
    getSnapshot
  )

  return {
    session,
    ready,
  }
}

