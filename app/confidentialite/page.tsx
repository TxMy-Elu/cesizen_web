import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Politique de confidentialite | CESIZEN",
  description:
    "Informations RGPD CESIZEN : donnees traitees, finalites, conservation, securite et droits des utilisateurs.",
}

const sections = [
  {
    title: "Responsable du traitement",
    items: [
      "CESIZEN Sante Numerique SAS, 42 rue de la Republique, 69002 Lyon.",
      "Contact : contact@cesizen.fr",
      "Delegue a la protection des donnees : dpo@cesizen.fr",
    ],
  },
  {
    title: "Donnees traitees et finalites",
    items: [
      "Donnees de compte (email, mot de passe chiffre) pour l'authentification.",
      "Donnees de suivi (sessions de respiration, preferences) pour le tableau de bord utilisateur.",
      "Journaux techniques de securite pour la protection de la plateforme.",
    ],
  },
  {
    title: "Base legale et conservation",
    items: [
      "Execution du service et consentement explicite pour le suivi de donnees de sante.",
      "Historique de pratique conserve 24 mois puis anonymisation ou suppression.",
      "Journaux de securite conserves 12 mois.",
    ],
  },
  {
    title: "Vos droits",
    items: [
      "Vous pouvez demander l'acces, la rectification, la suppression ou la portabilite de vos donnees.",
      "Vous pouvez retirer votre consentement depuis votre espace profil ou via dpo@cesizen.fr.",
      "Vous pouvez saisir la CNIL en cas de desaccord persistant.",
    ],
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <Card className="border border-[#7aa88a]/25 bg-linear-to-r from-white via-white to-brand-sage-50/55 shadow-subtle">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Politique de confidentialite</CardTitle>
          <p className="text-sm text-muted-foreground">
            Derniere mise a jour : 12 avril 2026. Cette page decrit comment CESIZEN protege vos donnees personnelles.
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {sections.map((section) => (
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

