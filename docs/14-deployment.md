# 🚀 14 - Déploiement & Production

**Temps de lecture** : 15-20 minutes | **Public** : DevOps, Développeurs | **Mise à jour** : 21 Avril 2026

---

## 🌐 Déploiement sur Vercel

### Configuration Vercel

1. **Connexion à Vercel**:
```bash
npm i -g vercel
vercel login
```

2. **Configuration du projet**:
```bash
cd cesizen_web
vercel
# Suivre les prompts: oui pour Next.js, sélectionner le répertoire racine
```

3. **Variables d'environnement**:
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
# Entrer: https://api-cesizen.example.com
```

4. **Déploiement**:
```bash
vercel --prod
```

### Fichier vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/**/*.ts": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api-cesizen.example.com/api/$1"
    }
  ]
}
```

---

## 🐳 Déploiement avec Docker

### Dockerfile optimisé

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose pour développement

```yaml
# docker-compose.yml
version: '3.8'

services:
  cesizen-web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://api:8080
    depends_on:
      - api
    networks:
      - cesizen-network

  api:
    image: cesizen/api:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    networks:
      - cesizen-network

networks:
  cesizen-network:
    driver: bridge
```

### Construction et exécution

```bash
# Build de l'image
docker build -t cesizen/web:latest .

# Exécution en local
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
  cesizen/web:latest

# Avec docker-compose
docker-compose up -d
```

---

## ⚡ Optimisations de performance

### Code Splitting et Lazy Loading

```typescript
// app/layout.tsx - Lazy loading des composants lourds
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Désactiver SSR si nécessaire
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <HeavyComponent />
        {children}
      </body>
    </html>
  )
}
```

### Optimisation des images

```typescript
// components/optimized-image.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, priority }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        className="transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  )
}
```

### Configuration Next.js optimisée

```javascript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de build
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Images
  images: {
    domains: ['api-cesizen.example.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects et rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-cesizen.example.com/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 🔍 SEO et Métadonnées

### Métadonnées dynamiques

```typescript
// app/prevention/[slug]/page.tsx
import { Metadata } from 'next'
import { articleApi } from '@/lib/api/services'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const article = await articleApi.getById(parseInt(params.slug))

    return {
      title: `${article.titre} | CESIZen`,
      description: article.contenu.substring(0, 160),
      keywords: ['respiration', 'stress', 'bien-être', article.titre],
      openGraph: {
        title: article.titre,
        description: article.contenu.substring(0, 160),
        images: article.mediaUrl ? [article.mediaUrl] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.titre,
        description: article.contenu.substring(0, 160),
        images: article.mediaUrl ? [article.mediaUrl] : [],
      },
    }
  } catch {
    return {
      title: 'Article non trouvé | CESIZen',
    }
  }
}
```

### Sitemap dynamique

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { articleApi, categorieApi } from '@/lib/api/services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: 'https://cesizen.example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    // Articles
    const articles = await articleApi.listPublic()
    articles.forEach(article => {
      sitemap.push({
        url: `https://cesizen.example.com/prevention/${article.idArticle}`,
        lastModified: new Date(article.dateModification || article.datePublication),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })

    // Catégories
    const categories = await categorieApi.list()
    categories.forEach(category => {
      sitemap.push({
        url: `https://cesizen.example.com/categorie/${category.idCategorie}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  } catch (error) {
    console.error('Erreur génération sitemap:', error)
  }

  return sitemap
}
```

### Robots.txt

```txt
# robots.txt
User-agent: *
Allow: /

# Bloquer les pages admin
Disallow: /admin/
Disallow: /api/admin/

# Sitemap
Sitemap: https://cesizen.example.com/sitemap.xml
```

---

## 📊 Monitoring et Analytics

### Configuration Sentry

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

### Google Analytics 4

```typescript
// lib/analytics.ts
import { GoogleAnalytics } from '@next/third-parties/google'

export function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null

  return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
}

// app/layout.tsx
import { Analytics } from '@/lib/analytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Tracking des événements

```typescript
// lib/analytics.ts
export const trackEvent = (event: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, parameters)
  }
}

// Exemple d'utilisation
// components/app/article-card.tsx
"use client"

import { trackEvent } from '@/lib/analytics'

export function ArticleCard({ article }: ArticleCardProps) {
  const handleClick = () => {
    trackEvent('article_view', {
      article_id: article.idArticle,
      article_title: article.titre,
      category: article.categorieLibelle,
    })
  }

  return (
    <Link href={`/prevention/${article.idArticle}`} onClick={handleClick}>
      {/* contenu */}
    </Link>
  )
}
```

---

## 🔒 Sécurité en production

### Headers de sécurité avancés

```javascript
// next.config.ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin, strict-origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

### Variables d'environnement de production

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api-cesizen.example.com
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXXX
NODE_ENV=production

# Secrets (côté serveur seulement)
SENTRY_AUTH_TOKEN=xxx
API_SECRET_KEY=xxx
```

---

## 📈 Métriques et Alertes

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Vérifier la connectivité à l'API
    const apiResponse = await fetch(`${process.env.API_BASE_URL}/health`, {
      timeout: 5000,
    })

    if (!apiResponse.ok) {
      throw new Error('API health check failed')
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
```

### Monitoring des performances

```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  // Envoyer à votre outil de monitoring
  console.log('Web Vitals:', metric)

  // Exemple avec Sentry
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      extra: {
        value: metric.value,
        id: metric.id,
        rating: metric.rating,
      },
    })
  }
}

// app/_document.tsx (pages router) ou app/layout.tsx (app router)
import { reportWebVitals } from '@/lib/performance'

export function reportWebVitals(metric) {
  reportWebVitals(metric)
}
```

---

## 🚨 Rollback et Recovery

### Stratégie de déploiement

```bash
# Script de déploiement avec rollback
#!/bin/bash

set -e

echo "🚀 Début du déploiement..."

# Backup de la version actuelle
docker tag cesizen/web:latest cesizen/web:backup-$(date +%Y%m%d_%H%M%S)

# Build de la nouvelle version
docker build -t cesizen/web:latest .

# Health check avant de switcher
if curl -f http://localhost:3000/api/health; then
  echo "✅ Health check réussi"

  # Redémarrage avec zero-downtime
  docker-compose up -d --scale cesizen-web=2

  # Attendre que les nouvelles instances soient prêtes
  sleep 30

  # Supprimer les anciennes instances
  docker-compose up -d --scale cesizen-web=1

  echo "✅ Déploiement réussi"
else
  echo "❌ Health check échoué, rollback..."

  # Rollback
  docker tag cesizen/web:backup-latest cesizen/web:latest
  docker-compose restart cesizen-web

  echo "✅ Rollback effectué"
  exit 1
fi
```

---

## 📋 Checklist de production

### Pré-déploiement
```
✅ Variables d'environnement configurées
✅ Secrets sécurisés (pas dans le code)
✅ Tests automatisés passent
✅ Build de production réussi
✅ Images optimisées
✅ SEO configuré (meta, sitemap, robots)
✅ Analytics configuré
✅ Monitoring configuré
✅ Health checks implémentés
```

### Post-déploiement
```
✅ Site accessible
✅ APIs répondent
✅ Authentification fonctionne
✅ Performance acceptable (Lighthouse > 90)
✅ Erreurs monitorées
✅ Logs configurés
✅ Backup automatique
✅ Plan de rollback testé
```

### Maintenance
```
✅ Mises à jour de sécurité régulières
✅ Monitoring des métriques
✅ Logs analysés régulièrement
✅ Performance surveillée
✅ Sauvegardes vérifiées
✅ Tests de charge périodiques
```

---

## ⚠️ Limites connues et solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| Build lent | Trop de dépendances | Code splitting, tree shaking |
| Bundle size élevé | Imports inutiles | Analyse bundle, lazy loading |
| Hydration mismatch | SSR/CSR différent | Synchroniser les données |
| Memory leaks | Event listeners | Cleanup dans useEffect |
| Slow API calls | Pas de cache | Implémenter cache (Redis, CDN) |
| SEO poor | Meta manquants | Métadonnées dynamiques |

---

**Voir aussi**: [02-setup.md](./02-setup.md) | [13-exemples-integration.md](./13-exemples-integration.md)

**Version** : 1.0.0 | **Mise à jour** : 21 Avril 2026</content>
<parameter name="filePath">C:\Users\Elio\Documents\GitHub\cesizen_web\docs\14-deployment.md
