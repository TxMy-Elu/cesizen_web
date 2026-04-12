"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type AdminArticle = {
  id: string
  title: string
  tags: string
  status: "Publie" | "Brouillon"
  content: string
  attachmentName?: string
}

const initialRows: AdminArticle[] = [
  {
	id: "art-1",
	title: "Respiration minute",
	tags: "Stress",
	status: "Publie",
	content: "Exercice court pour retrouver un rythme calme en 60 secondes.",
  },
  {
	id: "art-2",
	title: "Rituel sommeil",
	tags: "Sommeil",
	status: "Brouillon",
	content: "Routine de deconnexion mentale avant le coucher.",
  },
  {
	id: "art-3",
	title: "Ancrage travail",
	tags: "Angoisse au travail",
	status: "Publie",
	content: "Technique de recentrage en contexte professionnel stressant.",
    attachmentName: "guide-ancrage.pdf",
  },
]

export default function AdminContenusPage() {
  const [rows, setRows] = useState(initialRows)
  const [categories, setCategories] = useState(["Stress", "Sommeil", "Angoisse au travail"])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newTag, setNewTag] = useState("Stress")
  const [newContent, setNewContent] = useState("")
  const [newAttachment, setNewAttachment] = useState<File | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTag, setEditTag] = useState("Stress")
  const [editContent, setEditContent] = useState("")
  const [editAttachment, setEditAttachment] = useState<File | null>(null)
  const [removeEditAttachment, setRemoveEditAttachment] = useState(false)

  const publishedCount = useMemo(
	() => rows.filter((row) => row.status === "Publie").length,
	[rows]
  )

  const selectedArticle = useMemo(
	() => rows.find((row) => row.id === selectedId) ?? null,
	[rows, selectedId]
  )

  const createArticle = () => {
	if (!newTitle.trim() || !newContent.trim()) {
	  toast.error("Titre et contenu requis")
	  return
	}

	const article: AdminArticle = {
	  id: `art-${Date.now()}`,
	  title: newTitle.trim(),
	  tags: newTag,
	  status: "Brouillon",
	  content: newContent.trim(),
	  attachmentName: newAttachment?.name,
	}

	setRows((prev) => [article, ...prev])
	setNewTitle("")
	setNewContent("")
		  setNewAttachment(null)
	toast.success("Article ajoute en brouillon")
  }

		  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0]
			if (!file) {
			  setNewAttachment(null)
			  return
			}

			const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"]
			const hasAllowedExtension = allowedExtensions.some((extension) =>
			  file.name.toLowerCase().endsWith(extension)
			)

			if (!hasAllowedExtension) {
			  toast.error("Format non supporte (utilisez PDF, DOC, DOCX ou TXT)")
			  event.target.value = ""
			  return
			}

			if (file.size > 10 * 1024 * 1024) {
			  toast.error("Fichier trop volumineux (10 Mo max)")
			  event.target.value = ""
			  return
			}

			setNewAttachment(file)
		  }

								  const handleEditAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
									const file = event.target.files?.[0]
									if (!file) {
									  setEditAttachment(null)
									  return
									}

									const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"]
									const hasAllowedExtension = allowedExtensions.some((extension) =>
									  file.name.toLowerCase().endsWith(extension)
									)

									if (!hasAllowedExtension) {
									  toast.error("Format non supporte (utilisez PDF, DOC, DOCX ou TXT)")
									  event.target.value = ""
									  return
									}

									if (file.size > 10 * 1024 * 1024) {
									  toast.error("Fichier trop volumineux (10 Mo max)")
									  event.target.value = ""
									  return
									}

									setRemoveEditAttachment(false)
									setEditAttachment(file)
								  }

  const addCategory = () => {
	const value = newCategory.trim()
	if (!value) {
	  toast.error("Categorie invalide")
	  return
	}
	if (categories.includes(value)) {
	  toast.error("Categorie deja existante")
	  return
	}
	setCategories((prev) => [...prev, value])
	setNewCategory("")
	toast.success("Categorie ajoutee")
  }

  const openView = (id: string) => {
	setSelectedId(id)
	setEditingId(null)
  }

  const openEdit = (id: string) => {
	const target = rows.find((row) => row.id === id)
	if (!target) {
	  return
	}

	setSelectedId(id)
	setEditingId(id)
	setEditTitle(target.title)
	setEditTag(target.tags)
	setEditContent(target.content)
	setEditAttachment(null)
	setRemoveEditAttachment(false)
  }

  const saveEdit = () => {
	if (!editingId) {
	  return
	}
	if (!editTitle.trim() || !editContent.trim()) {
	  toast.error("Titre et contenu requis")
	  return
	}

	setRows((prev) =>
	  prev.map((item) =>
		item.id === editingId
		  ? {
			  ...item,
			  title: editTitle.trim(),
			  tags: editTag,
			  content: editContent.trim(),
			  attachmentName: removeEditAttachment
				? undefined
				: (editAttachment?.name ?? item.attachmentName),
			}
		  : item
	  )
	)
	setEditingId(null)
	toast.success("Ressource modifiee")
  }

  return (
	<div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8 md:py-12">
	  <Card className="border-surface-border bg-linear-to-r from-surface-strong to-brand-sage-50/70">
		<CardHeader className="space-y-3">
		  <Badge className="w-fit" variant="secondary">
			Admin - CMS
		  </Badge>
		  <CardTitle className="text-3xl md:text-4xl">
			Gestion du contenu preventif
		  </CardTitle>
		  <CardDescription className="text-base">
			Ajouter, modifier, depublier et supprimer les contenus de prevention.
		  </CardDescription>
		</CardHeader>
		<CardContent className="grid gap-4 lg:grid-cols-2">
		  <div className="space-y-3 rounded-xl border border-border/75 bg-surface p-4 shadow-subtle">
			<p className="text-sm font-semibold text-brand-dark">Ajouter un article</p>
			<Input
			  value={newTitle}
			  onChange={(event) => setNewTitle(event.target.value)}
			  placeholder="Titre"
			/>
			<select
			  value={newTag}
			  onChange={(event) => setNewTag(event.target.value)}
			  className="h-11 w-full rounded-xl border border-border/80 bg-surface-strong px-3 text-sm"
			>
			  {categories.map((category) => (
				<option key={category} value={category}>
				  {category}
				</option>
			  ))}
			</select>
			<Textarea
			  value={newContent}
			  onChange={(event) => setNewContent(event.target.value)}
			  placeholder="Contenu de la fiche conseil"
			/>
			<div className="space-y-2">
			  <label htmlFor="resource-file" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
				Piece jointe (optionnel)
			  </label>
			  <Input
				id="resource-file"
				type="file"
				accept=".pdf,.doc,.docx,.txt"
				onChange={handleAttachmentChange}
			  />
			  {newAttachment ? (
				<p className="text-xs text-muted-foreground">Fichier selectionne: {newAttachment.name}</p>
			  ) : (
				<p className="text-xs text-muted-foreground">Formats acceptes: PDF, DOC, DOCX, TXT (10 Mo max)</p>
			  )}
			</div>
			<Button onClick={createArticle}>Ajouter l&apos;article</Button>
		  </div>

		  <div className="space-y-3 rounded-xl border border-border/75 bg-surface p-4 shadow-subtle">
			<p className="text-sm font-semibold text-brand-dark">Categories (tags)</p>
			<div className="flex flex-wrap gap-2">
			  {categories.map((category) => (
				<Badge key={category} variant="outline">
				  {category}
				</Badge>
			  ))}
			</div>
			<div className="flex gap-2">
			  <Input
				value={newCategory}
				onChange={(event) => setNewCategory(event.target.value)}
				placeholder="Nouvelle categorie"
			  />
			  <Button variant="outline" onClick={addCategory}>
				Ajouter
			  </Button>
			</div>
			<p className="text-xs text-muted-foreground">Articles publies: {publishedCount}</p>
		  </div>
		</CardContent>
	  </Card>

	  <Card>
		<CardHeader>
		  <CardTitle>Articles et fiches conseils</CardTitle>
		</CardHeader>
		<CardContent>
		  <Table>
			<TableHeader>
			  <TableRow>
				<TableHead>Titre</TableHead>
				<TableHead>Tags</TableHead>
				<TableHead>Fichier</TableHead>
				<TableHead>Statut</TableHead>
				<TableHead className="text-right">Actions</TableHead>
			  </TableRow>
			</TableHeader>
			<TableBody>
			  {rows.map((row) => (
				<TableRow key={row.id}>
				  <TableCell className="font-medium text-brand-dark">{row.title}</TableCell>
				  <TableCell>{row.tags}</TableCell>
				  <TableCell>
					{row.attachmentName ? (
					  <span className="rounded-md border border-border/75 bg-surface-strong px-2 py-1 text-xs">
						{row.attachmentName}
					  </span>
					) : (
					  <span className="text-xs text-muted-foreground">Aucun fichier</span>
					)}
				  </TableCell>
				  <TableCell>{row.status}</TableCell>
				  <TableCell className="text-right">
					<div className="flex flex-wrap justify-end gap-2">
					  <Button
						variant="outline"
						size="sm"
						onClick={() => openView(row.id)}
					  >
						Voir
					  </Button>
					  <Button
						variant="outline"
						size="sm"
						onClick={() => openEdit(row.id)}
					  >
						Modifier
					  </Button>
					  <Button
						variant="outline"
						size="sm"
						onClick={() => {
						  setRows((prev) =>
							prev.map((item) =>
							  item.id === row.id
								? {
									...item,
									status: item.status === "Publie" ? "Brouillon" : "Publie",
								  }
								: item
							)
						  )
						}}
					  >
						{row.status === "Publie" ? "Depublier" : "Publier"}
					  </Button>
					  <Button
						variant="destructive"
						size="sm"
						onClick={() => {
						  if (selectedId === row.id) {
							setSelectedId(null)
							setEditingId(null)
						  }
						  setRows((prev) => prev.filter((item) => item.id !== row.id))
						  toast.success("Article supprime")
						}}
					  >
						Supprimer
					  </Button>
					</div>
				  </TableCell>
				</TableRow>
			  ))}
			</TableBody>
		  </Table>
		</CardContent>
	  </Card>

	  {selectedArticle ? (
		<Card>
		  <CardHeader>
			<CardTitle>
			  {editingId === selectedArticle.id ? "Modifier la ressource" : "Voir la ressource"}
			</CardTitle>
		  </CardHeader>
		  <CardContent className="space-y-4">
			{editingId === selectedArticle.id ? (
			  <>
				<div className="space-y-2">
				  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-title">
					Titre
				  </label>
				  <Input
					id="edit-title"
					value={editTitle}
					onChange={(event) => setEditTitle(event.target.value)}
				  />
				</div>
				<div className="space-y-2">
				  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-tag">
					Categorie
				  </label>
				  <select
					id="edit-tag"
					value={editTag}
					onChange={(event) => setEditTag(event.target.value)}
					className="h-11 w-full rounded-xl border border-border/80 bg-surface-strong px-3 text-sm"
				  >
					{categories.map((category) => (
					  <option key={category} value={category}>
						{category}
					  </option>
					))}
				  </select>
				</div>
				<div className="space-y-2">
				  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-content">
					Contenu
				  </label>
				  <Textarea
					id="edit-content"
					value={editContent}
					onChange={(event) => setEditContent(event.target.value)}
				  />
				</div>
				<div className="space-y-2">
				  <p className="text-sm font-semibold text-brand-dark">Fichier actuel</p>
				  <p className="text-sm text-muted-foreground">
					{selectedArticle.attachmentName ?? "Aucun fichier"}
				  </p>
				  <Input
					type="file"
					accept=".pdf,.doc,.docx,.txt"
					onChange={handleEditAttachmentChange}
				  />
				  {editAttachment ? (
					<p className="text-xs text-muted-foreground">Nouveau fichier: {editAttachment.name}</p>
				  ) : null}
				  <Button
					variant="outline"
					type="button"
					onClick={() => {
						setEditAttachment(null)
						setRemoveEditAttachment(true)
						toast.success("Fichier retire en attente d'enregistrement")
					}}
				  >
					Retirer le fichier
				  </Button>
				</div>
				<div className="flex flex-wrap gap-2">
				  <Button onClick={saveEdit}>Enregistrer les changements</Button>
				  <Button
					variant="outline"
					onClick={() => {
						setEditingId(null)
						setEditAttachment(null)
						setRemoveEditAttachment(false)
					}}
				  >
					Annuler
				  </Button>
				</div>
			  </>
			) : (
			  <>
				<div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
				  <p className="font-semibold text-brand-dark">Titre</p>
				  <p className="mt-1 text-muted-foreground">{selectedArticle.title}</p>
				</div>
				<div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
				  <p className="font-semibold text-brand-dark">Categorie</p>
				  <p className="mt-1 text-muted-foreground">{selectedArticle.tags}</p>
				</div>
				<div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
				  <p className="font-semibold text-brand-dark">Contenu</p>
				  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{selectedArticle.content}</p>
				</div>
				<div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
				  <p className="font-semibold text-brand-dark">Fichier</p>
				  <p className="mt-1 text-muted-foreground">{selectedArticle.attachmentName ?? "Aucun fichier"}</p>
				</div>
				<Button variant="outline" onClick={() => openEdit(selectedArticle.id)}>
				  Modifier cette ressource
				</Button>
			  </>
			)}
		  </CardContent>
		</Card>
	  ) : null}
	</div>
  )
}
