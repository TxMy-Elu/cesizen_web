import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const accessibilitySections = [
  {
    title: "Declaration d'accessibilite",
    items: [
      "Etat de conformite : partiellement conforme au RGAA (audit complet en cours).",
      "Derniere evaluation : 12 avril 2026.",
      "Perimetre : pages publiques, module respiration, espace profil et back-office.",
    ],
  },
  {
    title: "Bonnes pratiques appliquees",
    items: [
      "Contrastes renforces sur les parcours critiques et les actions d'urgence.",
      "Navigation clavier possible sur l'ensemble des ecrans principaux.",
      "Hiérarchie de titres et libelles de formulaire optimises pour lecteurs d'ecran.",
    ],
  },
  {
    title: "Signaler un probleme",
    items: [
      "Contact : accessibilite@cesizen.fr",
      "Delai de reponse cible : 7 jours ouvres.",
      "En cas d'absence de reponse satisfaisante, un recours peut etre engage aupres de l'Arcom.",
    ],
  },
]

export default function AccessibilitePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <Card className="border border-[#7aa88a]/25 bg-linear-to-r from-white via-white to-brand-sage-50/55 shadow-subtle">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Accessibilite</CardTitle>
          <p className="text-sm text-muted-foreground">
            CESIZEN applique une interface zen et lisible pour reduire la charge cognitive, y compris en situation de stress.
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {accessibilitySections.map((section) => (
          <Card key={section.title} className="border border-[#7aa88a]/22 bg-surface/95 shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

