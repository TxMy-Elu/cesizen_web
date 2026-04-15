"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { ArticleCard } from "@/components/app/article-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { articleApi, categorieApi } from "@/lib/api/services"

const formatReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 180))
  return `${minutes} min`
}

export default function PreventionPage() {
  const [activeTopic, setActiveTopic] = useState<string>("Tous")

  const categoriesQuery = useQuery({
    queryKey: ["categories", "public"],
    queryFn: categorieApi.list,
  })

  const articlesQuery = useQuery({
    queryKey: ["articles", "public"],
    queryFn: articleApi.listPublic,
  })

  const topics = useMemo(() => categoriesQuery.data?.map((item) => item.libelle) ?? [], [categoriesQuery.data])

  const loadError = articlesQuery.error ?? categoriesQuery.error

  const filteredArticles = useMemo(() => {
    const articles = articlesQuery.data ?? []
    if (activeTopic === "Tous") {
      return articles
    }
    return articles.filter((article) => article.categorieLibelle === activeTopic)
  }, [activeTopic, articlesQuery.data])

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="space-y-3">
            <Badge className="w-fit" variant="destructive">
              Erreur de chargement
            </Badge>
            <CardTitle className="text-3xl md:text-4xl">Impossible de charger les ressources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Le contenu de prévention n&apos;a pas pu être chargé depuis l&apos;API.
            </p>
            <p className="text-destructive">{loadError.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant="secondary">
            Prévention & information
          </Badge>
          <CardTitle className="text-3xl md:text-4xl">
            Ressources fiables pour mieux gérer stress, sommeil et anxiété
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Chaque contenu affiche la mention “Validé par des professionnels de
            santé” pour garantir un niveau d&apos;information clair et responsable.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTopic("Tous")}
              className={`rounded-full border px-4 py-2 text-sm font-medium shadow-subtle transition-all ${
                activeTopic === "Tous"
                  ? "border-transparent bg-[#548068] text-white"
                  : "border-border/75 bg-surface-strong hover:border-brand-olive-300 hover:bg-brand-sage-50"
              }`}
            >
              Tous
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setActiveTopic(topic)}
                className={`rounded-full border px-4 py-2 text-sm font-medium shadow-subtle transition-all ${
                  activeTopic === topic
                    ? "border-transparent bg-[#548068] text-white"
                    : "border-border/75 bg-surface-strong hover:-translate-y-0.5 hover:border-brand-olive-300 hover:bg-brand-sage-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{filteredArticles.length} contenu(x) affiche(s)</p>
          {articlesQuery.isLoading ? <p className="text-xs text-muted-foreground">Chargement des ressources...</p> : null}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.idArticle}
            title={article.titre}
            excerpt={article.contenu.slice(0, 140)}
            category={article.categorieLibelle}
            readTime={formatReadTime(article.contenu)}
            validated={true}
            href={`/prevention/${article.idArticle}`}
          />
        ))}
      </section>
    </div>
  )
}
