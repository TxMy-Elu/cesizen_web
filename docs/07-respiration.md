# 🌬️ 07 - Module respiration guidée

**Temps de lecture** : 10-12 minutes  
**Public cible** : Développeurs, Designers  
**Dernière mise à jour** : 21 Avril 2026

---

## 📍 Route

```
/respiration
Fichier: app/respiration/page.tsx
Type: Dynamic content
Auth requis: Non ✅
```

---

## 🎯 Fonctionnalités principales

```
1. 🎯 Session guidée
   - Timer visible
   - Instructions étape par étape
   - Minuteur cohérence cardiaque
   
2. 📊 Métriques (optionnel)
   - Rythme cardiaque moyen
   - Cohérence score (0-100)
   - Temps total
   
3. 📝 Feedback post-session
   - Rating (1-5 stars)
   - Notes utilisateur
   - Sauvegarde du suivi
   
4. 🔄 Repeat / Dashboard
   - Relancer session
   - Voir historique (si connecté)
```

---

## ⏱️ Étapes d'une session

```
ÉTAPE 1: START
  "Nous commençons une session de 5 minutes"
  [Commencer] button
         ↓

ÉTAPE 2: INHALE (5 sec)
  ▓▓▓ Circle grossit
  "Inspiration... 5"
         ↓

ÉTAPE 3: HOLD (5 sec)
  ▓▓▓ Circle stable
  "Retenez... 5"
         ↓

ÉTAPE 4: EXHALE (5 sec)
  ▓▓▓ Circle rétrécit
  "Expiration... 5"
         ↓

(REPEAT 25 fois pour 5 min)
         ↓

ÉTAPE 5: COMPLETE
  "Session terminée! Bien joué 👏"
  [Évaluer] [Relancer] [Retour]
```

---

## 🎨 Layout respiration

```
┌────────────────────────────────────┐
│  CESIZen                    ← X    │
├────────────────────────────────────┤
│                                    │
│           Respiration guidée       │
│           Session 1/1              │
│                                    │
│         ┌──────────────────┐       │
│         │                  │       │
│         │      ▓▓▓        │       │ ← Animated circle
│         │   (grossit/rétrécit)   │
│         │                  │       │
│         │                  │       │
│         └──────────────────┘       │
│                                    │
│  Inspiration... 5                  │
│  (ou "Retenez..." ou "Expiration")│
│                                    │
│  ⏱️ 1:45 / 5:00                    │
│  [████░░░░░░░░░░░░] 35%            │
│                                    │
│  Étape: 7/25                       │
│                                    │
│         [Pause]                    │
│                                    │
└────────────────────────────────────┘
```

---

## 💻 Composants utilisés

| Composant | Usage |
|-----------|-------|
| `motion` (Framer) | Animate circle |
| `Timer` (custom) | Countdown logic |
| `Progress` (custom) | Progress bar |
| `Card` | Container |
| `Button` | Controls |

---

## 🎬 Code exemple (simplifié)

```typescript
// app/respiration/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth/use-session"
import { apiRequest } from "@/lib/api/http-client"
import { toast } from "sonner"

type PhaseType = "idle" | "inhale" | "hold" | "exhale"

interface SessionMetrics {
  duration: number
  completedCycles: number
  startTime: Date
  endTime?: Date
}

export default function RespirationPage() {
  const { user, token } = useAuthStore()
  
  // État principal
  const [phase, setPhase] = useState<PhaseType>("idle")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [totalCycles] = useState(25) // 5 min = 25 cycles
  const [isRunning, setIsRunning] = useState(false)
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null)
  
  // Timers et phases
  const PHASE_DURATIONS = {
    inhale: 5,
    hold: 5,
    exhale: 5,
  }
  
  // Cycle management
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          moveToNextPhase()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isRunning, phase])
  
  const moveToNextPhase = () => {
    const phases: PhaseType[] = ["inhale", "hold", "exhale"]
    const currentIndex = phases.indexOf(phase as PhaseType)
    
    if (currentIndex === -1) {
      // Start first phase
      setPhase("inhale")
      setSecondsLeft(PHASE_DURATIONS.inhale)
      return
    }
    
    if (currentIndex === phases.length - 1) {
      // Complete cycle
      setCurrentCycle((prev) => {
        if (prev + 1 >= totalCycles) {
          // Session complete!
          finishSession()
          return prev
        }
        return prev + 1
      })
      setPhase("inhale")
      setSecondsLeft(PHASE_DURATIONS.inhale)
    } else {
      // Next phase
      const nextPhase = phases[currentIndex + 1]
      setPhase(nextPhase)
      setSecondsLeft(PHASE_DURATIONS[nextPhase])
    }
  }
  
  const startSession = () => {
    setIsRunning(true)
    setPhase("inhale")
    setSecondsLeft(PHASE_DURATIONS.inhale)
    setCurrentCycle(0)
    setMetrics({
      duration: totalCycles * 15, // 15 sec par cycle
      completedCycles: 0,
      startTime: new Date(),
    })
  }
  
  const pauseSession = () => {
    setIsRunning(!isRunning)
  }
  
  const finishSession = async () => {
    setIsRunning(false)
    
    // Save session if authenticated
    if (user && token) {
      try {
        await apiRequest("/api/sessions", {
          method: "POST",
          token,
          body: {
            type: "breathing",
            duration: (totalCycles * 15),
            metrics: {
              completedCycles: totalCycles,
              coherenceScore: 75, // Mock score
            },
          },
        })
        toast.success("Session sauvegardée! ✨")
      } catch (error) {
        console.error("Failed to save session:", error)
      }
    }
  }
  
  // Animated circle scale based on phase
  const circleScale = {
    idle: 1,
    inhale: 1.2,
    hold: 1.2,
    exhale: 0.8,
  }
  
  // Phase labels
  const phaseLabel = {
    idle: "Prêt?",
    inhale: "Inspiration",
    hold: "Retenez",
    exhale: "Expiration",
  }
  
  // Percentage progress
  const progress = (currentCycle / totalCycles) * 100
  
  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Respiration guidée</h1>
        <p className="text-sm text-muted-foreground">
          Session de 5 minutes
        </p>
      </div>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-8 py-12">
          {/* Animated circle */}
          <motion.div
            animate={{ scale: circleScale[phase] }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
          >
            <span className="text-3xl font-bold text-white">
              {secondsLeft}
            </span>
          </motion.div>
          
          {/* Phase label */}
          <div className="text-center">
            <p className="text-lg font-semibold">
              {phaseLabel[phase]}...
            </p>
            <p className="text-sm text-muted-foreground">
              {secondsLeft} secondes
            </p>
          </div>
          
          {/* Timer display */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cycle {currentCycle + 1} / {totalCycles}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            {phase === "idle" ? (
              <Button onClick={startSession} size="lg">
                Commencer
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseSession}
                  variant={isRunning ? "default" : "outline"}
                  size="lg"
                >
                  {isRunning ? "Pause" : "Reprendre"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Info box */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
        <p>
          <strong>💡 Conseil:</strong> La respiration 5-5-5 aide à synchroniser
          votre rythme cardiaque pour plus de calme et de clarté.
        </p>
      </div>
    </div>
  )
}
```

---

## 📊 Sauvegarde des sessions

### Session entity

```typescript
interface Session {
  id: string
  userId?: string              // Optional (non-authenticated)
  
  type: "breathing"
  duration: number             // En secondes
  startedAt: Date
  endedAt: Date
  
  // Métriques
  metrics?: {
    completedCycles: number
    coherenceScore?: number
    stressLevel?: number
  }
  
  // User feedback
  userRating?: number          // 1-5
  feedback?: string
}
```

### API endpoint

```
POST /api/sessions
```

**Body** :
```json
{
  "type": "breathing",
  "duration": 300,
  "metrics": {
    "completedCycles": 25,
    "coherenceScore": 75
  }
}
```

**Response 201** :
```json
{
  "id": "session-123",
  "userId": "user-456",
  "type": "breathing",
  "duration": 300,
  "createdAt": "2024-04-21T10:30:00Z"
}
```

---

## 🎨 Design tokens

```
Colors:
- Primary: Blue (calming)
- Background: White/Light
- Text: Dark gray

Typography:
- H1: 24px bold
- Body: 14px regular
- Small: 12px muted

Spacing:
- Container max-width: 448px (md)
- Inner padding: 24px
- Section gap: 24px
```

---

## 🧪 Cas d'usage

### 1️⃣ User non-connecté

```
1. Accède /respiration
2. Page charge immédiatement (SSG)
3. Clique "Commencer"
4. Session lance (5 min)
5. Peut pause/reprendre
6. Session complete
7. Peut relancer
8. Pas sauvegardé (anon)
```

### 2️⃣ User connecté

```
1. Login → Zustand store updated
2. Accède /respiration
3. Même flow que non-connecté
4. À la fin:
   - POST /api/sessions avec token
   - Session sauvegardée en DB
   - "Session sauvegardée!"
5. Peut voir historique en /profil
```

---

## 📋 Checklist implémentation

```
✅ UI/Layout:
☐ Animated circle (scale)
☐ Phase label (Inspiration/Retenir/Expiration)
☐ Timer display (secondes restantes)
☐ Progress bar (cycles)
☐ Start/Pause/Resume buttons
☐ Info box (conseil)

✅ Logic:
☐ Phase management (inhale → hold → exhale → repeat)
☐ Timer countdown
☐ Cycle counting
☐ Session completion
☐ Session saving (if authenticated)

✅ Integration:
☐ Zustand user check
☐ API call POST /api/sessions
☐ Token in Authorization header
☐ Error handling (API fails)
☐ Success toast notification

✅ UX:
☐ Responsive design
☐ Accessibility (labels, ARIA)
☐ Keyboard navigation
☐ Touch-friendly (larger buttons)
☐ Offline support (même sans save)
```

---

## 🔗 Voir aussi

- [05-accueil.md](./05-accueil.md) - Home links to respiration
- [09-profil.md](./09-profil.md) - Historique des sessions
- [12-composants.md](./12-composants.md) - Button, Card, Progress

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026  
**Composants** : Motion, Timer, Progress, Card, Button

