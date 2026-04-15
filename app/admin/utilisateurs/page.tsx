"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
import { roleApi, userApi } from "@/lib/api/services"
import { getSession } from "@/lib/auth/session"
import { toast } from "sonner"

const roleDisplayMap: Record<string, string> = {
	ROLE_USER: "Utilisateur connecte",
	ROLE_ADMIN: "Administrateur de la solution",
}

export default function AdminUtilisateursPage() {
	const session = getSession()
	const token = session?.token ?? null
	const queryClient = useQueryClient()

	const [pendingDeletionUserId, setPendingDeletionUserId] = useState<number | null>(null)
	const [pendingRoleByUser, setPendingRoleByUser] = useState<Record<number, number>>({})

	const usersQuery = useQuery({
		queryKey: ["admin", "users"],
		queryFn: () => userApi.list(token!),
		enabled: Boolean(token),
	})

	const rolesQuery = useQuery({
		queryKey: ["admin", "roles"],
		queryFn: () => roleApi.list(token!),
		enabled: Boolean(token),
	})

	const pendingDeletionUser = useMemo(
		() => usersQuery.data?.find((item) => item.id === pendingDeletionUserId) ?? null,
		[usersQuery.data, pendingDeletionUserId]
	)

	const updateRoleMutation = useMutation({
		mutationFn: (payload: { userId: number; roleId: number }) =>
			userApi.update(payload.userId, { roleId: payload.roleId }, token!),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
			toast.success("Role mis a jour")
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Erreur de mise a jour")
		},
	})

	const deleteUserMutation = useMutation({
		mutationFn: (userId: number) => userApi.remove(userId, token!),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
			setPendingDeletionUserId(null)
			toast.success("Compte purge (droit a l'oubli)")
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Erreur de suppression")
		},
	})

	if (!token) {
		return (
			<div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
				<Card>
					<CardHeader>
						<CardTitle>Acces admin requis</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Connectez-vous avec un compte administrateur pour gerer les utilisateurs.
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
			<Card className="border-surface-border bg-surface-strong shadow-soft">
				<CardHeader className="space-y-3">
					<Badge className="w-fit" variant="secondary">
						Admin - Utilisateurs
					</Badge>
					<CardTitle className="text-3xl md:text-4xl">
						Gestion des utilisateurs & conformite
					</CardTitle>
					<CardDescription className="text-base">
						Gestion des roles et execution du droit a l&apos;oubli (RGPD).
					</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Comptes et roles</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Utilisateur</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(usersQuery.data ?? []).map((user) => {
								const selectedRole = pendingRoleByUser[user.id] ?? user.roleId
								return (
									<TableRow key={user.id}>
										<TableCell className="font-medium text-brand-dark">
											{user.prenom} {user.nom}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<label className="sr-only" htmlFor={`role-${user.id}`}>
												Role
											</label>
											<select
												id={`role-${user.id}`}
												value={selectedRole}
												onChange={(event) =>
													setPendingRoleByUser((prev) => ({
														...prev,
														[user.id]: Number(event.target.value),
													}))
												}
												className="h-11 rounded-xl border border-border/80 bg-surface-strong px-3 shadow-subtle focus-visible:border-brand-olive-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
											>
												{(rolesQuery.data ?? []).map((role) => (
													<option key={role.id} value={role.id}>
														{roleDisplayMap[role.libelle] ?? role.libelle}
													</option>
												))}
											</select>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex flex-wrap justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														updateRoleMutation.mutate({ userId: user.id, roleId: selectedRole })
													}
												>
													Mettre a jour le role
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => setPendingDeletionUserId(user.id)}
												>
													Droit a l&apos;oubli
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
					{usersQuery.isLoading ? (
						<p className="mt-3 text-xs text-muted-foreground">Chargement des utilisateurs...</p>
					) : null}
					{usersQuery.error ? <p className="mt-3 text-xs text-destructive">{usersQuery.error.message}</p> : null}
				</CardContent>
			</Card>

			<Dialog open={Boolean(pendingDeletionUser)} onOpenChange={(open) => !open && setPendingDeletionUserId(null)}>
				<DialogContent className="border border-[#7aa88a]/28 bg-linear-to-b from-white to-brand-sage-50/35">
					<DialogHeader>
						<DialogTitle>Confirmer le droit a l&apos;oubli</DialogTitle>
						<DialogDescription>
							Cette action supprimera definitivement les donnees du compte
							{pendingDeletionUser ? ` ${pendingDeletionUser.prenom} ${pendingDeletionUser.nom}` : ""}. Cette operation est irreversible.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPendingDeletionUserId(null)}>
							Annuler
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (pendingDeletionUser) {
									deleteUserMutation.mutate(pendingDeletionUser.id)
								}
							}}
						>
							Confirmer la suppression
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
