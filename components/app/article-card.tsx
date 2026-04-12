import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type ArticleCardProps = {
  title: string
  excerpt: string
  category: string
  readTime: string
  validated: boolean
  href: string
}

export function ArticleCard({ title, excerpt, category, readTime, validated, href }: ArticleCardProps) {
  return (
    <Card className="h-full border-surface-border bg-linear-to-br from-surface-strong to-brand-sage-50/35 shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="secondary">{readTime}</Badge>
          {validated ? <Badge>Validé</Badge> : <Badge variant="outline">En revue</Badge>}
        </div>
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        <CardDescription className="leading-relaxed text-muted-foreground">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {validated
            ? "Validé par des professionnels de santé"
            : "Contenu en cours de validation médicale"}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="zen"
          size="lg"
          className="w-full border border-border/75 bg-brand-sand-100 text-base font-semibold text-foreground hover:bg-brand-sage-100"
        >
          <Link href={href}>Lire l&apos;article</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
