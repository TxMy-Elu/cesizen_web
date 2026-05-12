"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
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
import { MediaDownloadButton } from "@/components/app/media-download-button"
import { articleApi, categorieApi } from "@/lib/api/services"
import { getSession } from "@/lib/auth/session"
import type { ArticleCreateDto, ArticleDto } from "@/lib/api/contracts"
import { deleteSupabaseFile, getMediaUrl, isSupabaseUrl } from "@/lib/supabase"
import { toast } from "sonner"

const defaultTag = "Stress"

export default function AdminContenusPage() {
  const session = getSession()
  const token = session?.token ?? null
  const queryClient = useQueryClient()

  // ── Modales ──────────────────────────────────────────────
  const [previewArticle, setPreviewArticle] = useState<ArticleDto | null>(null)
  const [editArticle, setEditArticle] = useState<ArticleDto | null>(null)

  // ── Formulaire création ───────────────────────────────────
  const [newTitle, setNewTitle] = useState("")
  const [newTag, setNewTag] = useState(defaultTag)
  const [newContent, setNewContent] = useState("")
  const [newAttachment, setNewAttachment] = useState<File | null>(null)
  const [newCategory, setNewCategory] = useState("")

  // ── Formulaire édition ────────────────────────────────────
  const [editTitle, setEditTitle] = useState("")
  const [editTag, setEditTag] = useState(defaultTag)
  const [editContent, setEditContent] = useState("")
  const [editAttachment, setEditAttachment] = useState<File | null>(null)
  const [removeEditAttachment, setRemoveEditAttachment] = useState(false)

  // ── Queries ───────────────────────────────────────────────
  const categoriesQuery = useQuery({ queryKey: ["admin", "categories"], queryFn: categorieApi.list })
  const articlesQuery = useQuery({ queryKey: ["admin", "articles"], queryFn: articleApi.list })

  const categories = useMemo(() => {
    const labels = categoriesQuery.data?.map((c) => c.libelle) ?? []
    return labels.length === 0 ? [defaultTag] : labels
  }, [categoriesQuery.data])

  const publishedCount = (articlesQuery.data ?? []).filter((r) => r.estPublie).length

  // ── Ouvrir la modale d'édition ────────────────────────────
  const openEdit = (article: ArticleDto) => {
    setEditArticle(article)
    setEditTitle(article.titre)
    setEditTag(article.categorieLibelle)
    setEditContent(article.contenu)
    setEditAttachment(null)
    setRemoveEditAttachment(false)
  }

  const closeEdit = () => {
    setEditArticle(null)
    setEditAttachment(null)
    setRemoveEditAttachment(false)
  }

  // ── Mutations ─────────────────────────────────────────────
  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Connexion admin requise")
      const value = newCategory.trim()
      if (!value) throw new Error("Categorie invalide")
      return categorieApi.create({ libelle: value, description: `Categorie ${value}` }, token)
    },
    onSuccess: () => {
      setNewCategory("")
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      toast.success("Categorie ajoutee")
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur categorie"),
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (idCategorie: number) => {
      if (!token) throw new Error("Connexion admin requise")
      return categorieApi.remove(idCategorie, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Categorie supprimee")
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur suppression categorie"),
  })

  const createArticleMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Connexion admin requise")
      if (!newTitle.trim() || !newContent.trim()) throw new Error("Titre et contenu requis")
      const category = categoriesQuery.data?.find((c) => c.libelle === newTag)
      if (!category) throw new Error("Categorie introuvable")

      let mediaUrl: string | null = null
      let typeMedia = "text"
      if (newAttachment) {
        const upload = await articleApi.upload(newAttachment, token)
        mediaUrl = upload.url
        typeMedia = "file"
      }

      return articleApi.create(
        { titre: newTitle.trim(), contenu: newContent.trim(), typeMedia, mediaUrl, estPublie: false, idCategorie: category.idCategorie },
        token
      )
    },
    onSuccess: () => {
      setNewTitle("")
      setNewContent("")
      setNewAttachment(null)
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Article ajoute en brouillon")
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur creation"),
  })

  const updateArticleMutation = useMutation({
    mutationFn: async () => {
      if (!token || !editArticle) throw new Error("Connexion admin requise")
      if (!editTitle.trim() || !editContent.trim()) throw new Error("Titre et contenu requis")
      const category = categoriesQuery.data?.find((c) => c.libelle === editTag)
      if (!category) throw new Error("Categorie introuvable")

      let mediaUrl = editArticle.mediaUrl
      let typeMedia = editArticle.typeMedia

      if (removeEditAttachment) {
        if (editArticle.mediaUrl && isSupabaseUrl(editArticle.mediaUrl)) {
          await deleteSupabaseFile(editArticle.mediaUrl)
        }
        mediaUrl = null
        typeMedia = "text"
      }
      if (editAttachment) {
        if (editArticle.mediaUrl && isSupabaseUrl(editArticle.mediaUrl)) {
          await deleteSupabaseFile(editArticle.mediaUrl)
        }
        const upload = await articleApi.upload(editAttachment, token)
        mediaUrl = upload.url
        typeMedia = "file"
      }

      const payload: ArticleCreateDto = {
        titre: editTitle.trim(),
        contenu: editContent.trim(),
        typeMedia,
        mediaUrl,
        estPublie: editArticle.estPublie,
        idCategorie: category.idCategorie,
      }
      return articleApi.update(editArticle.idArticle, payload, token)
    },
    onSuccess: () => {
      closeEdit()
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Ressource modifiee")
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur modification"),
  })

  const togglePublishMutation = useMutation({
    mutationFn: async (article: ArticleDto) => {
      if (!token) throw new Error("Connexion admin requise")
      return articleApi.update(article.idArticle, {
        titre: article.titre,
        contenu: article.contenu,
        typeMedia: article.typeMedia,
        mediaUrl: article.mediaUrl,
        estPublie: !article.estPublie,
        idCategorie: article.idCategorie,
      }, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "articles"] }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur publication"),
  })

  const deleteArticleMutation = useMutation({
    mutationFn: async (article: ArticleDto) => {
      if (!token) throw new Error("Connexion admin requise")
      await articleApi.remove(article.idArticle, token)
      if (article.mediaUrl && isSupabaseUrl(article.mediaUrl)) {
        await deleteSupabaseFile(article.mediaUrl)
      }
    },
    onSuccess: () => {
      setPreviewArticle(null)
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] })
      toast.success("Article supprime")
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur suppression"),
  })

  // ── Guard ─────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <Card>
          <CardHeader><CardTitle>Acces admin requis</CardTitle></CardHeader>
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

      {/* ── Modale aperçu ───────────────────────────────────── */}
      <Dialog open={!!previewArticle} onOpenChange={(open) => { if (!open) setPreviewArticle(null) }}>
        <DialogContent className="max-w-2xl">
          {previewArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{previewArticle.categorieLibelle}</Badge>
                  <Badge variant={previewArticle.estPublie ? "default" : "outline"}>
                    {previewArticle.estPublie ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <DialogTitle className="mt-2 text-xl leading-snug">{previewArticle.titre}</DialogTitle>
                {previewArticle.datePublication && (
                  <p className="text-xs text-muted-foreground">
                    Publié le {new Date(previewArticle.datePublication).toLocaleDateString("fr-FR")}
                    {previewArticle.dateModification && (
                      <> · Modifié le {new Date(previewArticle.dateModification).toLocaleDateString("fr-FR")}</>
                    )}
                  </p>
                )}
              </DialogHeader>

              <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-border/60 bg-surface p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-dark/85">
                  {previewArticle.contenu}
                </p>
              </div>

              {previewArticle.mediaUrl && (() => {
                const url = getMediaUrl(previewArticle.mediaUrl)
                return url ? (
                  <div className="mt-3">
                    <MediaDownloadButton
                      mediaUrl={url}
                      filename={url.split("/").at(-1)}
                      label="Télécharger le document joint"
                    />
                  </div>
                ) : null
              })()}

              <DialogFooter className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    openEdit(previewArticle)
                    setPreviewArticle(null)
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteArticleMutation.mutate(previewArticle)}
                  disabled={deleteArticleMutation.isPending}
                >
                  {deleteArticleMutation.isPending ? "Suppression..." : "Supprimer"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modale édition ──────────────────────────────────── */}
      <Dialog open={!!editArticle} onOpenChange={(open) => { if (!open) closeEdit() }}>
        <DialogContent className="max-w-2xl">
          {editArticle && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier l&apos;article</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-title">Titre</label>
                  <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-tag">Catégorie</label>
                  <select
                    id="edit-tag"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border/80 bg-surface-strong px-3 text-sm"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-brand-dark" htmlFor="edit-content">Contenu</label>
                  <Textarea
                    id="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-dark">Fichier joint</p>
                  {editArticle.mediaUrl && !removeEditAttachment ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface px-3 py-2">
                      <span className="flex-1 truncate text-xs text-muted-foreground">
                        {editArticle.mediaUrl.split("/").at(-1)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => { setEditAttachment(null); setRemoveEditAttachment(true) }}
                      >
                        Retirer
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucun fichier</p>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => { setEditAttachment(e.target.files?.[0] ?? null); setRemoveEditAttachment(false) }}
                  />
                  {editAttachment && (
                    <p className="text-xs text-muted-foreground">Nouveau fichier : {editAttachment.name}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeEdit}>Annuler</Button>
                <Button onClick={() => updateArticleMutation.mutate()} disabled={updateArticleMutation.isPending}>
                  {updateArticleMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Formulaire création + catégories ────────────────── */}
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant="secondary">Admin - CMS</Badge>
          <CardTitle className="text-3xl md:text-4xl">Gestion du contenu preventif</CardTitle>
          <CardDescription className="text-base">
            Ajouter, modifier, depublier et supprimer les contenus de prevention.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-border/75 bg-surface p-4 shadow-subtle">
            <p className="text-sm font-semibold text-brand-dark">Ajouter un article</p>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre" />
            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/80 bg-surface-strong px-3 text-sm"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
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
                onChange={(e) => setNewAttachment(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                {newAttachment ? `Fichier : ${newAttachment.name}` : "Formats acceptes : PDF, DOC, DOCX, TXT"}
              </p>
            </div>
            <Button onClick={() => createArticleMutation.mutate()} disabled={createArticleMutation.isPending}>
              {createArticleMutation.isPending ? "Ajout..." : "Ajouter l'article"}
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border/75 bg-surface p-4 shadow-subtle">
            <p className="text-sm font-semibold text-brand-dark">Categories (tags)</p>
            <div className="flex flex-wrap gap-2">
              {(categoriesQuery.data ?? []).map((cat) => (
                <span
                  key={cat.idCategorie}
                  className="inline-flex items-center gap-1 rounded-full border border-border/75 bg-surface-strong px-2.5 py-1 text-xs font-medium text-brand-dark"
                >
                  {cat.libelle}
                  {cat.libelle !== "Général" && (
                    <button
                      type="button"
                      aria-label={`Supprimer ${cat.libelle}`}
                      onClick={() => {
                        if (window.confirm(`Supprimer la catégorie "${cat.libelle}" ?`)) {
                          deleteCategoryMutation.mutate(cat.idCategorie)
                        }
                      }}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nouvelle categorie"
              />
              <Button variant="outline" onClick={() => createCategoryMutation.mutate()}>
                Ajouter
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Articles publies : {publishedCount}</p>
            {categoriesQuery.error ? <p className="text-xs text-destructive">{categoriesQuery.error.message}</p> : null}
          </div>
        </CardContent>
      </Card>

      {/* ── Table articles ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Articles et fiches conseils</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Categorie</TableHead>
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
                    {row.mediaUrl ? (() => {
                      const url = getMediaUrl(row.mediaUrl)
                      return url ? (
                        <MediaDownloadButton
                          mediaUrl={url}
                          filename={url.split("/").at(-1)}
                          label={((n) => n.length > 25 ? n.slice(0, 22) + "…" : n)(url.split("/").at(-1) ?? "Fichier")}
                          className="h-7 text-xs"
                        />
                      ) : null
                    })() : (
                      <span className="text-xs text-muted-foreground">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.estPublie ? "default" : "outline"} className="text-xs">
                      {row.estPublie ? "Publie" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPreviewArticle(row)}>
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => togglePublishMutation.mutate(row)}>
                        {row.estPublie ? "Depublier" : "Publier"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteArticleMutation.mutate(row)}>
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
    </div>
  )
}
