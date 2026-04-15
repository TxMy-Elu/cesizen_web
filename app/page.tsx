"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quickAccess = [
  {
    title: "Respiration guidée",
    description:
      "Lancez une session immédiatement, même hors-ligne, pour retrouver le calme.",
    href: "/respiration",
    cta: "Démarrer maintenant",
  },
  {
    title: "Prévention validée",
    description:
      "Consultez des contenus thématiques validés par des professionnels de santé.",
    href: "/prevention",
    cta: "Voir les contenus",
  },
  {
    title: "Suivi personnel",
    description:
      "Accédez à votre progression, vos habitudes et vos réglages favoris.",
    href: "/profil",
    cta: "Ouvrir mon espace",
  },
];

const emergencyNumbers = ["15", "112", "3114"];

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8 md:py-12"
      initial={reduceMotion ? undefined : "hidden"}
      animate={reduceMotion ? undefined : "show"}
      transition={{ staggerChildren: 0.08 }}
    >
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <motion.div variants={fadeInUp} transition={{ duration: 0.35 }}>
          <Card className="overflow-hidden border-surface-border bg-surface-strong shadow-soft">
          <CardHeader className="space-y-4">
            <p className="w-fit rounded-full border border-border/75 bg-surface-strong px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-subtle">
              Mode urgence disponible
            </p>
            <CardTitle className="text-3xl md:text-4xl">
              Un design plus moderne pour respirer, se recentrer et agir vite
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-relaxed">
              CESIZEN offre un accès immédiat au module de cohérence cardiaque avec
              une interface zen, lisible et adaptée aux personnes en situation de
              stress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-w-44">
              <Link href="/respiration">Lancer une session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-44">
              <Link href="/auth/inscription">Créer un compte suivi</Link>
            </Button>
          </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} transition={{ duration: 0.35, delay: 0.04 }}>
          <Card className="border-surface-border bg-surface-strong shadow-soft">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Besoin d&apos;aide immédiate</CardTitle>
            <CardDescription>
              En situation de crise, contactez une ligne prioritaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyNumbers.map((line) => (
              <motion.div key={line} whileHover={reduceMotion ? undefined : { y: -1 }}>
                <Button asChild variant="destructive" className="w-full justify-between">
                  <Link href={`tel:${line}`}>
                    <span>Appeler</span>
                    <span>{line}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickAccess.map((item) => (
          <motion.div
            key={item.href}
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
          >
            <Card className="h-full">
            <CardHeader className="space-y-2">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <motion.div variants={fadeInUp} transition={{ duration: 0.3 }}>
          <Card className="bg-surface-strong">
          <CardHeader>
            <CardTitle className="text-lg">Anonymat visiteur</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sans connexion, aucune donnée d&apos;utilisation n&apos;est sauvegardée sur le
            serveur.
          </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp} transition={{ duration: 0.3 }}>
          <Card className="bg-surface-strong">
          <CardHeader>
            <CardTitle className="text-lg">Consentement explicite</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Le suivi personnel n&apos;est activé qu&apos;après acceptation explicite du
            stockage des données de santé.
          </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp} transition={{ duration: 0.3 }}>
          <Card className="bg-surface-strong">
          <CardHeader>
            <CardTitle className="text-lg">Performance prioritaire</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Interface optimisée pour accéder au module d&apos;urgence en moins de 3
            secondes.
          </CardContent>
          </Card>
        </motion.div>
      </section>
    </motion.div>
  );
}
