import type { AuthResponse, RoleValue } from "@/lib/api/contracts"

const SESSION_STORAGE_KEY = "cesizen.session"
const SESSION_CHANGE_EVENT = "cesizen:sessionchange"

type SessionData = {
  token: string
  userId: number
  email: string
  nom: string
  prenom: string
  role: RoleValue
}

const isBrowser = () => typeof window !== "undefined"

const emitSessionChange = () => {
  if (!isBrowser()) {
    return
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export const saveSession = (auth: AuthResponse) => {
  if (!isBrowser()) {
    return
  }

  const payload: SessionData = {
    token: auth.token,
    userId: auth.userId,
    email: auth.email,
    nom: auth.nom,
    prenom: auth.prenom,
    role: auth.role,
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
  emitSessionChange()
}

export const getSession = (): SessionData | null => {
  if (!isBrowser()) {
    return null
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SessionData
  } catch {
    return null
  }
}

export const clearSession = () => {
  if (!isBrowser()) {
    return
  }
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
  emitSessionChange()
}


export const SESSION_CHANGE = SESSION_CHANGE_EVENT

