import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleViewTracker } from "@/components/app/article-view-tracker"
import { MediaDownloadButton } from "@/components/app/media-download-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { articleApi } from "@/lib/api/services"
import { getMediaUrl } from "@/lib/supabase"

function renderApiArticle(article: Awaited<ReturnType<typeof articleApi.getById>>) {
  const mediaUrl = getMediaUrl(article.mediaUrl)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 md:px-8">
      <ArticleViewTracker articleId={article.idArticle} />
      <Badge variant="secondary">{article.categorieLibelle}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">{article.titre}</h1>
      <p className="text-base text-brand-dark/75">Ressource validée par des professionnels de santé.</p>

      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>Contenu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-dark/85">{article.contenu}</p>
          {mediaUrl ? (
            <MediaDownloadButton
              mediaUrl={mediaUrl}
              filename={`${article.titre}.${mediaUrl.split(".").at(-1) ?? "pdf"}`}
              label="Télécharger le document associé"
            />
          ) : null}
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="rounded-full">
        <Link href="/prevention">Retour au catalogue</Link>
      </Button>
    </div>
  )
}

type PreventionDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PreventionDetailPage({ params }: PreventionDetailPageProps) {
  const { slug } = await params

  const articleId = Number(slug)
  if (!Number.isInteger(articleId) || articleId <= 0) {
    notFound()
  }

  try {
    const apiArticle = await articleApi.getById(articleId)
    return renderApiArticle(apiArticle)
  } catch {
    notFound()
  }
}

