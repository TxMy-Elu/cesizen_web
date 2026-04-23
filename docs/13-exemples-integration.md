# 🔗 13 - Exemples d'intégration API

**Temps de lecture** : 20-25 minutes | **Public** : Développeurs Frontend | **Mise à jour** : 21 Avril 2026

---

## 📡 Configuration du client HTTP

### Client HTTP personnalisé (fetch-based)

```typescript
// lib/api/http-client.ts
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
      payload = JSON.parse(responseText)
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
```

**Variables d'environnement**:
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## 🔐 Authentification & Gestion des tokens

### Hook personnalisé pour l'authentification

```typescript
// lib/auth/use-session.ts
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "@/lib/api/services"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/api/contracts"

interface AuthState {
  user: AuthResponse | null
  token: string | null
  isLoading: boolean
  error: string | null

  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(credentials)
          set({
            user: response,
            token: response.token,
            isLoading: false
          })
          // Redirection après login réussi
          window.location.href = "/profil"
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur de connexion",
            isLoading: false
          })
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(userData)
          set({
            user: response,
            token: response.token,
            isLoading: false
          })
          window.location.href = "/profil"
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur d'inscription",
            isLoading: false
          })
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null })
        window.location.href = "/auth/connexion"
      },

      isAuthenticated: () => {
        const { token } = get()
        return !!token
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
```

### Utilisation dans un composant

```tsx
// app/auth/connexion/page.tsx
"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth/use-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## 📚 Gestion des articles

### Récupération de la liste des articles

```tsx
// components/app/article-list.tsx
"use client"

import { useEffect, useState } from "react"
import { articleApi } from "@/lib/api/services"
import { useAuthStore } from "@/lib/auth/use-session"
import { ArticleCard } from "@/components/app/article-card"
import type { ArticleDto } from "@/lib/api/contracts"

export function ArticleList() {
  const { token, isAuthenticated } = useAuthStore()
  const [articles, setArticles] = useState<ArticleDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = isAuthenticated() && token
          ? await articleApi.list()
          : await articleApi.listPublic()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [token, isAuthenticated])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.idArticle} article={article} />
      ))}
    </div>
  )
}
```

### Création d'un article (Admin)

```tsx
// app/admin/contenus/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth/use-session"
import { articleApi, categorieApi } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CategorieDto } from "@/lib/api/contracts"

export default function CreateArticlePage() {
  const { token } = useAuthStore()
  const [categories, setCategories] = useState<CategorieDto[]>([])
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    typeMedia: "TEXT",
    mediaUrl: "",
    estPublie: false,
    idCategorie: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return
      try {
        const data = await categorieApi.list()
        setCategories(data)
      } catch (err) {
        setError("Erreur chargement catégories")
      }
    }
    fetchCategories()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      await articleApi.create(formData, token)
      // Redirection ou message de succès
      alert("Article créé avec succès!")
      setFormData({
        titre: "",
        contenu: "",
        typeMedia: "TEXT",
        mediaUrl: "",
        estPublie: false,
        idCategorie: 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <Input
        placeholder="Titre de l'article"
        value={formData.titre}
        onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
        required
      />
      <Textarea
        placeholder="Contenu de l'article"
        value={formData.contenu}
        onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
        required
      />
      <Select
        value={formData.idCategorie.toString()}
        onValueChange={(value) => setFormData({ ...formData, idCategorie: parseInt(value) })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.idCategorie} value={cat.idCategorie.toString()}>
              {cat.libelle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="estPublie"
          checked={formData.estPublie}
          onChange={(e) => setFormData({ ...formData, estPublie: e.target.checked })}
        />
        <label htmlFor="estPublie">Publier immédiatement</label>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Création..." : "Créer l'article"}
      </Button>
    </form>
  )
}
```

---

## 🫁 Gestion des exercices de respiration

### Liste des exercices disponibles

```tsx
// app/respiration/page.tsx
"use client"

import { useEffect, useState } from "react"
import { exerciceApi } from "@/lib/api/services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ExerciceDto } from "@/lib/api/contracts"

export default function RespirationPage() {
  const [exercices, setExercices] = useState<ExerciceDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExercice, setSelectedExercice] = useState<ExerciceDto | null>(null)

  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const data = await exerciceApi.list()
        setExercices(data)
      } catch (error) {
        console.error("Erreur chargement exercices:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchExercices()
  }, [])

  const startExercice = (exercice: ExerciceDto) => {
    setSelectedExercice(exercice)
    // Logique de démarrage du timer
  }

  if (loading) return <div>Chargement des exercices...</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Exercices de respiration</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {exercices.map((exercice) => (
          <Card key={exercice.idExercice}>
            <CardHeader>
              <CardTitle>{exercice.nom}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{exercice.description}</p>
              <div className="text-sm text-gray-600 mb-4">
                <p>Inspiration: {exercice.dureeInspiration}s</p>
                <p>Apnée: {exercice.dureeApnee}s</p>
                <p>Expiration: {exercice.dureeExpiration}s</p>
              </div>
              <Button onClick={() => startExercice(exercice)}>
                Commencer l'exercice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### Enregistrement d'une session d'exercice

```tsx
// hooks/use-exercice-session.ts
import { useState } from "react"
import { exercerApi } from "@/lib/api/services"
import { useAuthStore } from "@/lib/auth/use-session"
import type { ExercerCreateDto } from "@/lib/api/contracts"

export function useExerciceSession() {
  const { token, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeExercice = async (exerciceId: number) => {
    if (!token || !user) {
      setError("Utilisateur non authentifié")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload: ExercerCreateDto = {
        userId: user.userId,
        exerciceId,
        completedAt: new Date().toISOString(),
      }
      await exercerApi.create(payload, token)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return { completeExercice, loading, error }
}
```

---

## 📤 Upload de fichiers

### Upload d'image pour article

```tsx
// components/admin/file-upload.tsx
"use client"

import { useState, useRef } from "react"
import { articleApi } from "@/lib/api/services"
import { useAuthStore } from "@/lib/auth/use-session"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onUploadSuccess: (url: string, filename: string) => void
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { token } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token) return

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      setError("Seules les images sont acceptées")
      return
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 5MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const response = await articleApi.upload(file, token)
      onUploadSuccess(response.url, response.filename)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Upload en cours..." : "Choisir une image"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
```

---

## ❌ Gestion des erreurs

### Hook de gestion d'erreurs global

```typescript
// hooks/use-api-error.ts
import { useState } from "react"
import { ApiError } from "@/lib/api/http-client"

export function useApiError() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      switch (err.status) {
        case 400:
          setError("Données invalides. Vérifiez vos informations.")
          break
        case 401:
          setError("Session expirée. Veuillez vous reconnecter.")
          // Redirection vers login
          window.location.href = "/auth/connexion"
          break
        case 403:
          setError("Accès refusé. Vous n'avez pas les permissions nécessaires.")
          break
        case 404:
          setError("Ressource non trouvée.")
          break
        case 409:
          setError("Conflit de données. Cette action n'est pas possible.")
          break
        case 500:
          setError("Erreur serveur. Réessayez plus tard.")
          break
        default:
          setError(err.message)
      }
    } else {
      setError("Une erreur inattendue s'est produite.")
    }
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
}
```

### Utilisation dans un composant

```tsx
// components/common/error-toast.tsx
"use client"

import { useEffect } from "react"
import { useApiError } from "@/hooks/use-api-error"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ErrorToastProps {
  error: unknown
  onClear?: () => void
}

export function ErrorToast({ error, onClear }: ErrorToastProps) {
  const { error: errorMessage, handleError, clearError } = useApiError()

  useEffect(() => {
    if (error) {
      handleError(error)
    }
  }, [error, handleError])

  useEffect(() => {
    if (errorMessage && onClear) {
      const timer = setTimeout(onClear, 5000) // Auto-clear après 5s
      return () => clearTimeout(timer)
    }
  }, [errorMessage, onClear])

  if (!errorMessage) return null

  return (
    <Alert variant="destructive" className="fixed top-4 right-4 z-50 max-w-md">
      <AlertDescription>{errorMessage}</AlertDescription>
      <button
        onClick={() => {
          clearError()
          onClear?.()
        }}
        className="absolute top-2 right-2 text-sm"
      >
        ✕
      </button>
    </Alert>
  )
}
```

---

## ✅ Validation de formulaires

### Validation avec React Hook Form + Zod

```typescript
// validations/auth.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
})

export const registerSchema = z.object({
  nom: z.string().min(2, "Nom trop court"),
  prenom: z.string().min(2, "Prénom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe d'au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
```

### Formulaire d'inscription avec validation

```tsx
// app/auth/inscription/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/lib/auth/use-session"
import { registerSchema, type RegisterFormData } from "@/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorToast } from "@/components/common/error-toast"

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore()
  const [apiError, setApiError] = useState<unknown>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null)
      await registerUser({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      setApiError(error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Prénom"
              {...register("prenom")}
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Nom"
              {...register("nom")}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Mot de passe"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
        <ErrorToast error={apiError} onClear={() => setApiError(null)} />
      </CardContent>
    </Card>
  )
}
```

---

## 📊 Statistiques utilisateur

### Récupération des statistiques

```tsx
// app/profil/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth/use-session"
import { exercerApi, consulterApi } from "@/lib/api/services"
import { StatsCard } from "@/components/app/stats-card"

export default function ProfilePage() {
  const { token, user } = useAuthStore()
  const [stats, setStats] = useState({
    exercicesCompletes: 0,
    articlesConsultes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!token || !user) return

      try {
        const [exercices, consultations] = await Promise.all([
          exercerApi.byUser(user.userId, token),
          consulterApi.countByUser(user.userId, token),
        ])

        setStats({
          exercicesCompletes: exercices.length,
          articlesConsultes: consultations.articlesConsultes,
        })
      } catch (error) {
        console.error("Erreur chargement stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token, user])

  if (loading) return <div>Chargement du profil...</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          label="Exercices complétés"
          value={stats.exercicesCompletes}
          icon="🫁"
        />
        <StatsCard
          label="Articles consultés"
          value={stats.articlesConsultes}
          icon="📚"
        />
      </div>
    </div>
  )
}
```

---

## 🔄 Synchronisation des données

### Hook de synchronisation optimiste

```typescript
// hooks/use-optimistic-update.ts
import { useState, useCallback } from "react"

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (newData: T) => {
    setIsUpdating(true)
    setError(null)

    // Mise à jour optimiste
    const previousData = data
    setData(newData)

    try {
      const result = await updateFn(newData)
      setData(result) // Synchronisation avec la réponse serveur
    } catch (err) {
      // Rollback en cas d'erreur
      setData(previousData)
      setError(err instanceof Error ? err.message : "Erreur de mise à jour")
    } finally {
      setIsUpdating(false)
    }
  }, [data, updateFn])

  return { data, update, isUpdating, error }
}
```

### Exemple d'utilisation pour les paramètres utilisateur

```tsx
// components/profile/settings-form.tsx
"use client"

import { useAuthStore } from "@/lib/auth/use-session"
import { userApi } from "@/lib/api/services"
import { useOptimisticUpdate } from "@/hooks/use-optimistic-update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserDto } from "@/lib/api/contracts"

interface SettingsFormProps {
  user: UserDto
}

export function SettingsForm({ user }: SettingsFormProps) {
  const { token } = useAuthStore()

  const { data: userData, update, isUpdating, error } = useOptimisticUpdate(
    user,
    async (updatedUser) => {
      if (!token) throw new Error("Non authentifié")
      return await userApi.update(updatedUser.id, {
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
      }, token)
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    update({
      ...userData,
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      email: formData.get("email") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="prenom" defaultValue={userData.prenom} required />
      <Input name="nom" defaultValue={userData.nom} required />
      <Input name="email" type="email" defaultValue={userData.email} required />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Mise à jour..." : "Mettre à jour"}
      </Button>
    </form>
  )
}
```

---

## 📋 Checklist d'intégration

```
✅ Configuration client HTTP (fetch-based)
✅ Gestion des tokens JWT
✅ Authentification (login/register/logout)
✅ Gestion des erreurs (ApiError, toasts)
✅ Validation formulaires (Zod + React Hook Form)
✅ CRUD articles (liste, création, modification)
✅ Gestion exercices (liste, sessions)
✅ Upload de fichiers (images)
✅ Statistiques utilisateur
✅ Synchronisation optimiste
✅ Hooks personnalisés réutilisables
```

---

**Voir aussi**: [04-auth.md](./04-auth.md) | [14-deployment.md](./14-deployment.md)

**Version** : 1.0.0 | **Mise à jour** : 21 Avril 2026</content>
<parameter name="filePath">C:\Users\Elio\Documents\GitHub\cesizen_web\docs\13-exemples-integration.md
