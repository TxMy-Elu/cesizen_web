"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { exerciceApi } from "@/lib/api/services"
import { getSession } from "@/lib/auth/session"
import type { ExerciceDto } from "@/lib/api/contracts"
import { toast } from "sonner"

type ExerciceForm = {
  nom: string
  dureeInspiration: string
  dureeApnee: string
  dureeExpiration: string
  dureeSession: string
  description: string
}

const emptyForm: ExerciceForm = {
  nom: "",
  dureeInspiration: "",
  dureeApnee: "",
  dureeExpiration: "",
  dureeSession: "",
  description: "",
}

function formToPayload(f: ExerciceForm) {
  return {
    nom: f.nom.trim(),
    dureeInspiration: parseInt(f.dureeInspiration) || 0,
    dureeApnee: parseInt(f.dureeApnee) || 0,
    dureeExpiration: parseInt(f.dureeExpiration) || 0,
    dureeSession: parseInt(f.dureeSession) || 0,
    description: f.description.trim(),
  }
}

function exerciceToForm(e: ExerciceDto): ExerciceForm {
  return {
    nom: e.nom,
    dureeInspiration: String(e.dureeInspiration),
    dureeApnee: String(e.dureeApnee),
    dureeExpiration: String(e.dureeExpiration),
    dureeSession: String(e.dureeSession),
    description: e.description ?? "",
  }
}

export default function AdminExercicesPage() {
  const session = getSession()
  const token = session?.token ?? ""
  const queryClient = useQueryClient()

  const [createOpen, setCreateOpen] = useState(false)
  const [editExercice, setEditExercice] = useState<ExerciceDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExerciceDto | null>(null)

  const [createForm, setCreateForm] = useState<ExerciceForm>(emptyForm)
  const [editForm, setEditForm] = useState<ExerciceForm>(emptyForm)

  const exercicesQuery = useQuery({
    queryKey: ["admin", "exercices"],
    queryFn: exerciceApi.list,
  })

  const createMutation = useMutation({
    mutationFn: (form: ExerciceForm) => exerciceApi.create(formToPayload(form), token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exercices"] })
      toast.success("Exercice créé")
      setCreateOpen(false)
      setCreateForm(emptyForm)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur création"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: number; form: ExerciceForm }) =>
      exerciceApi.update(id, formToPayload(form), token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exercices"] })
      toast.success("Exercice mis à jour")
      setEditExercice(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur mise à jour"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => exerciceApi.remove(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exercices"] })
      toast.success("Exercice supprimé")
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur suppression"),
  })

  const exercices = exercicesQuery.data ?? []

  function validateForm(f: ExerciceForm): string | null {
    if (!f.nom.trim()) return "Le nom est requis"
    if (!f.dureeInspiration || parseInt(f.dureeInspiration) <= 0) return "Durée inspiration invalide"
    if (f.dureeApnee === "" || parseInt(f.dureeApnee) < 0) return "Durée apnée invalide"
    if (!f.dureeExpiration || parseInt(f.dureeExpiration) <= 0) return "Durée expiration invalide"
    if (!f.dureeSession || parseInt(f.dureeSession) <= 0) return "Durée session invalide"
    return null
  }

  function handleCreate() {
    const err = validateForm(createForm)
    if (err) { toast.error(err); return }
    createMutation.mutate(createForm)
  }

  function handleUpdate() {
    if (!editExercice) return
    const err = validateForm(editForm)
    if (err) { toast.error(err); return }
    updateMutation.mutate({ id: editExercice.idExercice, form: editForm })
  }

  function openEdit(e: ExerciceDto) {
    setEditExercice(e)
    setEditForm(exerciceToForm(e))
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl">Exercices de respiration</CardTitle>
            <CardDescription>
              {exercices.length} exercice{exercices.length !== 1 ? "s" : ""} enregistré{exercices.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Button onClick={() => { setCreateForm(emptyForm); setCreateOpen(true) }}>
            + Nouvel exercice
          </Button>
        </CardHeader>
        <CardContent>
          {exercicesQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : exercices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun exercice pour l&apos;instant.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="text-center">Inspiration (s)</TableHead>
                  <TableHead className="text-center">Apnée (s)</TableHead>
                  <TableHead className="text-center">Expiration (s)</TableHead>
                  <TableHead className="text-center">Session (s)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercices.map((ex) => (
                  <TableRow key={ex.idExercice}>
                    <TableCell className="font-medium">{ex.nom}</TableCell>
                    <TableCell className="text-center">{ex.dureeInspiration}</TableCell>
                    <TableCell className="text-center">{ex.dureeApnee}</TableCell>
                    <TableCell className="text-center">{ex.dureeExpiration}</TableCell>
                    <TableCell className="text-center">{ex.dureeSession}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {ex.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(ex)}>
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(ex)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Modale création ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvel exercice</DialogTitle>
          </DialogHeader>
          <ExerciceFormFields form={createForm} onChange={setCreateForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>
              {createMutation.isPending ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modale édition ── */}
      <Dialog open={!!editExercice} onOpenChange={(open) => { if (!open) setEditExercice(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier — {editExercice?.nom}</DialogTitle>
          </DialogHeader>
          <ExerciceFormFields form={editForm} onChange={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExercice(null)}>
              Annuler
            </Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>
              {updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modale confirmation suppression ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;exercice ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <strong>{deleteTarget?.nom}</strong> sera définitivement supprimé. Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.idExercice)}
            >
              {deleteMutation.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Composant formulaire partagé ─────────────────────────────────────────────

type FormFieldsProps = {
  form: ExerciceForm
  onChange: (f: ExerciceForm) => void
}

function ExerciceFormFields({ form, onChange }: FormFieldsProps) {
  const set = (key: keyof ExerciceForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold">Nom *</label>
        <Input placeholder="Ex : Cohérence cardiaque 5-5-5" value={form.nom} onChange={set("nom")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Inspiration (s) *</label>
          <Input type="number" min={1} placeholder="5" value={form.dureeInspiration} onChange={set("dureeInspiration")} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Apnée (s)</label>
          <Input type="number" min={0} placeholder="0" value={form.dureeApnee} onChange={set("dureeApnee")} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Expiration (s) *</label>
          <Input type="number" min={1} placeholder="5" value={form.dureeExpiration} onChange={set("dureeExpiration")} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Durée session (s) *</label>
          <Input type="number" min={1} placeholder="120" value={form.dureeSession} onChange={set("dureeSession")} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Description</label>
        <Textarea
          placeholder="Décrivez l'exercice…"
          rows={3}
          value={form.description}
          onChange={set("description")}
        />
      </div>
    </div>
  )
}
