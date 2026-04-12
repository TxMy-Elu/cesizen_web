export type PreventionArticle = {
  slug: string
  title: string
  excerpt: string
  category: "Stress" | "Sommeil" | "Prevention"
  readTime: string
  validated: boolean
  content: string[]
}

export const preventionArticles: PreventionArticle[] = [
  {
    slug: "ancrage-travail",
    title: "Comment gerer une montee d'angoisse au travail",
    excerpt: "Techniques courtes de respiration et d'ancrage pour retrouver un etat stable.",
    category: "Stress",
    readTime: "5 min",
    validated: true,
    content: [
      "Commencez par poser les deux pieds au sol et allonger l'expiration.",
      "Nommez trois elements visibles autour de vous pour revenir dans l'instant.",
      "Prenez une pause de 90 secondes avant de reprendre votre activite.",
    ],
  },
  {
    slug: "rituel-sommeil",
    title: "Routine du soir pour ameliorer le sommeil",
    excerpt: "Un enchainement simple pour reduire la charge mentale avant le coucher.",
    category: "Sommeil",
    readTime: "7 min",
    validated: true,
    content: [
      "Coupez les ecrans 30 minutes avant le coucher.",
      "Pratiquez 5 cycles de respiration lente en position confortable.",
      "Notez en une phrase la priorite de demain pour liberer l'esprit.",
    ],
  },
  {
    slug: "respiration-minute-crise",
    title: "Comprendre la coherence cardiaque",
    excerpt: "Pourquoi le rythme respiratoire influence le stress au quotidien.",
    category: "Prevention",
    readTime: "6 min",
    validated: true,
    content: [
      "Le rythme 5 secondes inspiration / 5 secondes expiration stabilise la frequence cardiaque.",
      "Une pratique reguliere de 5 minutes, 2 a 3 fois par jour, suffit a observer des effets.",
      "L'objectif est la regularite et non la performance.",
    ],
  },
]

export function getPreventionArticleBySlug(slug: string) {
  return preventionArticles.find((article) => article.slug === slug)
}

