"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Activity, ChartColumn, Clock3, Eye } from "lucide-react"

import { StatsCard } from "@/components/app/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { consulterApi, exerciceApi, exercerApi, logApi, userApi } from "@/lib/api/services"
import { getSession } from "@/lib/auth/session"

const daysBetween = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const getLast7DaysLabels = () => {
  const labels: string[] = []
  const base = new Date()
  for (let index = 6; index >= 0; index -= 1) {
    const day = new Date(base)
    day.setDate(base.getDate() - index)
    labels.push(day.toLocaleDateString("fr-FR", { weekday: "short" }))
  }
  return labels
}

export default function AdminStatistiquesPage() {
  const session = getSession()
  const token = session?.token ?? null

  const usersQuery = useQuery({
    queryKey: ["admin", "stats", "users"],
    queryFn: () => userApi.list(token!),
    enabled: Boolean(token),
  })

  const exercicesQuery = useQuery({
    queryKey: ["admin", "stats", "exercices"],
    queryFn: exerciceApi.list,
    enabled: Boolean(token),
  })

  const sessionsQuery = useQuery({
    queryKey: ["admin", "stats", "sessions"],
    queryFn: () => exercerApi.list(token!),
    enabled: Boolean(token),
  })

  const viewsQuery = useQuery({
    queryKey: ["admin", "stats", "views"],
    queryFn: () => consulterApi.list(token!),
    enabled: Boolean(token),
  })

  const logConnexionsQuery = useQuery({
    queryKey: ["admin", "stats", "log-connexions"],
    queryFn: () => logApi.connexions(token!),
    enabled: Boolean(token),
  })

  const logActivitesQuery = useQuery({
    queryKey: ["admin", "stats", "log-activites"],
    queryFn: () => logApi.activites(token!),
    enabled: Boolean(token),
  })

  const computed = useMemo(() => {
    const now = new Date()
    const users = usersQuery.data ?? []
    const exercices = exercicesQuery.data ?? []
    const sessions = sessionsQuery.data ?? []
    const views = viewsQuery.data ?? []
    const logConnexions = logConnexionsQuery.data ?? []
    const logActivites = logActivitesQuery.data ?? []

    const isWithinDays = (isoDate: string, days: number) => daysBetween(new Date(isoDate), now) <= days

    const activeUsers = users.filter((user) => user.active).length
    const sessionsLast7Days = sessions.filter((item) => isWithinDays(item.completedAt, 7)).length
    const sessionsLast30Days = sessions.filter((item) => isWithinDays(item.completedAt, 30)).length
    const viewsLast30Days = views.filter((item) => isWithinDays(item.viewedAt, 30)).length
    const uniqueArticlesLast30Days = new Set(
      views.filter((item) => isWithinDays(item.viewedAt, 30)).map((item) => item.idArticle)
    ).size

    const successRate =
      logConnexions.length > 0
        ? Math.round((logConnexions.filter((item) => item.reussite).length / logConnexions.length) * 100)
        : 0

    const averageSessionsPerActiveUser =
      activeUsers > 0 ? (sessionsLast30Days / activeUsers).toFixed(1) : "0.0"

    const averageCycleSeconds = (() => {
      if (sessions.length === 0) {
        return 0
      }
      const total = sessions.reduce((acc, item) => {
        const exercice = exercices.find((entry) => entry.idExercice === item.exercice.idExercice)
        if (!exercice) {
          return acc
        }
        return acc + exercice.dureeInspiration + exercice.dureeApnee + exercice.dureeExpiration
      }, 0)
      return Math.round(total / sessions.length)
    })()

    const createCount = logActivites.filter((item) => item.typeAction === "CREATE").length
    const updateCount = logActivites.filter((item) => item.typeAction === "UPDATE").length
    const deleteCount = logActivites.filter((item) => item.typeAction === "DELETE").length

    const daysLabels = getLast7DaysLabels()

    const sessionsByDay = daysLabels.map((_, index) => {
      const target = new Date()
      target.setDate(target.getDate() - (6 - index))
      const key = target.toISOString().slice(0, 10)
      return sessions.filter((item) => item.completedAt.slice(0, 10) === key).length
    })

    const viewsByDay = daysLabels.map((_, index) => {
      const target = new Date()
      target.setDate(target.getDate() - (6 - index))
      const key = target.toISOString().slice(0, 10)
      return views.filter((item) => item.viewedAt.slice(0, 10) === key).length
    })

    const maxSessionsDay = Math.max(...sessionsByDay, 1)
    const maxViewsDay = Math.max(...viewsByDay, 1)

    const completionRate = Math.min(100, Math.round((sessionsLast7Days / (activeUsers * 2 || 1)) * 100))

    const stats = [
      { label: "Utilisateurs actifs", value: String(activeUsers), description: "Comptes avec statut actif" },
      { label: "Sessions (7 jours)", value: String(sessionsLast7Days), description: "Séances de respiration cette semaine" },
      { label: "Cycle moyen", value: `${averageCycleSeconds}s`, description: "Durée moyenne inspiration + apnée + expiration" },
    ]

    const rows = [
      { metric: "Sessions sur 30 jours", value: String(sessionsLast30Days), source: "Séances de respiration" },
      {
        metric: "Moyenne sessions par utilisateur actif",
        value: averageSessionsPerActiveUser,
        source: "Calculé sur les 30 derniers jours",
      },
      { metric: "Vues prévention (30 jours)", value: String(viewsLast30Days), source: "Consultations d'articles" },
      { metric: "Articles prévention uniques", value: String(uniqueArticlesLast30Days), source: "Articles distincts consultés" },
      { metric: "Taux de connexion réussie", value: `${successRate}%`, source: "Historique des authentifications" },
      { metric: "Actions de création", value: String(createCount), source: "Journal d'activité" },
      { metric: "Actions de modification", value: String(updateCount), source: "Journal d'activité" },
      { metric: "Actions de suppression", value: String(deleteCount), source: "Journal d'activité" },
    ]

    return {
      stats,
      rows,
      daysLabels,
      sessionsByDay,
      viewsByDay,
      maxSessionsDay,
      maxViewsDay,
      successRate,
      completionRate,
      createCount,
      updateCount,
      deleteCount,
    }
  }, [
    usersQuery.data,
    exercicesQuery.data,
    sessionsQuery.data,
    viewsQuery.data,
    logConnexionsQuery.data,
    logActivitesQuery.data,
  ])

  const loadError =
    usersQuery.error ??
    exercicesQuery.error ??
    sessionsQuery.error ??
    viewsQuery.error ??
    logConnexionsQuery.error ??
    logActivitesQuery.error

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">Statistiques indisponibles</CardTitle>
            <CardDescription className="text-base">
              Les donnees admin n&apos;ont pas pu etre chargees depuis l&apos;API.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {loadError.message}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Acces admin requis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connectez-vous avec un compte administrateur pour consulter les statistiques.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Statistiques globales</CardTitle>
          <CardDescription className="text-base">
            Donnees strictement agregees et anonymisees pour le suivi ministere.
          </CardDescription>
          {usersQuery.isLoading || sessionsQuery.isLoading || viewsQuery.isLoading ? (
            <p className="text-xs text-muted-foreground">Chargement des indicateurs...</p>
          ) : null}
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {computed.stats.map((item) => (
          <StatsCard
            key={item.label}
            label={item.label}
            value={item.value}
            description={item.description}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/75 bg-surface-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ChartColumn className="h-4 w-4 text-primary" />
              Sessions respiration (7 jours)
            </CardTitle>
            <CardDescription>Nombre de séances complétées par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 items-end gap-2">
              {computed.sessionsByDay.map((value, index) => (
                <div key={`${computed.daysLabels[index]}-${index}`} className="space-y-2 text-center">
                  <div className="flex h-28 items-end justify-center rounded-lg bg-surface p-1">
                    <div
                      className="w-full rounded-md bg-primary/85"
                      style={{ height: `${Math.max(8, Math.round((value / computed.maxSessionsDay) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{computed.daysLabels[index]}</p>
                  <p className="text-xs font-semibold text-brand-dark">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/75 bg-surface-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4 text-primary" />
              Consultations prevention (7 jours)
            </CardTitle>
            <CardDescription>Nombre d&apos;articles consultés par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 items-end gap-2">
              {computed.viewsByDay.map((value, index) => (
                <div key={`${computed.daysLabels[index]}-views-${index}`} className="space-y-2 text-center">
                  <div className="flex h-28 items-end justify-center rounded-lg bg-surface p-1">
                    <div
                      className="w-full rounded-md bg-brand-sage-500/85"
                      style={{ height: `${Math.max(8, Math.round((value / computed.maxViewsDay) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{computed.daysLabels[index]}</p>
                  <p className="text-xs font-semibold text-brand-dark">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/75 bg-surface-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Taux de reussite connexion
            </CardTitle>
            <p className="text-2xl font-bold text-brand-dark">{computed.successRate}%</p>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-primary" style={{ width: `${computed.successRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/75 bg-surface-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-primary" />
              Completion cible hebdo
            </CardTitle>
            <p className="text-2xl font-bold text-brand-dark">{computed.completionRate}%</p>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-brand-sage-500" style={{ width: `${computed.completionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/75 bg-surface-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Repartition logs activite</CardTitle>
            <p className="text-sm text-muted-foreground">CREATE / UPDATE / DELETE</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>CREATE</span><span className="font-semibold">{computed.createCount}</span></div>
            <div className="flex items-center justify-between"><span>UPDATE</span><span className="font-semibold">{computed.updateCount}</span></div>
            <div className="flex items-center justify-between"><span>DELETE</span><span className="font-semibold">{computed.deleteCount}</span></div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Indicateurs detailles</CardTitle>
          <CardDescription>
            Vue agrégée et anonymisée — aucune donnée personnelle affichée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicateur</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computed.rows.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium text-brand-dark">{row.metric}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {usersQuery.error || sessionsQuery.error || viewsQuery.error || logConnexionsQuery.error || logActivitesQuery.error ? (
            <p className="mt-3 text-xs text-destructive">Des erreurs API sont presentes. Verifiez les autorisations admin.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
