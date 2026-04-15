"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { consulterApi, exercerApi } from "@/lib/api/services"
import { clearSession, getSession } from "@/lib/auth/session"
import { toast } from "sonner"

const roleDisplayMap: Record<string, string> = {
	ROLE_USER: "Utilisateur connecté",
	ROLE_ADMIN: "Administrateur de la solution",
}

const daysBetween = (from: Date, to: Date) => {
	const diff = to.getTime() - from.getTime()
	return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const computeStreak = (sessions: { completedAt: string }[]) => {
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

export default function ProfilePage() {
	const session = getSession()
	const token = session?.token ?? null

	const sessionsQuery = useQuery({
		queryKey: ["profile", "sessions", session?.userId],
		queryFn: () => exercerApi.byUser(session!.userId, token!),
		enabled: Boolean(session?.userId && token),
	})

	const viewsQuery = useQuery({
		queryKey: ["profile", "views", session?.userId],
		queryFn: () => consulterApi.byUser(session!.userId, token!),
		enabled: Boolean(session?.userId && token),
	})

	const activityStats = useMemo(() => {
		const now = new Date()
		const sessions = sessionsQuery.data ?? []
		const views = viewsQuery.data ?? []

		const sessionsLast7Days = sessions.filter(
			(item) => daysBetween(new Date(item.completedAt), now) <= 7
		).length
		const sessionsLast30Days = sessions.filter(
			(item) => daysBetween(new Date(item.completedAt), now) <= 30
		).length

		const latestSessionDate = sessions
			.map((item) => new Date(item.completedAt))
			.sort((a, b) => b.getTime() - a.getTime())[0]
		const daysSinceLastSession = latestSessionDate ? daysBetween(latestSessionDate, now) : 0
		const streakDays = computeStreak(sessions)
		const uniqueArticlesRead = new Set(views.map((view) => view.idArticle)).size

		return [
			{ label: "Sessions (7 jours)", value: String(sessionsLast7Days), helper: "GET /api/exercer/user/{userId}" },
			{ label: "Sessions (30 jours)", value: String(sessionsLast30Days), helper: "GET /api/exercer/user/{userId}" },
			{ label: "Serie active", value: `${streakDays} jour(s)`, helper: "Calcul sur completedAt (ExercerDto)" },
			{ label: "Derniere session", value: `Il y a ${daysSinceLastSession} jour(s)`, helper: "Max(completedAt)" },
			{ label: "Vues articles", value: String(views.length), helper: "GET /api/consulter/user/{userId}" },
			{ label: "Articles uniques", value: String(uniqueArticlesRead), helper: "Distinct idArticle" },
		]
	}, [sessionsQuery.data, viewsQuery.data])

	if (!session || !token) {
		return (
			<div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
				<Card>
					<CardHeader>
						<CardTitle>Connexion requise</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<p>Connectez-vous pour afficher votre profil synchronise avec l&apos;API.</p>
						<Button asChild>
							<a href="/auth/connexion">Aller a la connexion</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (sessionsQuery.error || viewsQuery.error) {
		return (
			<div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
				<Card>
					<CardHeader>
						<CardTitle>Impossible de charger le profil</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<p>
							Une erreur API est survenue. Verifiez le token ou la disponibilite du backend puis reessayez.
						</p>
						<Button
							variant="outline"
							onClick={() => {
								clearSession()
								toast.success("Session videe")
							}}
						>
							Vider la session locale
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	const userDto = {
		id: session.userId,
		nom: session.nom,
		prenom: session.prenom,
		email: session.email,
		roleLibelle: session.role,
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			<Card className="border-surface-border bg-surface-strong shadow-soft">
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
							onClick={() => {
								const payload = {
									user: userDto,
									sessions: sessionsQuery.data ?? [],
									views: viewsQuery.data ?? [],
								}
								navigator.clipboard
									.writeText(JSON.stringify(payload, null, 2))
									.then(() => toast.success("Donnees copiees dans le presse-papiers"))
									.catch(() => toast.error("Impossible de copier les donnees"))
							}}
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
							{roleDisplayMap[userDto.roleLibelle] ?? userDto.roleLibelle}
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Etat du compte</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p><span className="font-semibold text-brand-dark">Source:</span> Donnees de session API + historique d&apos;activite</p>
					{sessionsQuery.isLoading || viewsQuery.isLoading ? (
						<p className="text-xs text-muted-foreground">Synchronisation en cours...</p>
					) : null}
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
