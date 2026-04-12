"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type ExercerDtoMock = {
	idExercer: number
	idUtilisateur: number
	idExercice: number
	completedAt: string
}

type ConsulterDtoMock = {
	idConsulter: number
	idUtilisateur: number
	idArticle: number
	viewedAt: string
}

const userDto = {
	id: 12,
	nom: "Martin",
	prenom: "Camille",
	email: "camille.martin@example.com",
	active: true,
	creationDate: "2026-03-30T10:15:30Z",
	roleId: 2,
	roleLibelle: "ROLE_USER",
}

const roleDisplayMap: Record<string, string> = {
	ROLE_USER: "Utilisateur connecté",
	ROLE_ADMIN: "Administrateur de la solution",
}

const mockExercer: ExercerDtoMock[] = [
	{ idExercer: 1, idUtilisateur: 12, idExercice: 1, completedAt: "2026-04-12T08:10:00Z" },
	{ idExercer: 2, idUtilisateur: 12, idExercice: 2, completedAt: "2026-04-11T19:05:00Z" },
	{ idExercer: 3, idUtilisateur: 12, idExercice: 1, completedAt: "2026-04-10T07:50:00Z" },
	{ idExercer: 4, idUtilisateur: 12, idExercice: 3, completedAt: "2026-04-09T21:20:00Z" },
	{ idExercer: 5, idUtilisateur: 12, idExercice: 1, completedAt: "2026-04-06T09:00:00Z" },
	{ idExercer: 6, idUtilisateur: 12, idExercice: 2, completedAt: "2026-04-03T18:40:00Z" },
	{ idExercer: 7, idUtilisateur: 12, idExercice: 1, completedAt: "2026-03-30T10:20:00Z" },
	{ idExercer: 8, idUtilisateur: 12, idExercice: 3, completedAt: "2026-03-29T11:12:00Z" },
]

const mockConsulter: ConsulterDtoMock[] = [
	{ idConsulter: 1, idUtilisateur: 12, idArticle: 101, viewedAt: "2026-04-12T09:00:00Z" },
	{ idConsulter: 2, idUtilisateur: 12, idArticle: 102, viewedAt: "2026-04-11T20:00:00Z" },
	{ idConsulter: 3, idUtilisateur: 12, idArticle: 101, viewedAt: "2026-04-10T09:30:00Z" },
	{ idConsulter: 4, idUtilisateur: 12, idArticle: 103, viewedAt: "2026-04-08T18:15:00Z" },
	{ idConsulter: 5, idUtilisateur: 12, idArticle: 104, viewedAt: "2026-04-05T14:45:00Z" },
	{ idConsulter: 6, idUtilisateur: 12, idArticle: 102, viewedAt: "2026-04-02T13:10:00Z" },
	{ idConsulter: 7, idUtilisateur: 12, idArticle: 105, viewedAt: "2026-03-31T16:25:00Z" },
]

const daysBetween = (from: Date, to: Date) => {
	const diff = to.getTime() - from.getTime()
	return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const computeStreak = (sessions: ExercerDtoMock[]) => {
	const uniqueDays = new Set(
		sessions.map((session) => new Date(session.completedAt).toISOString().slice(0, 10))
	)
	const sorted = Array.from(uniqueDays).sort().reverse()
	if (sorted.length === 0) {
		return 0
	}

	let streak = 1
	for (let index = 1; index < sorted.length; index += 1) {
		const prev = new Date(`${sorted[index - 1]}T00:00:00Z`)
		const curr = new Date(`${sorted[index]}T00:00:00Z`)
		if (daysBetween(curr, prev) === 1) {
			streak += 1
		} else {
			break
		}
	}

	return streak
}

const now = new Date("2026-04-12T23:59:59Z")
const sessionsLast7Days = mockExercer.filter(
	(session) => daysBetween(new Date(session.completedAt), now) <= 7
).length
const sessionsLast30Days = mockExercer.filter(
	(session) => daysBetween(new Date(session.completedAt), now) <= 30
).length
const latestSessionDate = mockExercer
	.map((session) => new Date(session.completedAt))
	.sort((a, b) => b.getTime() - a.getTime())[0]
const daysSinceLastSession = latestSessionDate ? daysBetween(latestSessionDate, now) : 0
const streakDays = computeStreak(mockExercer)
const articleViewsTotal = mockConsulter.length
const uniqueArticlesRead = new Set(mockConsulter.map((view) => view.idArticle)).size

const activityStats = [
	{ label: "Sessions (7 jours)", value: String(sessionsLast7Days), helper: "GET /api/exercer/user/{userId}" },
	{ label: "Sessions (30 jours)", value: String(sessionsLast30Days), helper: "GET /api/exercer/user/{userId}" },
	{ label: "Serie active", value: `${streakDays} jour(s)`, helper: "Calcul sur completedAt (ExercerDto)" },
	{ label: "Derniere session", value: `Il y a ${daysSinceLastSession} jour(s)`, helper: "Max(completedAt)" },
	{ label: "Vues articles", value: String(articleViewsTotal), helper: "GET /api/consulter/user/{userId}" },
	{ label: "Articles uniques", value: String(uniqueArticlesRead), helper: "Distinct idArticle" },
]

export default function ProfilePage() {
	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			<Card className="border-surface-border bg-linear-to-br from-surface-strong via-brand-sage-50/65 to-brand-sand-50/70">
				<CardHeader className="space-y-4">
					<Badge className="w-fit" variant="secondary">
						Espace utilisateur
					</Badge>
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="max-w-3xl space-y-2">
							<CardTitle className="text-3xl md:text-4xl">
								Profil utilisateur
							</CardTitle>
							<p className="text-sm leading-relaxed text-muted-foreground md:text-base">
								Affichage aligne avec les donnees exposees par l&apos;API (UserDto et compteurs d&apos;activite).
							</p>
						</div>
						<Button
							variant="outline"
							className="min-w-44"
							onClick={() => toast.success("Export simule", { description: "Un fichier JSON de demonstration a ete genere." })}
						>
							Exporter mes données
						</Button>
					</div>
				</CardHeader>
				<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-xl border border-border/75 bg-surface-strong p-4 shadow-subtle">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">ID</p>
						<p className="mt-1 text-2xl font-bold text-brand-dark">{userDto.id}</p>
					</div>
					<div className="rounded-xl border border-border/75 bg-surface-strong p-4 shadow-subtle">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Nom complet</p>
						<p className="mt-1 text-lg font-bold text-brand-dark">{userDto.prenom} {userDto.nom}</p>
					</div>
					<div className="rounded-xl border border-border/75 bg-surface-strong p-4 shadow-subtle">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
						<p className="mt-1 text-sm font-semibold text-brand-dark">{userDto.email}</p>
					</div>
					<div className="rounded-xl border border-border/75 bg-surface-strong p-4 shadow-subtle">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
						<p className="mt-1 text-sm font-semibold text-brand-dark">
							{roleDisplayMap[userDto.roleLibelle] ?? userDto.roleLibelle} (id: {userDto.roleId})
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Etat du compte</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p><span className="font-semibold text-brand-dark">Actif:</span> {userDto.active ? "Oui" : "Non"}</p>
					<p><span className="font-semibold text-brand-dark">Date de creation:</span> {new Date(userDto.creationDate).toLocaleDateString("fr-FR")}</p>
				</CardContent>
			</Card>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{activityStats.map((item) => (
					<Card key={item.label} className="border-border/75 bg-surface-strong">
						<CardHeader className="space-y-2">
							<CardTitle className="text-base">{item.label}</CardTitle>
							<p className="text-2xl font-bold text-brand-dark">{item.value}</p>
							<p className="text-xs text-muted-foreground">{item.helper}</p>
						</CardHeader>
					</Card>
				))}
			</section>
		</div>
	)
}
