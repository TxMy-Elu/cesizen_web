"use client"

import { useMemo, useState } from "react"

import { ArticleCard } from "@/components/app/article-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { preventionArticles } from "@/lib/prevention-content"

const topics = ["Stress", "Sommeil", "Angoisse au travail"]

export default function PreventionPage() {
  const [activeTopic, setActiveTopic] = useState<string>("Tous")

  const filteredArticles = useMemo(() => {
    if (activeTopic === "Tous") {
      return preventionArticles
    }
    return preventionArticles.filter((article) => article.category === activeTopic)
  }, [activeTopic])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-linear-to-r from-surface-strong to-brand-sage-50/70 shadow-soft">
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
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            category={article.category}
            readTime={article.readTime}
            validated={article.validated}
            href={`/prevention/${article.slug}`}
          />
        ))}
      </section>
    </div>
  )
}
