"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { articleApi, categorieApi } from "@/lib/api/services"
import { getSession } from "@/lib/auth/session"
import type { ArticleCreateDto, ArticleDto } from "@/lib/api/contracts"
import { toast } from "sonner"

const defaultTag = "Stress"

export default function AdminContenusPage() {
  const session = getSession()
  const token = session?.token ?? null
  const queryClient = useQueryClient()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [newTitle, setNewTitle] = useState("")
  const [newTag, setNewTag] = useState(defaultTag)
  const [newContent, setNewContent] = useState("")
  const [newAttachment, setNewAttachment] = useState<File | null>(null)

  const [newCategory, setNewCategory] = useState("")

  const [editTitle, setEditTitle] = useState("")
  const [editTag, setEditTag] = useState(defaultTag)
  const [editContent, setEditContent] = useState("")
  const [editAttachment, setEditAttachment] = useState<File | null>(null)
  const [removeEditAttachment, setRemoveEditAttachment] = useState(false)

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: categorieApi.list,
  })

  const articlesQuery = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: articleApi.list,
  })

  const categories = useMemo(() => {
    const labels = categoriesQuery.data?.map((item) => item.libelle) ?? []
    if (labels.length === 0) {
      return [defaultTag]
    }
    return labels
  }, [categoriesQuery.data])

  const selectedArticle = useMemo(
    () => articlesQuery.data?.find((item) => item.idArticle === selectedId) ?? null,
    [articlesQuery.data, selectedId]
  )

  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Connexion admin requise")
      }
      const value = newCategory.trim()
      if (!value) {
        throw new Error("Categorie invalide")
      }
      return categorieApi.create({ libelle: value, description: `Categorie ${value}` }, token)
    },
    onSuccess: () => {
      setNewCategory("")
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      toast.success("Categorie ajoutee")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur categorie")
    },
  })

  const createArticleMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Connexion admin requise")
      }
      if (!newTitle.trim() || !newContent.trim()) {
        throw new Error("Titre et contenu requis")
      }

      const category = categoriesQuery.data?.find((item) => item.libelle === newTag)
      if (!category) {
        throw new Error("Categorie introuvable")
      }

      let mediaUrl: string | null = null
      let typeMedia = "text"
      if (newAttachment) {
        const upload = await articleApi.upload(newAttachment, token)
        mediaUrl = upload.url
        typeMedia = "file"
      }

      const payload: ArticleCreateDto = {
        titre: newTitle.trim(),
        contenu: newContent.trim(),
        typeMedia,
        mediaUrl,
        estPublie: false,
        idCategorie: category.idCategorie,
      }

      return articleApi.create(payload, token)
    },
    onSuccess: () => {
      setNewTitle("")
      setNewContent("")
      setNewAttachment(null)
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Article ajoute en brouillon")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur creation")
    },
  })

  const updateArticleMutation = useMutation({
    mutationFn: async () => {
      if (!token || !editingId) {
        throw new Error("Connexion admin requise")
      }
      if (!editTitle.trim() || !editContent.trim()) {
        throw new Error("Titre et contenu requis")
      }

      const existing = articlesQuery.data?.find((item) => item.idArticle === editingId)
      if (!existing) {
        throw new Error("Article introuvable")
      }

      const category = categoriesQuery.data?.find((item) => item.libelle === editTag)
      if (!category) {
        throw new Error("Categorie introuvable")
      }

      let mediaUrl = existing.mediaUrl
      let typeMedia = existing.typeMedia

      if (removeEditAttachment) {
        mediaUrl = null
        typeMedia = "text"
      }

      if (editAttachment) {
        const upload = await articleApi.upload(editAttachment, token)
        mediaUrl = upload.url
        typeMedia = "file"
      }

      const payload: ArticleCreateDto = {
        titre: editTitle.trim(),
        contenu: editContent.trim(),
        typeMedia,
        mediaUrl,
        estPublie: existing.estPublie,
        idCategorie: category.idCategorie,
      }

      return articleApi.update(editingId, payload, token)
    },
    onSuccess: () => {
      setEditingId(null)
      setEditAttachment(null)
      setRemoveEditAttachment(false)
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Ressource modifiee")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur modification")
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: async (article: ArticleDto) => {
      if (!token) {
        throw new Error("Connexion admin requise")
      }
      const payload: ArticleCreateDto = {
        titre: article.titre,
        contenu: article.contenu,
        typeMedia: article.typeMedia,
        mediaUrl: article.mediaUrl,
        estPublie: !article.estPublie,
        idCategorie: article.idCategorie,
      }
      return articleApi.update(article.idArticle, payload, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur publication")
    },
  })

  const deleteArticleMutation = useMutation({
    mutationFn: async (idArticle: number) => {
      if (!token) {
        throw new Error("Connexion admin requise")
      }
      return articleApi.remove(idArticle, token)
    },
    onSuccess: () => {
      setSelectedId(null)
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Article supprime")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur suppression")
    },
  })

  const openEdit = (article: ArticleDto) => {
    setSelectedId(article.idArticle)
    setEditingId(article.idArticle)
    setEditTitle(article.titre)
    setEditTag(article.categorieLibelle)
    setEditContent(article.contenu)
    setEditAttachment(null)
    setRemoveEditAttachment(false)
  }

  const publishedCount = (articlesQuery.data ?? []).filter((row) => row.estPublie).length

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Acces admin requis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connectez-vous avec un compte administrateur pour gerer les contenus via l&apos;API.
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
                onChange={(event) => setNewAttachment(event.target.files?.[0] ?? null)}
              />
              {newAttachment ? (
                <p className="text-xs text-muted-foreground">Fichier selectionne: {newAttachment.name}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Formats acceptes: PDF, DOC, DOCX, TXT</p>
              )}
            </div>
            <Button onClick={() => createArticleMutation.mutate()} disabled={createArticleMutation.isPending}>
              {createArticleMutation.isPending ? "Ajout..." : "Ajouter l'article"}
            </Button>
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
              <Button variant="outline" onClick={() => createCategoryMutation.mutate()}>
                Ajouter
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Articles publies: {publishedCount}</p>
            {categoriesQuery.error ? <p className="text-xs text-destructive">{categoriesQuery.error.message}</p> : null}
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
              {(articlesQuery.data ?? []).map((row) => (
                <TableRow key={row.idArticle}>
                  <TableCell className="font-medium text-brand-dark">{row.titre}</TableCell>
                  <TableCell>{row.categorieLibelle}</TableCell>
                  <TableCell>
                    {row.mediaUrl ? (
                      <span className="rounded-md border border-border/75 bg-surface-strong px-2 py-1 text-xs">
                        {row.mediaUrl.split("/").at(-1)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Aucun fichier</span>
                    )}
                  </TableCell>
                  <TableCell>{row.estPublie ? "Publie" : "Brouillon"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(row.idArticle)}>
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => togglePublishMutation.mutate(row)}>
                        {row.estPublie ? "Depublier" : "Publier"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteArticleMutation.mutate(row.idArticle)}>
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {articlesQuery.isLoading ? <p className="mt-3 text-xs text-muted-foreground">Chargement...</p> : null}
          {articlesQuery.error ? <p className="mt-3 text-xs text-destructive">{articlesQuery.error.message}</p> : null}
        </CardContent>
      </Card>

      {selectedArticle ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId === selectedArticle.idArticle ? "Modifier la ressource" : "Voir la ressource"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingId === selectedArticle.idArticle ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-title">
                    Titre
                  </label>
                  <Input id="edit-title" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
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
                  <Textarea id="edit-content" value={editContent} onChange={(event) => setEditContent(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-dark">Fichier actuel</p>
                  <p className="text-sm text-muted-foreground">{selectedArticle.mediaUrl ?? "Aucun fichier"}</p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(event) => {
                      setEditAttachment(event.target.files?.[0] ?? null)
                      setRemoveEditAttachment(false)
                    }}
                  />
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
                  <Button onClick={() => updateArticleMutation.mutate()} disabled={updateArticleMutation.isPending}>
                    {updateArticleMutation.isPending ? "Enregistrement..." : "Enregistrer les changements"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
                  <p className="font-semibold text-brand-dark">Titre</p>
                  <p className="mt-1 text-muted-foreground">{selectedArticle.titre}</p>
                </div>
                <div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
                  <p className="font-semibold text-brand-dark">Categorie</p>
                  <p className="mt-1 text-muted-foreground">{selectedArticle.categorieLibelle}</p>
                </div>
                <div className="rounded-xl border border-border/75 bg-surface p-4 text-sm">
                  <p className="font-semibold text-brand-dark">Contenu</p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{selectedArticle.contenu}</p>
                </div>
                <Button variant="outline" onClick={() => openEdit(selectedArticle)}>
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
