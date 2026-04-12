import { StatsCard } from "@/components/app/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ChartColumn, Clock3, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type UserDtoMock = {
  id: number
  active: boolean
  creationDate: string
  roleLibelle: string
}

type ExerciceDtoMock = {
  idExercice: number
  dureeInspiration: number
  dureeApnee: number
  dureeExpiration: number
}

type ExercerDtoMock = {
  idExercer: number
  userId: number
  exerciceId: number
  completedAt: string
}

type ConsulterDtoMock = {
  idConsulter: number
  idUtilisateur: number
  idArticle: number
  viewedAt: string
}

type LogConnexionDtoMock = {
  idLogConnexion: number
  dateConnexion: string
  reussite: boolean
}

type LogActiviteDtoMock = {
  idLogActivite: number
  dateAction: string
  typeAction: "CREATE" | "UPDATE" | "DELETE"
}

const now = new Date("2026-04-12T23:59:59Z")

const users: UserDtoMock[] = [
  { id: 1, active: true, creationDate: "2026-03-01T10:00:00Z", roleLibelle: "ROLE_USER" },
  { id: 2, active: true, creationDate: "2026-03-08T11:15:00Z", roleLibelle: "ROLE_USER" },
  { id: 3, active: false, creationDate: "2026-02-28T14:30:00Z", roleLibelle: "ROLE_USER" },
  { id: 4, active: true, creationDate: "2026-03-18T09:20:00Z", roleLibelle: "ROLE_USER" },
  { id: 5, active: true, creationDate: "2026-04-02T17:45:00Z", roleLibelle: "ROLE_USER" },
  { id: 6, active: true, creationDate: "2026-04-10T08:45:00Z", roleLibelle: "ROLE_USER" },
]

const exercices: ExerciceDtoMock[] = [
  { idExercice: 1, dureeInspiration: 5, dureeApnee: 0, dureeExpiration: 5 },
  { idExercice: 2, dureeInspiration: 6, dureeApnee: 2, dureeExpiration: 6 },
  { idExercice: 3, dureeInspiration: 4, dureeApnee: 0, dureeExpiration: 6 },
]

const sessions: ExercerDtoMock[] = [
  { idExercer: 1, userId: 1, exerciceId: 1, completedAt: "2026-04-12T09:00:00Z" },
  { idExercer: 2, userId: 2, exerciceId: 2, completedAt: "2026-04-12T14:20:00Z" },
  { idExercer: 3, userId: 1, exerciceId: 1, completedAt: "2026-04-11T08:40:00Z" },
  { idExercer: 4, userId: 4, exerciceId: 3, completedAt: "2026-04-11T18:10:00Z" },
  { idExercer: 5, userId: 5, exerciceId: 2, completedAt: "2026-04-10T10:30:00Z" },
  { idExercer: 6, userId: 6, exerciceId: 1, completedAt: "2026-04-09T07:15:00Z" },
  { idExercer: 7, userId: 2, exerciceId: 1, completedAt: "2026-04-06T12:00:00Z" },
  { idExercer: 8, userId: 1, exerciceId: 3, completedAt: "2026-04-03T20:10:00Z" },
  { idExercer: 9, userId: 4, exerciceId: 2, completedAt: "2026-03-30T09:05:00Z" },
  { idExercer: 10, userId: 5, exerciceId: 1, completedAt: "2026-03-27T16:00:00Z" },
]

const views: ConsulterDtoMock[] = [
  { idConsulter: 1, idUtilisateur: 1, idArticle: 101, viewedAt: "2026-04-12T09:10:00Z" },
  { idConsulter: 2, idUtilisateur: 2, idArticle: 102, viewedAt: "2026-04-12T19:00:00Z" },
  { idConsulter: 3, idUtilisateur: 1, idArticle: 101, viewedAt: "2026-04-11T09:20:00Z" },
  { idConsulter: 4, idUtilisateur: 4, idArticle: 103, viewedAt: "2026-04-10T17:40:00Z" },
  { idConsulter: 5, idUtilisateur: 5, idArticle: 104, viewedAt: "2026-04-08T11:25:00Z" },
  { idConsulter: 6, idUtilisateur: 2, idArticle: 102, viewedAt: "2026-04-06T13:50:00Z" },
  { idConsulter: 7, idUtilisateur: 6, idArticle: 105, viewedAt: "2026-04-04T08:45:00Z" },
  { idConsulter: 8, idUtilisateur: 1, idArticle: 106, viewedAt: "2026-03-31T18:15:00Z" },
]

const logConnexions: LogConnexionDtoMock[] = [
  { idLogConnexion: 1, dateConnexion: "2026-04-12T08:00:00Z", reussite: true },
  { idLogConnexion: 2, dateConnexion: "2026-04-12T08:03:00Z", reussite: false },
  { idLogConnexion: 3, dateConnexion: "2026-04-11T18:15:00Z", reussite: true },
  { idLogConnexion: 4, dateConnexion: "2026-04-10T07:55:00Z", reussite: true },
  { idLogConnexion: 5, dateConnexion: "2026-04-09T20:22:00Z", reussite: true },
]

const logActivites: LogActiviteDtoMock[] = [
  { idLogActivite: 1, dateAction: "2026-04-12T09:00:00Z", typeAction: "CREATE" },
  { idLogActivite: 2, dateAction: "2026-04-12T10:00:00Z", typeAction: "UPDATE" },
  { idLogActivite: 3, dateAction: "2026-04-11T16:30:00Z", typeAction: "UPDATE" },
  { idLogActivite: 4, dateAction: "2026-04-10T15:10:00Z", typeAction: "DELETE" },
  { idLogActivite: 5, dateAction: "2026-04-09T13:45:00Z", typeAction: "CREATE" },
]

const daysBetween = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const isWithinDays = (isoDate: string, days: number) =>
  daysBetween(new Date(isoDate), now) <= days

const activeUsers = users.filter((user) => user.active).length
const sessionsLast7Days = sessions.filter((session) => isWithinDays(session.completedAt, 7)).length
const sessionsLast30Days = sessions.filter((session) => isWithinDays(session.completedAt, 30)).length
const viewsLast30Days = views.filter((view) => isWithinDays(view.viewedAt, 30)).length
const uniqueArticlesLast30Days = new Set(
  views.filter((view) => isWithinDays(view.viewedAt, 30)).map((view) => view.idArticle)
).size
const successRate =
  logConnexions.length > 0
    ? Math.round((logConnexions.filter((log) => log.reussite).length / logConnexions.length) * 100)
    : 0

const averageSessionsPerActiveUser =
  activeUsers > 0 ? (sessionsLast30Days / activeUsers).toFixed(1) : "0.0"

const averageCycleSeconds = (() => {
  if (sessions.length === 0) {
    return 0
  }
  const total = sessions.reduce((acc, session) => {
    const exercice = exercices.find((item) => item.idExercice === session.exerciceId)
    if (!exercice) {
      return acc
    }
    return acc + exercice.dureeInspiration + exercice.dureeApnee + exercice.dureeExpiration
  }, 0)
  return Math.round(total / sessions.length)
})()

const createCount = logActivites.filter((log) => log.typeAction === "CREATE").length
const updateCount = logActivites.filter((log) => log.typeAction === "UPDATE").length
const deleteCount = logActivites.filter((log) => log.typeAction === "DELETE").length

const daysLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const sessionsByDay = [3, 5, 4, 6, 7, 5, 8]
const viewsByDay = [4, 3, 5, 7, 6, 8, 9]

const maxSessionsDay = Math.max(...sessionsByDay)
const maxViewsDay = Math.max(...viewsByDay)

const completionRate = Math.min(100, Math.round((sessionsLast7Days / (activeUsers * 2 || 1)) * 100))

const stats = [
  { label: "Utilisateurs actifs", value: String(activeUsers), description: "GET /api/user/list (active=true)" },
  { label: "Sessions (7 jours)", value: String(sessionsLast7Days), description: "GET /api/exercer/list" },
  { label: "Cycle moyen", value: `${averageCycleSeconds}s`, description: "Jointure /api/exercer + /api/exercice" },
]

const rows = [
  { metric: "Sessions sur 30 jours", value: String(sessionsLast30Days), source: "GET /api/exercer/list" },
  {
    metric: "Moyenne sessions par utilisateur actif",
    value: averageSessionsPerActiveUser,
    source: "Sessions30 / utilisateurs actifs",
  },
  { metric: "Vues prevention (30 jours)", value: String(viewsLast30Days), source: "GET /api/consulter/list" },
  { metric: "Articles prevention uniques", value: String(uniqueArticlesLast30Days), source: "Distinct idArticle" },
  { metric: "Taux de connexion reussie", value: `${successRate}%`, source: "GET /api/log-connexion/list" },
  { metric: "Logs activite CREATE", value: String(createCount), source: "GET /api/log-activite/list" },
  { metric: "Logs activite UPDATE", value: String(updateCount), source: "GET /api/log-activite/list" },
  { metric: "Logs activite DELETE", value: String(deleteCount), source: "GET /api/log-activite/list" },
]

export default function AdminStatistiquesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-linear-to-r from-surface-strong to-brand-sage-50/60">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Statistiques globales</CardTitle>
          <CardDescription className="text-base">
            Données strictement agrégées et anonymisées pour le suivi ministère.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
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
            <CardDescription>Aggregation journaliere issue de /api/exercer/list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 items-end gap-2">
              {sessionsByDay.map((value, index) => (
                <div key={daysLabels[index]} className="space-y-2 text-center">
                  <div className="flex h-28 items-end justify-center rounded-lg bg-surface p-1">
                    <div
                      className="w-full rounded-md bg-primary/85"
                      style={{ height: `${Math.max(8, Math.round((value / maxSessionsDay) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{daysLabels[index]}</p>
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
            <CardDescription>Aggregation journaliere issue de /api/consulter/list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 items-end gap-2">
              {viewsByDay.map((value, index) => (
                <div key={daysLabels[index]} className="space-y-2 text-center">
                  <div className="flex h-28 items-end justify-center rounded-lg bg-surface p-1">
                    <div
                      className="w-full rounded-md bg-brand-sage-500/85"
                      style={{ height: `${Math.max(8, Math.round((value / maxViewsDay) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{daysLabels[index]}</p>
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
            <p className="text-2xl font-bold text-brand-dark">{successRate}%</p>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-primary" style={{ width: `${successRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/75 bg-surface-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-primary" />
              Completion cible hebdo
            </CardTitle>
            <p className="text-2xl font-bold text-brand-dark">{completionRate}%</p>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-brand-sage-500" style={{ width: `${completionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/75 bg-surface-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Repartition logs activite</CardTitle>
            <p className="text-sm text-muted-foreground">CREATE / UPDATE / DELETE</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>CREATE</span><span className="font-semibold">{createCount}</span></div>
            <div className="flex items-center justify-between"><span>UPDATE</span><span className="font-semibold">{updateCount}</span></div>
            <div className="flex items-center justify-between"><span>DELETE</span><span className="font-semibold">{deleteCount}</span></div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Indicateurs détaillés</CardTitle>
          <CardDescription>
            Vue strictement agrégée et anonymisée, calculée depuis des structures de données alignées API.
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
              {rows.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium text-brand-dark">{row.metric}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
