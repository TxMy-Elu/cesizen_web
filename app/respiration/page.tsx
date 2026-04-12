"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const presets = [
	{ label: "Session express", value: "3 min - 5s inspiration / 5s expiration" },
	{ label: "Session standard", value: "5 min - 5s inspiration / 5s expiration" },
	{ label: "Session profonde", value: "10 min - 6s inspiration / 6s expiration" },
]

export default function BreathingPage() {
	const [selectedPreset, setSelectedPreset] = useState(presets[1])
	const [hapticEnabled, setHapticEnabled] = useState(false)
	const [sessionCount, setSessionCount] = useState(0)

	const startSession = () => {
		setSessionCount((prev) => prev + 1)
		toast.success("Seance demarree", {
			description: `${selectedPreset.value}${hapticEnabled ? " - retour haptique actif" : ""}`,
		})
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			<section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<Card className="overflow-hidden border-surface-border bg-linear-to-br from-surface-strong via-brand-sage-50/60 to-brand-sand-50/80">
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
						<div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-brand-sage-100/70">
							<span className="absolute h-64 w-64 rounded-full border border-brand-olive-300/70 animate-[breathe-ring_10s_ease-in-out_infinite]" />
							<span className="absolute h-52 w-52 rounded-full bg-brand-sage-200/70 animate-[pulse-zen_10s_ease-in-out_infinite]" />
							<span className="z-10 text-center">
								<span className="block text-sm uppercase tracking-wide text-muted-foreground">
									Rythme conseillé
								</span>
								<span className="block text-xl font-bold text-brand-dark">
									5s / 5s
								</span>
							</span>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button size="lg" onClick={startSession}>Démarrer la séance</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="tel:3114">Appeler le 3114</Link>
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">Seances lancees (simulation): {sessionCount}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Réglages rapides</CardTitle>
						<CardDescription>
							Choisissez un preset ou activez le retour haptique pour
							pratiquer les yeux fermés.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{presets.map((preset) => (
							<button
								key={preset.label}
								type="button"
								onClick={() => setSelectedPreset(preset)}
								className={`w-full rounded-xl border p-4 text-left shadow-subtle ${
									selectedPreset.label === preset.label
										? "border-transparent bg-[#6ba382] text-white"
										: "border-border/75 bg-surface-strong hover:border-brand-olive-300 hover:bg-surface-muted"
								}`}
							>
								<p className="font-semibold">
									{preset.label}
								</p>
								<p className={`text-sm ${selectedPreset.label === preset.label ? "text-white/90" : "text-muted-foreground"}`}>
									{preset.value}
								</p>
							</button>
						))}
						<label className="flex items-center justify-between rounded-xl border border-border/75 bg-surface-strong p-4 text-sm shadow-subtle">
							<span className="font-medium">Retour haptique</span>
							<input
								type="checkbox"
								checked={hapticEnabled}
								onChange={(event) => setHapticEnabled(event.target.checked)}
								className="h-4 w-4 accent-brand-olive"
							/>
						</label>
					</CardContent>
				</Card>
			</section>
		</div>
	)
}
