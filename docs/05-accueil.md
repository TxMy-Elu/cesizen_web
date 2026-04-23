# 🏠 05 - Page d'accueil (Home)

**Temps de lecture** : 8-10 minutes  
**Public cible** : Designers, Développeurs Frontend  
**Dernière mise à jour** : 21 Avril 2026

---

## 📍 Route et localisation

```
Route: /
Fichier: app/page.tsx
Type: SSG (Static Site Generation)
Régénération: On-demand
Public: ✅ Oui (pas d'auth requise)
```

---

## 🎨 Wireframe et sections

```
┌─────────────────────────────────────┐
│  CESIZEN LOGO  |  NAV  |  LOGIN     │ ← SiteHeader
├─────────────────────────────────────┤
│                                     │
│  ▓▓▓ Hero Section ▓▓▓               │
│  Titre: "Design moderne pour..."    │
│  Buttons: [Lancer][Créer compte]    │
│                                     │
│  ▓ Numéros d'urgence (droite)       │
│  [Appel 15]  [Appel 112]            │
│  [Appel 3114]                       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  🎯 Accès rapide (3 colonnes)       │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ Respiration │ │ Prévention  │   │
│  │ guidée      │ │ validée     │   │
│  │ [CTA]       │ │ [CTA]       │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  ┌─────────────┐                    │
│  │ Suivi       │                    │
│  │ personnel   │                    │
│  │ [CTA]       │                    │
│  └─────────────┘                    │
│                                     │
├─────────────────────────────────────┤
│  Valeurs (3 colonnes)               │
│                                     │
│  ☐ Anonymat    ☐ Consentement      │
│  ☐ Performance                      │
│                                     │
├─────────────────────────────────────┤
│          FOOTER                     │
└─────────────────────────────────────┘
```

---

## 🔧 Composants utilisés

| Composant | Provenance | Usage |
|-----------|-----------|-------|
| **motion** | framer-motion | Animations fade-in |
| **Card** | @/components/ui/card | Conteneurs |
| **Button** | @/components/ui/button | CTAs |
| **SiteHeader** | @/components/app/site-header | Navigation |
| **SiteFooter** | @/components/app/site-footer | Footer |

---

## 🎯 Sections détaillées

### 1️⃣ HERO SECTION

```typescript
// Main value proposition
┌──────────────────────────────────────────────────────┐
│                                                      │
│  [Mode urgence disponible] (badge)                  │
│                                                      │
│  H1: "Un design plus moderne pour respirer,          │
│       se recentrer et agir vite"                    │
│                                                      │
│  Description:                                       │
│  "CESIZEN offre un accès immédiat au module de      │
│   cohérence cardiaque avec une interface zen..."    │
│                                                      │
│  [CTA Primaire: "Lancer une session"]              │
│  [CTA Secondaire: "Créer un compte suivi"]         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Props animées** :
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

<motion.div
  variants={fadeInUp}
  transition={{ duration: 0.35 }}
>
  {/* Hero content */}
</motion.div>
```

### 2️⃣ NUMÉROS D'URGENCE (Sidebar droite)

```typescript
const emergencyNumbers = ["15", "112", "3114"]

// Affiche en card avec buttons rouge destructive
{emergencyNumbers.map((line) => (
  <motion.div key={line} whileHover={{ y: -1 }}>
    <Button asChild variant="destructive" className="w-full justify-between">
      <Link href={`tel:${line}`}>
        <span>Appeler</span>
        <span>{line}</span>
      </Link>
    </Button>
  </motion.div>
))}
```

### 3️⃣ SECTION ACCÈS RAPIDE (3 colonnes)

```typescript
const quickAccess = [
  {
    title: "Respiration guidée",
    description: "Lancez une session immédiatement...",
    href: "/respiration",
    cta: "Démarrer maintenant",
  },
  {
    title: "Prévention validée",
    description: "Consultez des contenus thématiques...",
    href: "/prevention",
    cta: "Voir les contenus",
  },
  {
    title: "Suivi personnel",
    description: "Accédez à votre progression...",
    href: "/profil",
    cta: "Ouvrir mon espace",
  },
]

// Affichage en grid 3 colonnes
<section className="grid gap-4 md:grid-cols-3">
  {quickAccess.map((item) => (
    <Card key={item.href}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={item.href}>{item.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  ))}
</section>
```

### 4️⃣ SECTION VALEURS (3 colonnes)

```typescript
const values = [
  {
    title: "Anonymat visiteur",
    description: "Sans connexion, aucune donnée d'utilisation n'est sauvegardée sur le serveur.",
  },
  {
    title: "Consentement explicite",
    description: "Le suivi personnel n'est activé qu'après acceptation explicite du stockage des données de santé.",
  },
  {
    title: "Performance prioritaire",
    description: "Interface optimisée pour accéder au module d'urgence en moins de 3 secondes.",
  },
]

// Affichage en grid
<section className="grid gap-4 md:grid-cols-3">
  {values.map((value) => (
    <Card key={value.title} className="bg-surface-strong">
      <CardHeader>
        <CardTitle className="text-lg">{value.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {value.description}
      </CardContent>
    </Card>
  ))}
</section>
```

---

## 📐 Layout grid

```typescript
// Main container
<motion.div
  className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8 md:py-12"
>
  {/* Section 1: Hero + Emergency (2 colonnes: 1.35fr + 0.65fr) */}
  <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
    {/* Hero gauche */}
    {/* Emergency droite */}
  </section>

  {/* Section 2: Quick access (3 colonnes) */}
  <section className="grid gap-4 md:grid-cols-3">
    {/* 3 cards */}
  </section>

  {/* Section 3: Values (3 colonnes) */}
  <section className="grid gap-4 md:grid-cols-3">
    {/* 3 cards */}
  </section>
</motion.div>
```

---

## 🎨 Thème et tokens CSS

```typescript
// Classes Tailwind utilisées
className="bg-surface-strong"      // Fond secondaire
className="text-muted-foreground"  // Texte dégradé
className="border-surface-border"  // Border subtile
className="shadow-soft"            // Shadow douce
className="shadow-subtle"          // Shadow très subtile
```

---

## ⚙️ État et interactions

```typescript
// Animations contrôlées par Framer Motion
const reduceMotion = useReducedMotion()

// Si l'user a prefers-reduced-motion,
// animations désactivées automatiquement
initial={reduceMotion ? undefined : "hidden"}
animate={reduceMotion ? undefined : "show"}

// Hover effects
whileHover={reduceMotion ? undefined : { y: -3 }}
```

---

## 🔗 Navigation et links

| Element | Destination | Auth requis |
|---------|-------------|------------|
| Logo | / | Non |
| "Lancer une session" | /respiration | Non |
| "Créer un compte suivi" | /auth/inscription | Non |
| "Respiration guidée" | /respiration | Non |
| "Prévention validée" | /prevention | Non |
| "Suivi personnel" | /profil | **Oui** (avec guard) |
| "Appeler 15/112/3114" | tel: | N/A |

---

## 📊 Métadonnées et SEO

```typescript
// next.js head metadata
export const metadata: Metadata = {
  title: "CESIZen - Cohérence cardiaque et bien-être",
  description:
    "Plateforme de respiration guidée et gestion du stress avec accès immédiat. Interface zen, validée scientifiquement.",
  keywords: "respiration, cohérence cardiaque, stress, bien-être, santé mentale",
  openGraph: {
    title: "CESIZen",
    description: "Respiration guidée et bien-être",
    type: "website",
    url: "https://cesizen.com",
    images: [
      {
        url: "https://cesizen.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
}
```

---

## 🔄 Données statiques vs dynamiques

```
┌────────────────────────────────────┐
│  DONNÉES DE LA HOME                │
├────────────────────────────────────┤
│                                    │
│ 📄 STATIQUES (SSG):                │
│ ├─ quickAccess array               │
│ ├─ emergencyNumbers array          │
│ ├─ values array                    │
│ └─ Tous les strings                │
│                                    │
│ ⚡ DYNAMIQUES (SSR):               │
│ ├─ Navigation (si user connecté)   │
│ ├─ Profile preview (si connecté)   │
│ └─ Ne s'applique pas à /           │
│                                    │
│ 🔄 RÉTIME (Client-side):           │
│ ├─ Animations (Framer Motion)      │
│ ├─ Hovers et interactions          │
│ └─ useReducedMotion hook           │
│                                    │
└────────────────────────────────────┘
```

---

## 📱 Responsive design

```
Mobile (< 768px):
- 1 colonne (Hero prend pleine largeur)
- Emergency buttons empilés
- Padding réduit

Tablet (768px - 1024px):
- 2-3 colonnes par sections
- Layout optimal

Desktop (> 1024px):
- Layout complet avec Grid avancé
- Max-width 7xl
- Padding généreux
```

---

## 🧪 Cas d'usage

### 1️⃣ User non-connecté arrive sur home

```
1. Page charge (SSG)
2. Framer Motion animations play
3. Voir 3 sections principales
4. Cliquer "Lancer une session"
5. Redirection /respiration (sans login)
```

### 2️⃣ User en situation d'urgence

```
1. Landing sur /
2. Voir "Besoin d'aide immédiate"
3. Voir numéros d'urgence
4. Cliquer "Appeler 15"
5. Tel:// link s'ouvre
```

### 3️⃣ User connecté vérifier progression

```
1. Landing sur /
2. Header affiche "Bienvenue Jean"
3. Cliquer "Suivi personnel"
4. Redirection /profil (accès autorisé)
```

---

## 💡 Conseils et patterns

✅ **DO:**
- Respecter les animations avec prefers-reduced-motion
- Lien "tel:" pour urgence (mobile-friendly)
- Cards homogènes avec même hauteur
- Images optimisées avec Next.js Image

❌ **DON'T:**
- Trop d'animations (peut être stressant)
- Numéros d'urgence non-cliquables
- Layout qui bouge (CLS)
- Énormes images non-optimisées

---

## 🔗 Voir aussi

- [01-overview.md](./01-overview.md) - Architecture générale
- [07-respiration.md](./07-respiration.md) - Module respiration
- [12-composants.md](./12-composants.md) - Composants Card, Button
- [NAVIGATION.md](./NAVIGATION.md) - Guide navigation

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026  
**Composants** : 6 UI components + 2 app components

