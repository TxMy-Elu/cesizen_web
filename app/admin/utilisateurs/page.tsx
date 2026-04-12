"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const initialUsers = [
	{ name: "Camille Martin", role: "Utilisateur connecté" },
	{ name: "Nora Dupont", role: "Administrateur de la solution" },
	{ name: "Yanis Haddad", role: "Utilisateur connecté" },
]

const roleOptions = ["Utilisateur connecté", "Administrateur de la solution"]

export default function AdminUtilisateursPage() {
	const [users, setUsers] = useState(initialUsers)
	const [pendingDeletionUser, setPendingDeletionUser] = useState<string | null>(null)

	const confirmForgetUser = () => {
		if (!pendingDeletionUser) {
			return
		}

		setUsers((prev) => prev.filter((item) => item.name !== pendingDeletionUser))
		toast.success(`Compte purge (droit a l'oubli): ${pendingDeletionUser}`)
		setPendingDeletionUser(null)
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			<Card className="border-surface-border bg-linear-to-r from-surface-strong to-brand-sage-50/70">
				<CardHeader className="space-y-3">
					<Badge className="w-fit" variant="secondary">
						Admin - Utilisateurs
					</Badge>
					<CardTitle className="text-3xl md:text-4xl">
						Gestion des utilisateurs & conformité
					</CardTitle>
					<CardDescription className="text-base">
						Gestion des rôles et exécution du droit à l&apos;oubli (RGPD).
					</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Comptes et rôles</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Utilisateur</TableHead>
								<TableHead>Rôle</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.name}>
									<TableCell className="font-medium text-brand-dark">
										{user.name}
									</TableCell>
									<TableCell>
										<label
											className="sr-only"
											htmlFor={`role-${user.name}`}
										>
											Rôle
										</label>
										<select
											id={`role-${user.name}`}
											defaultValue={user.role}
											onChange={(event) => {
												setUsers((prev) =>
													prev.map((item) =>
														item.name === user.name
															? { ...item, role: event.target.value }
															: item
													)
												)
											}}
											className="h-11 rounded-xl border border-border/80 bg-surface-strong px-3 shadow-subtle focus-visible:outline-none focus-visible:border-brand-olive-300 focus-visible:ring-2 focus-visible:ring-ring/20"
										>
											{roleOptions.map((role) => (
												<option key={role} value={role}>
													{role}
												</option>
											))}
										</select>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex flex-wrap justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => toast.success(`Role mis a jour pour ${user.name}`)}
											>
												Mettre à jour le rôle
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => setPendingDeletionUser(user.name)}
											>
												Droit à l&apos;oubli
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={Boolean(pendingDeletionUser)} onOpenChange={(open) => !open && setPendingDeletionUser(null)}>
				<DialogContent className="border border-[#7aa88a]/28 bg-linear-to-b from-white to-brand-sage-50/35">
					<DialogHeader>
						<DialogTitle>Confirmer le droit a l&apos;oubli</DialogTitle>
						<DialogDescription>
							Cette action supprimera definitivement les donnees du compte
							{pendingDeletionUser ? ` ${pendingDeletionUser}` : ""}. Cette operation est irreversible.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPendingDeletionUser(null)}>
							Annuler
						</Button>
						<Button variant="destructive" onClick={confirmForgetUser}>
							Confirmer la suppression
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
