# 📋 01 - Vue d'ensemble générale (Overview)

**Temps de lecture** : 10-15 minutes  
**Public cible** : Tous les profils  
**Dernière mise à jour** : 21 Avril 2026

---

## 🎯 Qu'est-ce que CESIZen ?

**CESIZen** est une plateforme web moderne dédiée à la **cohérence cardiaque**, la **gestion du stress** et le **bien-être mental**. Elle offre une interface zen et accessible permettant aux utilisateurs de :

✅ Pratiquer des **sessions de respiration guidée** en temps réel  
✅ Consulter des **contenus de prévention** validés par des professionnels  
✅ **Suivre leur progression** et leurs habitudes personnelles  
✅ Accéder rapidement à des **ressources d'urgence** et de support  

---

## 🏗️ Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR FINAL                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   NAVIGATEUR (Client)   │
        │  ┌──────────────────┐   │
        │  │  Next.js (SSR)   │   │ ← Pages pré-rendues
        │  │  React 19        │   │
        │  │  TypeScript      │   │ ← Type-safe
        │  │  Tailwind CSS 4  │   │
        │  └──────────────────┘   │
        │  ┌──────────────────┐   │
        │  │ State Management │   │
        │  │ (Zustand)        │   │ ← State local
        │  │ React Query      │   │ ← Cache API
        │  └──────────────────┘   │
        └────────────────┬────────┘
                         │
        ┌────────────────▼─────────────────┐
        │    HTTP Client Layer             │
        │  ┌────────────────────────────┐  │
        │  │ Fetch API avec interceptors│  │ ← Requests/Responses
        │  │ JWT Token Management       │  │ ← Auth headers
        │  │ Error Handling             │  │ ← Global error handling
        │  └────────────────────────────┘  │
        └────────────────┬──────────────────┘
                         │
        ┌────────────────▼──────────────────┐
        │    API Backend (External)        │
        │  ┌────────────────────────────┐  │
        │  │ /api/auth/*                │  │ ← Authentification
        │  │ /api/articles/*            │  │ ← Contenus
        │  │ /api/users/*               │  │ ← Profils
        │  │ /api/sessions/*            │  │ ← Historique
        │  │ /api/admin/*               │  │ ← Admin only
        │  └────────────────────────────┘  │
        └────────────────────────────────────┘
```

---

## 📦 Stack technologique complète

### 🟦 **Frontend (Client)**

| Outil | Version | Usage |
|-------|---------|-------|
| **Next.js** | 16.2.2 | Framework React fullstack avec SSR |
| **React** | 19.2.4 | Bibliothèque UI moderne |
| **TypeScript** | 5.x | Type safety et DX amélioré |
| **Tailwind CSS** | 4.x | Styling utility-first |
| **Zustand** | 5.0.8 | State management légère |
| **React Hook Form** | 7.65.0 | Gestion des formulaires |
| **Zod** | 4.1.12 | Validation de schémas |
| **TanStack Query** | 5.90.3 | Caching et synchronisation API |
| **Framer Motion** | 12.23.24 | Animations fluides |
| **Radix UI** | 1.x | Composants accessibles |
| **Lucide React** | 1.7.0 | Icônes modernes |
| **Sonner** | 2.0.7 | Toast notifications |

### 🟨 **Développement**

| Outil | Version | Usage |
|-------|---------|-------|
| **ESLint** | 9.x | Linting et code quality |
| **TypeScript** | 5.x | Compilation TypeScript |
| **PostCSS** | 8.5.9 | Transformation CSS |

### 🟩 **Architecture décisionnelle**

```
┌─────────────────────────────────────────────┐
│           WHY ces technologies ?            │
├─────────────────────────────────────────────┤
│                                             │
│ Next.js 16:                                 │
│ → App Router (routing moderne)              │
│ → SSR/SSG (performance et SEO)              │
│ → API Routes intégrées                      │
│ → Image optimization automatique            │
│                                             │
│ React 19:                                   │
│ → Server Components support                 │
│ → Hooks performants                         │
│ → React Compiler ready                      │
│                                             │
│ TypeScript strict:                          │
│ → Sécurité des types                        │
│ → Refactoring confiant                      │
│ → Documentation auto (intellisense)         │
│                                             │
│ Tailwind CSS 4:                             │
│ → CSS-in-markup (co-location)               │
│ → JIT compilation                           │
│ → Responsive design facile                  │
│ → Thématisation simple                      │
│                                             │
│ Zustand:                                    │
│ → State global léger                        │
│ → Moins de boilerplate que Redux            │
│ → Parfait pour une app mid-size             │
│                                             │
│ React Hook Form + Zod:                      │
│ → Validation côté client robuste            │
│ → Erreurs de formulaire type-safe           │
│ → UX fluide (minimal re-renders)            │
│                                             │
│ TanStack Query:                             │
│ → Cache API automatique                     │
│ → Synchronisation données en temps réel     │
│ → Gestion offline/online                    │
│                                             │
│ Framer Motion:                              │
│ → Animations déclaratives                   │
│ → Respecte prefers-reduced-motion           │
│ → GPU-accelerated                           │
│                                             │
│ Radix UI:                                   │
│ → Composants accessibles (WCAG)             │
│ → Unstyled (personnalisable)                │
│ → Bien intégré avec Tailwind                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔄 Flux de données et state management

### Flux GET (Lecture)

```
User Action
    ↓
React Component (useState)
    ↓
useQuery (TanStack Query)
    ↓
apiRequest (Fetch API)
    ↓
Backend API
    ↓
Response JSON
    ↓
Cache (TanStack Query)
    ↓
Component Update (re-render)
    ↓
UI Updated
```

### Flux POST (Écriture)

```
User Submits Form
    ↓
React Hook Form (validation locale avec Zod)
    ↓
useMutation (TanStack Query)
    ↓
apiRequest + JWT Token
    ↓
Backend API
    ↓
Response + Validation
    ↓
Success Toast (Sonner)
    ↓
Cache Update (TanStack Query)
    ↓
Component/Page Updated
```

### Global State (Zustand)

```
État global (Zustand store):
├─ auth: { user, token, isAuthenticated }
├─ ui: { theme, sidebarOpen, locale }
├─ session: { currentSessionId, timer }
└─ notifications: { toasts, dialogs }

Accès depuis n'importe quel composant:
const { user } = useAuthStore()
const { setTheme } = useUIStore()
```

---

## 📊 Modèle de données (Entities)

### 👤 **User (Utilisateur)**

```typescript
interface User {
  id: string                    // UUID
  email: string                 // Email unique
  password_hash: string         // Bcrypt hash (backend)
  firstName: string             // Prénom
  lastName: string              // Nom
  dateOfBirth: Date            // Date de naissance
  gender?: 'M' | 'F' | 'O'    // Genre
  phone?: string                // Téléphone optionnel
  avatar?: string               // URL image profil
  role: 'user' | 'admin'       // Rôle
  isEmailVerified: boolean      // Vérification email
  twoFactorEnabled: boolean     // 2FA
  
  // Santé
  healthConditions?: string[]   // Conditions de santé
  medications?: string[]        // Médicaments
  allergies?: string[]          // Allergies
  
  // Préférences
  preferences: {
    theme: 'light' | 'dark'
    locale: 'fr' | 'en'
    notificationsEnabled: boolean
    emailNotifications: boolean
    dataConsent: boolean         // RGPD
  }
  
  // Métadonnées
  createdAt: Date              // Date création
  updatedAt: Date              // Dernière modification
  lastLoginAt?: Date           // Dernière connexion
  deletedAt?: Date             // Soft delete
}
```

### 📖 **Article (Contenu de prévention)**

```typescript
interface Article {
  id: string
  title: string                    // Titre
  slug: string                     // URL-friendly
  content: string                  // HTML/Markdown
  excerpt: string                  // Résumé court
  thumbnail?: string               // Image de couverture
  
  // Catégorisation
  category: {
    id: string
    name: string                   // Ex: "Gestion du stress"
    slug: string
  }
  tags?: string[]                  // Mots-clés
  
  // Auteur
  author: {
    id: string
    name: string
    title?: string
    avatar?: string
  }
  
  // Métadonnées
  published: boolean
  publishedAt: Date
  viewCount: number
  likeCount: number
  commentCount: number
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### 🎯 **Session (Historique respiration)**

```typescript
interface Session {
  id: string
  userId: string
  
  // Détails
  type: 'breathing' | 'meditation' | 'exercise'
  duration: number              // En secondes
  startedAt: Date
  endedAt: Date
  
  // Métriques (optionnel)
  metrics?: {
    heartRateAvg?: number
    heartRateMin?: number
    heartRateMax?: number
    coherenceScore?: number      // 0-100
    stressLevel?: number         // 0-100
  }
  
  // Feedback
  userRating?: number            // 1-5 stars
  feedback?: string              // Note utilisateur
  
  // Métadonnées
  deviceInfo?: {
    userAgent: string
    screenWidth: number
    screenHeight: number
  }
  
  createdAt: Date
}
```

### 🔐 **Auth Token (JWT)**

```typescript
interface JWTPayload {
  sub: string                    // Subject = userId
  email: string
  role: 'user' | 'admin'
  iat: number                    // Issued at
  exp: number                    // Expiration (15min)
  type: 'access'
}

interface RefreshToken {
  sub: string
  type: 'refresh'
  iat: number
  exp: number                    // Expiration (7 days)
  tokenVersion: number           // Pour invalider
}
```

---

## 🗂️ Structure des fichiers

```
cesizen_web/
├── app/                          # App Router (Next.js 16)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (/)
│   ├── not-found.tsx             # 404 page
│   ├── providers.tsx             # Providers (Zustand, Query)
│   ├── auth/                     # Authentification
│   │   ├── connexion/            # Login
│   │   ├── inscription/          # Register
│   │   └── reset-mot-de-passe/   # Password reset
│   ├── respiration/              # Module respiration
│   ├── prevention/               # Contenus prévention
│   │   └── [slug]/               # Article détail
│   ├── profil/                   # Dashboard utilisateur
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── contenus/             # Gestion articles
│   │   ├── utilisateurs/         # Gestion users
│   │   └── statistiques/         # Analytics
│   ├── accessibilite/            # Page légales
│   ├── confidentialite/
│   ├── cookies/
│   ├── mentions-legales/
│   ├── faq/
│   ├── contact/
│   └── globals.css               # Global styles
│
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants UI bruts
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   └── ... (20+ composants)
│   │
│   └── app/                      # Composants métier
│       ├── site-header.tsx       # Header/Navigation
│       ├── site-footer.tsx       # Footer
│       ├── admin-guard.tsx       # Protection routes admin
│       ├── profile-preview.tsx   # Aperçu profil
│       ├── health-metric-card.tsx # Métrique santé
│       ├── appointment-timeline.tsx # Timeline sessions
│       ├── article-card.tsx      # Carte article
│       ├── stats-card.tsx        # Carte statistique
│       └── ... (autres composants)
│
├── lib/                          # Utilitaires & logique métier
│   ├── utils.ts                  # Fonctions utiles
│   ├── navigation.ts             # Configuration routing
│   ├── prevention-content.ts     # Données articles
│   ├── demo-data.ts              # Données démo
│   │
│   ├── api/                      # Clients API
│   │   ├── http-client.ts        # Fetch wrapper
│   │   ├── services.ts           # Service functions
│   │   └── contracts.ts          # Types API
│   │
│   ├── auth/                     # Authentification
│   │   ├── session.ts            # Session logic
│   │   └── use-session.ts        # Hook useSession
│   │
│   └── validations/              # Schémas Zod
│       └── contact.ts            # Validation contact
│
├── public/                       # Assets statiques
│   ├── file.svg
│   ├── next.svg
│   └── ... (images, etc.)
│
├── docs/                         # Documentation
│   ├── 00-README.md
│   ├── 01-overview.md
│   └── ... (14 autres fichiers)
│
├── .env.local                    # Variables d'env (dev)
├── .env.example                  # Template variables
├── next.config.ts                # Config Next.js
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # Config TypeScript
├── eslint.config.mjs             # Config ESLint
├── package.json
└── README.md                     # Guide rapide
```

---

## 🔐 Modèle de sécurité et authentification

### Flux d'authentification complet

```
┌──────────────────────────────────────────────────────────┐
│               AUTHENTIFICATION & AUTORISATION            │
└──────────────────────────────────────────────────────────┘

1️⃣ LOGIN FORM SUBMISSION
   ├─ Email + Password (formulaire)
   ├─ Validation locale Zod
   └─ POST /api/auth/login

2️⃣ BACKEND VALIDATION
   ├─ Email exists?
   ├─ Password correct? (Bcrypt)
   ├─ Account active?
   └─ Response: { accessToken, refreshToken }

3️⃣ TOKEN STORAGE
   ├─ accessToken → localStorage (15 min)
   ├─ refreshToken → httpOnly cookie (7 days)
   └─ Store user in Zustand

4️⃣ AUTHENTICATED REQUESTS
   ├─ Ajout header: Authorization: Bearer <token>
   └─ Interceptor gère expiration

5️⃣ TOKEN EXPIRATION
   ├─ 401 Unauthorized reçu?
   ├─ POST /api/auth/refresh (avec refreshToken)
   ├─ Nouveau accessToken reçu
   └─ Retry requête originale

6️⃣ LOGOUT
   ├─ Supprimer localStorage
   ├─ Supprimer cookies
   ├─ Vider Zustand store
   └─ Redirection /auth/connexion
```

### Matrice d'accès (RBAC)

```
┌─────────────────┬──────────┬──────────┬───────────┐
│ Ressource       │ Public   │ User     │ Admin     │
├─────────────────┼──────────┼──────────┼───────────┤
│ /               │ ✅ Oui   │ ✅ Oui   │ ✅ Oui    │
│ /respiration    │ ✅ Oui   │ ✅ Oui   │ ✅ Oui    │
│ /prevention     │ ✅ Oui   │ ✅ Oui   │ ✅ Oui    │
│ /profil         │ ❌ Non   │ ✅ Oui   │ ✅ Oui    │
│ /admin/*        │ ❌ Non   │ ❌ Non   │ ✅ Oui    │
│ /auth/*         │ ✅ Oui   │ ❌ Non   │ ❌ Non    │
└─────────────────┴──────────┴──────────┴───────────┘
```

---

## 📈 Performance et optimisations

### Stratégie de rendering

```
┌────────────────────────────────────────────┐
│          RENDERING STRATEGY                │
├────────────────────────────────────────────┤
│                                            │
│ 📄 Pages STATIQUES (SSG):                  │
│   ├─ /                    → Accueil        │
│   ├─ /prevention          → Articles       │
│   ├─ /faq                 → FAQ            │
│   └─ Régénération: on-demand               │
│                                            │
│ ⚡ Pages DYNAMIQUES (SSR):                 │
│   ├─ /profil              → User-specific  │
│   ├─ /respiration         → Avec session   │
│   └─ /admin/*             → Admin pages    │
│                                            │
│ 🔄 Client-side RENDERING:                  │
│   ├─ Modales/Dialogs                       │
│   ├─ Formulaires interactifs               │
│   └─ Real-time updates                     │
│                                            │
│ 💾 CACHING:                                │
│   ├─ Images: Vercel Cache (31 jours)       │
│   ├─ API: TanStack Query (1-5 min)         │
│   ├─ CSS/JS: Browser cache (1 année)       │
│   └─ CDN: Vercel Edge Network              │
│                                            │
│ 📦 CODE SPLITTING:                         │
│   ├─ Route-based chunking (Next.js)        │
│   ├─ Component lazy loading                │
│   └─ Dynamic imports pour dialogs          │
│                                            │
│ 🖼️ IMAGE OPTIMIZATION:                     │
│   ├─ WebP format automatique               │
│   ├─ Responsive sizing                     │
│   ├─ Lazy loading (native)                 │
│   └─ Blur placeholder                      │
│                                            │
└────────────────────────────────────────────┘
```

### Métriques cibles

| Métrique | Cible | Outils |
|----------|-------|--------|
| **FCP** (First Contentful Paint) | < 1.5s | Lighthouse |
| **LCP** (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Core Web Vitals |
| **Time to Interactive** | < 3.5s | Lighthouse |
| **JavaScript** | < 200KB (gzipped) | Bundle analyzer |
| **CSS** | < 30KB (gzipped) | PostCSS stats |

---

## 🧪 Testabilité et qualité

### Stratégie de testing

```typescript
// 🔴 Unit Tests (80%)
// → Utilities, hooks, store

// 🟡 Integration Tests (15%)
// → Components, API interactions

// 🟢 E2E Tests (5%)
// → User journeys, critical paths
```

### Outils recommandés

- **Jest** : Unit testing
- **React Testing Library** : Component testing
- **Playwright** : E2E testing
- **ESLint** : Code quality
- **TypeScript strict** : Type safety

---

## 🌐 Internationalisation (i18n)

Actuellement: **Français (FR)**

Structure prête pour multi-langue:
```
app/
├── [locale]/
│   ├── page.tsx
│   ├── auth/
│   └── ...
```

---

## 📞 Points de contact API

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  // Développement: http://localhost:8080
  // Production: https://api.cesizen.com

// Endpoints principaux:
POST   /api/auth/login              // Connexion
POST   /api/auth/register           // Inscription
POST   /api/auth/logout             // Déconnexion
POST   /api/auth/refresh            // Refresh token

GET    /api/users/me                // Profil courant
PUT    /api/users/{id}              // Mise à jour profil

GET    /api/articles                // Liste articles
GET    /api/articles/{slug}         // Article détail
POST   /api/articles/{id}/view      // Track lecture

POST   /api/sessions                // Créer session
GET    /api/sessions/{id}           // Détail session
GET    /api/sessions/stats          // Stats utilisateur

GET    /api/admin/users             // [ADMIN] Utilisateurs
GET    /api/admin/articles          // [ADMIN] Articles
GET    /api/admin/stats             // [ADMIN] Statistiques
```

---

## ✨ Prochaines étapes

### Pour démarrer:
1. **[02-setup.md](./02-setup.md)** - Installation locale
2. **[03-security.md](./03-security.md)** - Comprendre auth
3. **[12-composants.md](./12-composants.md)** - Explorer UI

### Pour contribuer:
1. **[13-exemples-integration.md](./13-exemples-integration.md)** - Apprendre l'API
2. **[05-accueil.md](./05-accueil.md)** - Voir feature principal
3. **[14-deployment.md](./14-deployment.md)** - Déployer

---

**Voir aussi:**
- [00-README.md](./00-README.md) - Index complet
- [NAVIGATION.md](./NAVIGATION.md) - Guide par profil
- [API.md](../api.md) - Documentation API brute

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026  
**Responsable** : Équipe CESIZen

