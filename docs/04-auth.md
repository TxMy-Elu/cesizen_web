# 🔑 04 - Authentification (Login, Register, Logout)

**Temps de lecture** : 12-15 minutes  
**Public cible** : Développeurs Frontend  
**Dernière mise à jour** : 21 Avril 2026

---

## 📋 Vue d'ensemble

| Système | Détail |
|---------|--------|
| **Type** | JWT (Bearer Token) |
| **Access Token** | 15 minutes (localStorage) |
| **Refresh Token** | 7 jours (httpOnly Cookie) |
| **Validation** | Zod + React Hook Form |
| **State** | Zustand store |
| **Protection routes** | Admin Guard component |

---

## 1️⃣ CONNEXION (Login)

### Route et composant

```
app/auth/connexion/page.tsx
```

### Formulaire de connexion

```typescript
// app/auth/connexion/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/auth/use-session"
import { apiRequest } from "@/lib/api/http-client"
import { toast } from "sonner"

// 🔒 Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(5, "Email trop court")
    .max(255, "Email trop long"),
    
  password: z
    .string()
    .min(6, "Min 6 caractères")
    .max(128, "Max 128 caractères"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: "user" | "admin"
    avatar?: string
  }
  expiresIn: number
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // 📤 Submit handler
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // 1️⃣ POST /api/auth/login
      const response = await apiRequest<LoginResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: data,
        }
      )

      // 2️⃣ Store tokens in Zustand
      setToken(response.accessToken)
      setUser(response.user)

      // 3️⃣ Store refresh token in cookies
      // (Backend le fait automatiquement avec Set-Cookie)

      // 4️⃣ Success toast
      toast.success("Bienvenue! 👋")
      
      // 5️⃣ Redirection
      reset()
      router.push("/profil")
      
    } catch (error) {
      console.error("Login error:", error)
      
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          toast.error("Email ou mot de passe incorrect")
        } else {
          toast.error(error.message || "Erreur connexion")
        }
      }
      
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Accédez à votre compte CESIZen
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@example.fr"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <a
              href="/auth/reset-mot-de-passe"
              className="text-xs text-primary hover:underline"
            >
              Oublié?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Pas de compte? </span>
        <a
          href="/auth/inscription"
          className="font-medium text-primary hover:underline"
        >
          Créer un compte
        </a>
      </div>
    </div>
  )
}
```

### Store Zustand pour l'auth

```typescript
// lib/auth/use-session.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  logout: () => void
  
  // Computed
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => {
        set({ user: null, token: null })
        // localStorage cleared automatically by persist
      },
      
      isAuthenticated: () => !!get().user && !!get().token,
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "auth-store",
      // Chiffrement optionnel pour localStorage
    }
  )
)

// Usage:
// const { user, token, logout, isAuthenticated } = useAuthStore()
```

### Intercepteur HTTP pour le token

```typescript
// lib/api/http-client.ts
import { useAuthStore } from "@/lib/auth/use-session"

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, isFormData = false } = options
  
  // 🔑 Récupérer token du store
  const { token, logout } = useAuthStore()
  
  const headers = new Headers()

  if (!isFormData) {
    headers.set("Content-Type", "application/json")
  }

  // 🔐 Ajouter Authorization header
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      credentials: "include", // Pour les cookies
    })

    const responseText = await response.text()
    let payload: unknown = null

    if (responseText) {
      try {
        payload = JSON.parse(responseText)
      } catch {
        payload = responseText
      }
    }

    // ❌ 401 Unauthorized -> Token expiré
    if (response.status === 401) {
      console.log("Token expiré, tentative refresh...")
      
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        // Retry original request
        return apiRequest<T>(path, options)
      } else {
        // Refresh échoué, logout
        logout()
        window.location.href = "/auth/connexion"
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
  } catch (error) {
    throw error
  }
}

// 🔄 Refresh token logic
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Send refresh token cookie
    })

    if (!response.ok) return false

    const data = await response.json() as { accessToken: string }
    
    const { setToken } = useAuthStore()
    setToken(data.accessToken)
    
    return true
  } catch (error) {
    console.error("Refresh failed:", error)
    return false
  }
}
```

---

## 2️⃣ INSCRIPTION (Register)

### Route et composant

```
app/auth/inscription/page.tsx
```

### Formulaire d'inscription

```typescript
// app/auth/inscription/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { apiRequest } from "@/lib/api/http-client"
import { useAuthStore } from "@/lib/auth/use-session"
import { toast } from "sonner"

// 🔒 Validation schema
const registerSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(5)
    .max(255),
    
  firstName: z
    .string()
    .min(1, "Prénom requis")
    .max(50),
    
  lastName: z
    .string()
    .min(1, "Nom requis")
    .max(50),
    
  password: z
    .string()
    .min(8, "Min 8 caractères")
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Nécessite: min 1 majuscule, 1 minuscule, 1 chiffre"
    ),
    
  confirmPassword: z.string(),
  
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Accepter les CGU" })
  }),
  
  dataConsent: z.literal(true, {
    errorMap: () => ({ message: "Consentement données requis" })
  }),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
)

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: "user"
  }
  accessToken: string
  refreshToken: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      const response = await apiRequest<RegisterResponse>(
        "/api/auth/register",
        {
          method: "POST",
          body: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            termsAccepted: data.termsAccepted,
            dataConsent: data.dataConsent,
          },
        }
      )

      // Store auth
      setToken(response.accessToken)
      setUser(response.user)
      
      toast.success("Compte créé! 🎉")
      reset()
      router.push("/profil")
      
    } catch (error) {
      console.error("Register error:", error)
      
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          toast.error("Cet email existe déjà")
        } else {
          toast.error(error.message || "Erreur inscription")
        }
      }
      
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">
          Rejoignez la communauté CESIZen
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@example.fr"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Prénom */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            Prénom
          </label>
          <Input
            id="firstName"
            placeholder="Jean"
            disabled={isLoading}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Nom
          </label>
          <Input
            id="lastName"
            placeholder="Dupont"
            disabled={isLoading}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmer mot de passe
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            disabled={isLoading}
            {...register("termsAccepted")}
          />
          <label htmlFor="terms" className="text-sm leading-tight">
            J'accepte les{" "}
            <a href="/mentions-legales" className="text-primary hover:underline">
              conditions d'utilisation
            </a>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>
        )}

        {/* Data consent checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            disabled={isLoading}
            {...register("dataConsent")}
          />
          <label htmlFor="consent" className="text-sm leading-tight">
            Je consens au traitement de mes données pour améliorer le service
          </label>
        </div>
        {errors.dataConsent && (
          <p className="text-xs text-destructive">{errors.dataConsent.message}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Création en cours..." : "Créer mon compte"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Déjà inscrit? </span>
        <a
          href="/auth/connexion"
          className="font-medium text-primary hover:underline"
        >
          Se connecter
        </a>
      </div>
    </div>
  )
}
```

---

## 3️⃣ DÉCONNEXION (Logout)

### Header avec logout button

```typescript
// components/app/site-header.tsx
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth/use-session"
import { toast } from "sonner"

export function SiteHeader() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      // Optional: Notify backend
      // await apiRequest("/api/auth/logout", { method: "POST" })
      
      // Clear state
      logout()
      
      // Clear storage
      localStorage.clear()
      
      toast.success("Au revoir! 👋")
      router.push("/")
      
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Erreur déconnexion")
    }
  }

  return (
    <header className="border-b">
      <nav className="flex items-center justify-between p-4">
        <h1 className="font-bold">CESIZen</h1>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.firstName} {user.lastName}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        ) : (
          <Button asChild>
            <a href="/auth/connexion">Connexion</a>
          </Button>
        )}
      </nav>
    </header>
  )
}
```

---

## 4️⃣ ROUTES PROTÉGÉES (Admin Guard)

### AdminGuard Component

```typescript
// components/app/admin-guard.tsx
"use client"

import { useAuthStore } from "@/lib/auth/use-session"
import { redirect } from "next/navigation"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()

  // ⚠️ This is client-side only!
  // Backend MUST also validate permissions
  
  if (!isAuthenticated() || user?.role !== "admin") {
    redirect("/auth/connexion")
  }

  return <>{children}</>
}
```

### Utilisation dans les pages

```typescript
// app/admin/page.tsx
import { AdminGuard } from "@/components/app/admin-guard"
import { AdminPanel } from "@/components/app/admin-panel"

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  )
}
```

---

## 5️⃣ PERSISTANCE DE SESSION

### Auto-restore on page reload

```typescript
// app/providers.tsx
"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth/use-session"
import { apiRequest } from "@/lib/api/http-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, token } = useAuthStore()

  // ✅ On app load, restore user from /api/auth/me
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) return

      try {
        const user = await apiRequest("/api/users/me")
        setUser(user)
      } catch (error) {
        console.error("Failed to restore session:", error)
        // Invalid token, user will be logged out
      }
    }

    restoreSession()
  }, [token, setUser])

  return <>{children}</>
}
```

### Layout wrapper

```typescript
// app/layout.tsx
import { Providers } from "./providers"
import { SiteHeader } from "@/components/app/site-header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

## 🔄 Exemple complet : Flux utilisateur

```
1. User accède app
   ↓
2. providers.tsx: useEffect() restore session
   ↓
3. Récupère token de localStorage
   ↓
4. POST /api/users/me avec token
   ↓
5. Backend retourne user data
   ↓
6. setUser() → state updated
   ↓
7. SiteHeader affiche user name
   ↓
8. User clique "Mon profil"
   ↓
9. GET /api/users/{id}
   ↓
10. Interceptor ajoute Authorization header
    ↓
11. Backend valide JWT
    ↓
12. Retourne données profil
    ↓
13. Page /profil affiche données
    ↓
14. User clique "Déconnexion"
    ↓
15. handleLogout() vidé localStorage + store
    ↓
16. Redirection /auth/connexion
    ↓
17. FIN
```

---

## 🧪 Testabilité

```typescript
// lib/auth/__tests__/use-session.test.ts
import { renderHook, act } from "@testing-library/react"
import { useAuthStore } from "../use-session"

describe("useAuthStore", () => {
  it("should login user", async () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setToken("token-123")
      result.current.setUser({
        id: "user-1",
        email: "test@example.fr",
        firstName: "Test",
        lastName: "User",
        role: "user",
      })
    })

    expect(result.current.isAuthenticated()).toBe(true)
    expect(result.current.user?.email).toBe("test@example.fr")
  })

  it("should logout user", () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated()).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
```

---

## 📋 Checklist intégration auth

```
✅ LOGIN PAGE:
☐ Formulaire email + password
☐ Validation Zod côté client
☐ POST /api/auth/login
☐ Token stocké localStorage
☐ RefreshToken en cookie
☐ Redirection /profil
☐ Toast success/error

✅ REGISTER PAGE:
☐ Formulaire complet (email, firstName, lastName, password)
☐ Password confirmation
☐ Terms acceptance checkbox
☐ Data consent checkbox
☐ Validation Zod (password strength)
☐ POST /api/auth/register
☐ Auto-login après signup
☐ Redirection /profil

✅ LOGOUT:
☐ Button dans header
☐ Effacer localStorage
☐ Effacer Zustand store
☐ Effacer cookies
☐ Redirection /

✅ PROTECTED ROUTES:
☐ AdminGuard component
☐ useAuthStore() check
☐ Redirect si non-auth
☐ Backend validation (important!)

✅ PERSISTENCE:
☐ localStorage survit refresh
☐ providers.tsx restore session
☐ POST /api/users/me appelé
☐ Headers Authorization ajouté
```

---

## 🔗 Voir aussi

- [03-security.md](./03-security.md) - Concepts JWT et sécurité
- [13-exemples-integration.md](./13-exemples-integration.md) - Code examples
- [12-composants.md](./12-composants.md) - Composants UI

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026

