const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  token?: string | null
  isFormData?: boolean
}

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

const extractErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload) {
    return fallback
  }

  if (typeof payload === "string") {
    return payload
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (typeof record.error === "string") {
      return record.error
    }
    const firstValue = Object.values(record)[0]
    if (typeof firstValue === "string") {
      return firstValue
    }
  }

  return fallback
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = options
  const headers = new Headers()

  if (!isFormData) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? (body as BodyInit) : JSON.stringify(body)) : undefined,
    cache: "no-store",
  })

  if (response.status === 204) {
    return undefined as T
  }

  const responseText = await response.text()
  let payload: unknown = null

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as unknown
    } catch {
      payload = responseText
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Erreur API (${response.status})`),
      response.status,
      payload
    )
  }

  return payload as T
}

