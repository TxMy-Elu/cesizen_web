import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPreventionArticleBySlug, preventionArticles } from "@/lib/prevention-content"

type PreventionDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return preventionArticles.map((article) => ({ slug: article.slug }))
}

export default async function PreventionDetailPage({ params }: PreventionDetailPageProps) {
  const { slug } = await params
  const article = getPreventionArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 md:px-8">
      <Badge variant="secondary">{article.category}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">{article.title}</h1>
      <p className="text-base text-brand-dark/75">{article.excerpt}</p>

      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>Points cles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm leading-relaxed text-brand-dark/80">
            {article.content.map((item) => (
              <li key={item} className="rounded-xl border border-border/70 bg-brand-sage-50/40 p-3">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="rounded-full">
        <Link href="/prevention">Retour au catalogue</Link>
      </Button>
    </div>
  )
}

