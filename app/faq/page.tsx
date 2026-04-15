import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqItems = [
  {
    q: "Puis-je utiliser CESIZEN sans compte ?",
    a: "Oui. L'acces au module respiration et aux contenus de prevention est possible sans connexion.",
  },
  {
    q: "Que se passe-t-il en mode anonyme ?",
    a: "Conformement a la regle RG-PRIV-01, aucune donnee d'usage n'est stockee sur le serveur sans connexion.",
  },
  {
    q: "A quoi servent les lignes d'urgence ?",
    a: "En cas de crise, vous pouvez appeler rapidement le 15, le 112 ou le 3114 depuis l'interface.",
  },
  {
    q: "Les contenus prevention sont-ils verifies ?",
    a: "Oui. Les articles affichent une mention de validation par des professionnels de sante.",
  },
]

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">FAQ</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <Card key={item.q} className="border border-[#7aa88a]/22 bg-surface/95 shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.a}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

