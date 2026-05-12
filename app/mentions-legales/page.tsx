import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Mentions legales | CESIZEN",
  description: "Mentions legales du site CESIZEN : presentation de NexHuman, hebergement, responsabilite et propriete intellectuelle.",
}

const sections = [
  {
    title: "Editeur du site",
    items: [
      "NexHuman (creation en 2020).",
      "Activite principale : conception et developpement d'applications web, mobiles, plateformes collaboratives et API.",
      "Domaines prioritaires : sante, social, education, projets publics et parapublics.",
      "Mission : accompagner la transformation numerique avec un focus experience utilisateur, accessibilite numerique et qualite des donnees.",
      "Contact : legal@cesizen.fr",
    ],
  },
  {
    title: "Services et produits proposes",
    items: [
      "Developpement logiciel : web, mobile et API.",
      "Conception UX/UI : cadrage parcours et maquettes.",
      "Deploiement, maintenance et suivi evolutif des logiciels.",
      "Analyse des besoins et accompagnement des institutions.",
    ],
  },
  {
    title: "Organisation et chiffres cles",
    items: [
      "Effectif 2025 : 1 salarie (developpement et conception logicielle).",
      "Chiffre d'affaires 2024 : 90 000 euros.",
      "Mode d'organisation : pilotage agile, priorisation produit, execution technique centralisee.",
    ],
  },
  {
    title: "Axes strategiques",
    items: [
      "Renforcement des offres en e-sante.",
      "Developpement d'applications web et mobiles a fort impact public.",
      "Cooperations institutionnelles (ministeres, associations, acteurs parapublics).",
    ],
  },

  {
    title: "Hebergement",
    items: [
      "HexaSante Cloud France",
      "12 avenue du Dome, 92800 Puteaux",
      "Serveurs situes en France et conformes aux exigences HDS.",
    ],
  },
  {
    title: "Objet du service",
    items: [
      "CESIZEN propose un module de respiration et des contenus de prevention en sante mentale.",
      "Le service ne remplace pas une consultation medicale ou une prise en charge d'urgence.",
      "En cas de danger immediat, contactez 15, 112 ou 3114.",
    ],
  },
  {
    title: "Propriete intellectuelle",
    items: [
      "Les contenus du site sont proteges par le droit d'auteur.",
      "Toute reproduction totale ou partielle sans autorisation prealable est interdite.",
    ],
  },
]

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Mentions legales</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="border-surface-border bg-surface-strong shadow-soft">
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

