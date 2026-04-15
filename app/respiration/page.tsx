"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { exerciceApi, exercerApi } from "@/lib/api/services"
import { useSession } from "@/lib/auth/use-session"
import { toast } from "sonner"

const computePresetLabel = (nom: string, index: number) => {
	if (index === 0) {
		return "Session express"
	}
	if (index === 1) {
		return "Session standard"
	}
	if (index === 2) {
		return "Session profonde"
	}
	return nom
}

type BreathPhase = "inspiration" | "apnee" | "expiration"

const phaseLabel: Record<BreathPhase, string> = {
	inspiration: "Inspiration",
	apnee: "Apnee",
	expiration: "Expiration",
}

const formatSeconds = (totalSeconds: number) => {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export default function BreathingPage() {
	const { session, ready } = useSession()
	const token = session?.token ?? null

	const exercicesQuery = useQuery({
		queryKey: ["respiration", "exercices"],
		queryFn: exerciceApi.list,
	})

	const presets = useMemo(
		() =>
			(exercicesQuery.data ?? []).map((item, index) => {
				const cycleDuration = item.dureeInspiration + item.dureeApnee + item.dureeExpiration
				const sessionDurationSeconds = Math.max(60, cycleDuration * 18)

				return {
					idExercice: item.idExercice,
					label: computePresetLabel(item.nom, index),
					value: `${Math.max(1, Math.round(sessionDurationSeconds / 60))} min - ${item.dureeInspiration}s inspiration / ${item.dureeExpiration}s expiration`,
					nom: item.nom,
					dureeInspiration: item.dureeInspiration,
					dureeApnee: item.dureeApnee,
					dureeExpiration: item.dureeExpiration,
					sessionDurationSeconds,
				}
			}),
		[exercicesQuery.data]
	)

	const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null)
	const [sessionCount, setSessionCount] = useState(0)
	const [isSessionRunning, setIsSessionRunning] = useState(false)
	const [phase, setPhase] = useState<BreathPhase>("inspiration")
	const [phaseElapsedMs, setPhaseElapsedMs] = useState(0)
	const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState(0)

	const selectedPreset = useMemo(() => {
		if (presets.length === 0) {
			return null
		}
		if (selectedPresetId) {
			return presets.find((item) => item.idExercice === selectedPresetId) ?? presets[0]
		}
		return presets[0]
	}, [presets, selectedPresetId])

	const currentPhaseDuration = useMemo(() => {
		if (!selectedPreset) {
			return 5
		}
		if (phase === "inspiration") {
			return Math.max(1, selectedPreset.dureeInspiration)
		}
		if (phase === "apnee") {
			return Math.max(1, selectedPreset.dureeApnee || 1)
		}
		return Math.max(1, selectedPreset.dureeExpiration)
	}, [selectedPreset, phase])

	const phaseProgress = useMemo(() => {
		if (!isSessionRunning) {
			return 0
		}
		return Math.min(1, phaseElapsedMs / (currentPhaseDuration * 1000))
	}, [currentPhaseDuration, isSessionRunning, phaseElapsedMs])

	const visualScale = useMemo(() => {
		if (!isSessionRunning) {
			return 1
		}
		if (phase === "inspiration") {
			return 0.84 + phaseProgress * 0.28
		}
		if (phase === "apnee") {
			return 1.12
		}
		return 1.12 - phaseProgress * 0.28
	}, [isSessionRunning, phase, phaseProgress])

	const haloScale = useMemo(() => {
		if (!isSessionRunning) {
			return 1
		}
		if (phase === "inspiration") {
			return 0.9 + phaseProgress * 0.35
		}
		if (phase === "apnee") {
			return 1.25
		}
		return 1.25 - phaseProgress * 0.35
	}, [isSessionRunning, phase, phaseProgress])

	const haloOpacity = useMemo(() => {
		if (!isSessionRunning) {
			return 0.18
		}
		if (phase === "inspiration") {
			return 0.22 + phaseProgress * 0.3
		}
		if (phase === "apnee") {
			return 0.52
		}
		return 0.52 - phaseProgress * 0.3
	}, [isSessionRunning, phase, phaseProgress])

	const phaseRemaining = Math.max(0, Math.ceil((currentPhaseDuration * 1000 - phaseElapsedMs) / 1000))

	const nextPhase = useCallback((current: BreathPhase): BreathPhase => {
		if (current === "inspiration") {
			return (selectedPreset?.dureeApnee ?? 0) > 0 ? "apnee" : "expiration"
		}
		if (current === "apnee") {
			return "expiration"
		}
		return "inspiration"
	}, [selectedPreset?.dureeApnee])

	useEffect(() => {
		if (!isSessionRunning || !selectedPreset) {
			return
		}
		const tickMs = 50
		const phaseDurationMs = currentPhaseDuration * 1000

		const timer = window.setInterval(() => {
			if (phaseElapsedMs + tickMs < phaseDurationMs) {
				setPhaseElapsedMs((prev) => prev + tickMs)
				return
			}

			setPhase(nextPhase(phase))
			setPhaseElapsedMs(0)
		}, tickMs)

		return () => window.clearInterval(timer)
	}, [isSessionRunning, selectedPreset, phase, phaseElapsedMs, currentPhaseDuration, nextPhase])

	useEffect(() => {
		if (!isSessionRunning || sessionRemainingSeconds <= 0) {
			return
		}

		const timer = window.setTimeout(() => {
			setSessionRemainingSeconds((prev) => {
				if (prev <= 1) {
					setIsSessionRunning(false)
					setPhaseElapsedMs(0)
					toast.success("Session terminee")
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => window.clearTimeout(timer)
	}, [isSessionRunning, sessionRemainingSeconds])

	const createExercerMutation = useMutation({
		mutationFn: (exerciceId: number) =>
			exercerApi.create(
				{
					userId: session!.userId,
					exerciceId,
					completedAt: new Date().toISOString(),
				},
				token!
			),
		onSuccess: () => {
			setSessionCount((prev) => prev + 1)
			toast.success("Seance enregistree")
		},
		onError: (error) => {
			const message = error instanceof Error ? error.message : "Impossible d'enregistrer la seance"
			toast.error(message)
		},
	})

	const startSession = () => {
		if (!selectedPreset) {
			toast.error("Aucun exercice disponible")
			return
		}

		setIsSessionRunning(true)
		setPhase("inspiration")
		setPhaseElapsedMs(0)
		setSessionRemainingSeconds(selectedPreset.sessionDurationSeconds)

		if (session?.userId && token) {
			createExercerMutation.mutate(selectedPreset.idExercice)
		} else {
			setSessionCount((prev) => prev + 1)
			toast.success("Seance demarree", {
				description: selectedPreset.value,
			})
		}
	}

	const stopSession = () => {
		setIsSessionRunning(false)
		setPhaseElapsedMs(0)
		setSessionRemainingSeconds(0)
		toast.success("Seance stoppee")
	}

	const sessionStatusLabel = !ready
		? "(statut session...)"
		: session?.userId
			? "(synchronisees)"
			: "(mode anonyme local)"

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			{exercicesQuery.error ? (
				<Card className="border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle>Impossible de charger les exercices</CardTitle>
						<CardDescription>{exercicesQuery.error.message}</CardDescription>
					</CardHeader>
				</Card>
			) : null}
			<section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
					<Card className="overflow-hidden border-surface-border bg-surface-strong shadow-soft">
					<CardHeader className="space-y-3">
						<CardTitle className="text-3xl">
							Module de cohérence cardiaque
						</CardTitle>
						<CardDescription className="text-base">
							Démarrage rapide, interface apaisante, et fonctionnement pensé
							pour rester utile hors connexion.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-surface-muted">
							<span
								className="absolute h-56 w-56 rounded-full bg-[#6ba382]/35 blur-xl"
								style={{
									transform: `scale(${haloScale})`,
									opacity: haloOpacity,
									transition: "transform 140ms linear, opacity 140ms linear",
								}}
							/>
							<span
								className="absolute h-64 w-64 rounded-full"
								style={{
									background: `conic-gradient(#6ba382 ${Math.round(phaseProgress * 360)}deg, rgba(84, 128, 104, 0.15) 0deg)`,
								}}
							/>
							<span className="absolute h-[15.2rem] w-[15.2rem] rounded-full bg-surface" />
							<span
								className="absolute h-52 w-52 rounded-full bg-surface-strong"
								style={{
									transform: `scale(${visualScale})`,
									boxShadow: isSessionRunning ? "0 0 28px rgba(107, 163, 130, 0.28)" : "0 0 0 rgba(0,0,0,0)",
									transition: "transform 120ms linear, box-shadow 180ms ease",
								}}
							/>
							<span className="z-10 text-center">
								<span className="block text-sm uppercase tracking-wide text-muted-foreground">
									{isSessionRunning ? phaseLabel[phase] : "Rythme conseillé"}
								</span>
								<span className="block text-xl font-bold text-brand-dark">
									{selectedPreset ? `${selectedPreset.dureeInspiration}s / ${selectedPreset.dureeExpiration}s` : "-- / --"}
								</span>
								{isSessionRunning ? (
									<span className="mt-1 block text-sm font-semibold text-brand-dark/80">{phaseRemaining}s</span>
								) : null}
							</span>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button size="lg" onClick={startSession} disabled={!selectedPreset || createExercerMutation.isPending || exercicesQuery.isLoading}>
								{createExercerMutation.isPending ? "Enregistrement..." : "Démarrer la séance"}
							</Button>
							<Button size="lg" variant="outline" onClick={stopSession} disabled={!isSessionRunning}>
								Arreter
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="tel:3114">Appeler le 3114</Link>
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Seances lancees: {sessionCount} {sessionStatusLabel}
						</p>
						{isSessionRunning ? (
							<div className="rounded-xl border border-border/75 bg-surface-muted px-4 py-3 text-center shadow-subtle">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Temps restant session</p>
								<p className="mt-1 text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
									{formatSeconds(sessionRemainingSeconds)}
								</p>
							</div>
						) : null}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Réglages rapides</CardTitle>
						<CardDescription>
							Choisissez un preset de respiration et lancez la séance.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{exercicesQuery.isLoading ? (
							<p className="text-sm text-muted-foreground">Chargement des exercices...</p>
						) : null}
						{presets.map((preset) => (
							<button
								key={preset.idExercice}
								type="button"
								onClick={() => setSelectedPresetId(preset.idExercice)}
								className={`w-full rounded-xl border p-4 text-left shadow-subtle ${
									selectedPreset?.idExercice === preset.idExercice
																? "border-transparent bg-[#6ba382] text-white"
																: "border-border/75 bg-surface-strong hover:border-brand-olive-300 hover:bg-surface-muted"
								}`}
							>
								<p className="font-semibold">
									{preset.label}
								</p>
								<p className={`text-sm ${selectedPreset?.idExercice === preset.idExercice ? "text-white/90" : "text-muted-foreground"}`}>
									{preset.value}
								</p>
							</button>
						))}
						<p className="rounded-xl border border-border/75 bg-surface-strong p-4 text-sm text-muted-foreground shadow-subtle">
							Astuce: gardez un rythme regulier pour maximiser l&apos;effet apaisant.
						</p>
					</CardContent>
				</Card>
			</section>
		</div>
	)
}
