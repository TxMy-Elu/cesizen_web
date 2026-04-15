export type NavigationItem = {
  label: string
  href: string
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Respiration", href: "/respiration" },
  { label: "Prevention", href: "/prevention" },
  { label: "Profil", href: "/profil" },
  { label: "Admin", href: "/admin" },
  { label: "Contact", href: "/contact" },
]

export const secondaryNavigation: NavigationItem[] = [
  { label: "Connexion", href: "/auth/connexion" },
  { label: "Inscription", href: "/auth/inscription" },
  { label: "Contact", href: "/contact" },
]

export const legalNavigation: NavigationItem[] = [
  { label: "Accessibilite", href: "/accessibilite" },
  { label: "Confidentialite", href: "/confidentialite" },
  { label: "Cookies", href: "/cookies" },
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "FAQ", href: "/faq" },
]
