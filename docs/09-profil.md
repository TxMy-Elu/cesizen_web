# 👤 09 - Dashboard utilisateur (Profil)

**Temps de lecture** : 8 minutes | **Auth** : ✅ Requis | **Mise à jour** : 21 Avril 2026

---

## 📍 Route et access

```
/profil
Auth: REQUIRED (AdminGuard)
Propriétaire: Utilisateur connecté
```

---

## 🎯 Sections du dashboard

### 1️⃣ Header utilisateur
```
Bienvenue, Jean! 👋
Profile complete 67%

[Éditer profil] [Paramètres] [Déconnexion]
```

### 2️⃣ Stats principales (grid 4 colonnes)
```
Sessions complétées: 42
Temps total: 3h 30min
Cohérence moyenne: 78/100
Dernière session: Hier
```

### 3️⃣ Historique sessions (tableau)
```
| Date | Type | Durée | Score |
|------|------|-------|-------|
| 20 Apr | Respiration | 5 min | 78/100 |
| 19 Apr | Respiration | 5 min | 82/100 |
...
[Load more]
```

### 4️⃣ Paramètres utilisateur
```
Email: user@example.fr
Prénom: Jean
Nom: Dupont

[Éditer] [Changer mot de passe]
```

### 5️⃣ Préférences
```
☐ Notifications push
☐ Email notifications
Thème: [Light v] [Dark]
Langue: [Français v]
```

---

## 💻 Code exemple

```typescript
// app/profil/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth/use-session"
import { apiRequest } from "@/lib/api/http-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/app/stats-card"
import { AppointmentTimeline } from "@/components/app/appointment-timeline"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  
  stats: {
    sessionsCompleted: number
    totalMinutes: number
    averageCoherence: number
    lastSessionDate?: Date
  }
  
  recentSessions: Array<{
    id: string
    date: Date
    duration: number
    type: string
    score: number
  }>
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/connexion")
      return
    }

    fetchProfile()
  }, [user, token, router])

  const fetchProfile = async () => {
    try {
      const data = await apiRequest<UserProfile>("/api/users/me", {
        token,
      })
      setProfile(data)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Impossible de charger le profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("À bientôt!")
    router.push("/")
  }

  if (isLoading) return <div>Chargement...</div>
  if (!profile) return <div>Erreur chargement profil</div>

  return (
    <div className="space-y-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bienvenue, {profile.firstName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Profil complété à 67%
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Éditer profil</Button>
          <Button variant="outline">Paramètres</Button>
          <Button onClick={handleLogout}>Déconnexion</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          label="Sessions"
          value={profile.stats.sessionsCompleted}
          icon="🎯"
        />
        <StatsCard
          label="Temps total"
          value={`${Math.floor(profile.stats.totalMinutes / 60)}h ${profile.stats.totalMinutes % 60}min`}
          icon="⏱️"
        />
        <StatsCard
          label="Cohérence moyenne"
          value={`${profile.stats.averageCoherence}/100`}
          icon="📊"
        />
        <StatsCard
          label="Dernière session"
          value={profile.stats.lastSessionDate ? 
            new Date(profile.stats.lastSessionDate).toLocaleDateString("fr-FR") : 
            "—"
          }
          icon="📅"
        />
      </div>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentTimeline sessions={profile.recentSessions} />
          <Button variant="outline" className="w-full mt-4">
            Voir tout l'historique
          </Button>
        </CardContent>
      </Card>

      {/* User info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p>{profile.email}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <p>{profile.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Nom</label>
              <p>{profile.lastName}</p>
            </div>
          </div>
          <Button>Éditer ces informations</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Notifications push</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Email notifications</span>
          </label>
          <div>
            <label className="text-sm font-medium">Thème</label>
            <select className="w-full mt-2 p-2 border rounded">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zone danger</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 📊 Components

```
StatsCard - Affiche une stat avec label
AppointmentTimeline - Timeline des sessions
ProfilePreview - Aperçu compact
```

---

## 📋 API Endpoints

```
GET /api/users/me                    → Profil courant
PUT /api/users/{id}                  → Maj profil
GET /api/sessions                    → Historique sessions
POST /api/users/{id}/delete          → Supprimer compte
POST /api/users/{id}/change-password → Changer password
```

---

## 📱 Responsive

- Mobile: 1 colonne (stack vertical)
- Tablet: 2 colonnes (stats 2x2)
- Desktop: 4 colonnes (stats linéaire)

---

**Voir aussi**: [07-respiration.md](./07-respiration.md) | [04-auth.md](./04-auth.md)

**Version** : 1.0.0 | **Mise à jour** : 21 Avril 2026

