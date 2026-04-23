# 📚 08 - Contenus de prévention

**Temps de lecture** : 8-10 minutes  
**Public cible** : Développeurs, Product Managers  
**Dernière mise à jour** : 21 Avril 2026

---

## 📍 Routes

```
/prevention           → List d'articles
/prevention/[slug]    → Article détail
```

---

## 📖 Structure article

```typescript
interface Article {
  id: string
  title: string
  slug: string
  content: string (HTML/Markdown)
  excerpt: string
  thumbnail?: string
  
  category: {
    name: string
    slug: string
  }
  tags?: string[]
  
  author: {
    name: string
    title?: string
  }
  
  published: boolean
  publishedAt: Date
  viewCount: number
  
  seoTitle?: string
  seoDescription?: string
}
```

---

## 🎯 Catégories exemple

```
- Gestion du stress
- Respiration
- Sommeil
- Santé mentale
- Nutrition
- Exercice physique
- Mindfulness
- Relations
```

---

## 📋 API Endpoints

```
GET /api/articles              → List + pagination
GET /api/articles/{slug}       → Article détail
POST /api/articles/{id}/view   → Track lecture
GET /api/categories            → List catégories
GET /api/articles/category/{slug} → Articles par catégorie
```

---

## 🎨 Layout

### Liste articles

```
/prevention

Recherche: [Search box]
Catégories: [Filtres]

┌────────────────────────────────┐
│ [Thumbnail] Article title      │
│ Category • 3 min read          │
│ Excerpt...                     │
│ [Lire l'article →]             │
└────────────────────────────────┘

(Répété: 6-12 articles)

[Pagination]
```

### Détail article

```
/prevention/[slug]

[← Retour]

Title
Category • Date • 3 min read

[Thumbnail fullwidth]

Author: Name | Title
---

Content (long-form)

[Share buttons]
[Related articles]
```

---

## 💻 Page composants

```typescript
// app/prevention/page.tsx
"use client"

import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/api/http-client"
import { ArticleCard } from "@/components/app/article-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function PreventionPage() {
  const [articles, setArticles] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.append("category", selectedCategory)
        if (searchQuery) params.append("q", searchQuery)

        const articles = await apiRequest(
          `/api/articles?${params.toString()}`
        )
        setArticles(articles)
      } catch (error) {
        console.error("Failed to fetch articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [selectedCategory, searchQuery])

  return (
    <div className="space-y-8 py-12">
      <h1 className="text-3xl font-bold">Contenus de prévention</h1>

      {/* Search */}
      <Input
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["Stress", "Respiration", "Sommeil", "Santé mentale"].map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(
              selectedCategory === cat ? "" : cat
            )}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Articles grid */}
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
```

```typescript
// app/prevention/[slug]/page.tsx
"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { apiRequest } from "@/lib/api/http-client"
import Image from "next/image"

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Track view
        await apiRequest(`/api/articles/${slug}/view`, { method: "POST" })

        // Fetch article
        const article = await apiRequest(`/api/articles/${slug}`)
        setArticle(article)
      } catch (error) {
        console.error("Failed to fetch article:", error)
      }
    }

    fetchArticle()
  }, [slug])

  if (!article) return <div>Chargement...</div>

  return (
    <article className="mx-auto max-w-2xl space-y-8 py-12">
      <header className="space-y-4">
        <a href="/prevention" className="text-sm text-primary">
          ← Retour
        </a>

        <h1 className="text-4xl font-bold">{article.title}</h1>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{article.category.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
          <span>{Math.ceil(article.content.split(" ").length / 200)} min</span>
        </div>
      </header>

      {article.thumbnail && (
        <Image
          src={article.thumbnail}
          alt={article.title}
          width={800}
          height={400}
          className="w-full rounded-lg"
        />
      )}

      {/* Author */}
      <div className="border-t border-b py-4">
        <p className="font-semibold">{article.author.name}</p>
        {article.author.title && (
          <p className="text-sm text-muted-foreground">{article.author.title}</p>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Share */}
      <div className="flex gap-2">
        <span className="text-sm font-semibold">Partager:</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
          className="text-primary hover:underline"
        >
          Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          className="text-primary hover:underline"
        >
          Facebook
        </a>
      </div>

      {/* Related articles */}
      {article.relatedArticles?.length > 0 && (
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Articles liés</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {article.relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
```

---

## 🎯 ArticleCard Component

```typescript
// components/app/article-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ArticleCard({ article }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      {article.thumbnail && (
        <Image
          src={article.thumbnail}
          alt={article.title}
          width={300}
          height={200}
          className="aspect-video object-cover"
        />
      )}

      <CardHeader className="space-y-2">
        <Badge variant="outline">{article.category.name}</Badge>
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
      </CardHeader>

      <CardContent>
        <Link
          href={`/prevention/${article.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Lire l'article →
        </Link>
      </CardContent>
    </Card>
  )
}
```

---

## 📊 API Response Examples

```json
// GET /api/articles?category=stress&limit=10
{
  "data": [
    {
      "id": "article-1",
      "title": "Gestion du stress: 5 techniques",
      "slug": "gestion-stress-5-techniques",
      "excerpt": "Découvrez 5 méthodes éprouvées...",
      "thumbnail": "https://...",
      "category": {
        "name": "Gestion du stress",
        "slug": "stress"
      },
      "author": {
        "name": "Dr. Marie",
        "title": "Psychologue"
      },
      "publishedAt": "2024-04-20T10:00:00Z",
      "viewCount": 1250
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

---

## 📋 Checklist

```
✅ Articles:
☐ Liste avec pagination
☐ Filtrage par catégorie
☐ Recherche texte
☐ Carte article (thumbnail, titre, excerpt)
☐ Détail article complet
☐ Tracking vues (POST /api/articles/{id}/view)
☐ Responsive images

✅ Features:
☐ Authors info
☐ Reading time estimate
☐ Share buttons
☐ Related articles
☐ Meta tags (SEO)
☐ Category filtering
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026

