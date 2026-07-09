import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "Ressources"

export const supabase = createClient(supabaseUrl, supabaseKey)

/** Vérifie si l'URL est hébergée sur Supabase Storage */
export function isSupabaseUrl(url: string): boolean {
  return url.startsWith(supabaseUrl) || url.includes(".supabase.co/storage/")
}

/** Extrait le chemin du fichier depuis une URL publique Supabase */
export function extractSupabasePath(publicUrl: string): string {
  const marker = `/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return publicUrl
  return publicUrl.slice(idx + marker.length)
}

/** Assainit un nom de fichier pour Supabase Storage (ASCII uniquement, sans espaces) */
function sanitizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".")
  const ext = lastDot !== -1 ? name.slice(lastDot) : ""
  const base = lastDot !== -1 ? name.slice(0, lastDot) : name
  return base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // supprime les diacritiques (accents)
    .replace(/[^a-zA-Z0-9._-]/g, "_") // remplace tout caractère non autorisé par _
    .replace(/_+/g, "_")              // évite les __ consécutifs
    .replace(/^_+|_+$/g, "")          // retire les _ en début/fin
    + ext.toLowerCase()               // extension en minuscules (.PDF → .pdf)
}

/** Upload un fichier vers Supabase Storage, retourne l'URL publique et le nom original */
export async function uploadMedia(file: File): Promise<{ url: string; originalName: string }> {
  const filename = sanitizeFilename(file.name)

  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) throw new Error(`Upload Supabase échoué : ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return { url: data.publicUrl, originalName: file.name }
}

/** Supprime un fichier depuis Supabase Storage à partir de son URL publique */
export async function deleteSupabaseFile(publicUrl: string): Promise<void> {
  const path = extractSupabasePath(publicUrl)
  await supabase.storage.from(BUCKET).remove([path])
}

/** Construit l'URL d'accès au média :
 *  - URL absolue (Supabase ou autre) → retournée telle quelle
 *  - Chemin relatif → préfixé avec le backend local
 */
export function getMediaUrl(media: string | null | undefined): string | null {
  if (!media) return null
  if (media.startsWith("http")) return media
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
  return `${base}${media}`
}

/** Télécharge un fichier depuis Supabase via le SDK (évite les problèmes CORS) */
export async function downloadFromSupabase(publicUrl: string, filename: string): Promise<void> {
  const path = extractSupabasePath(publicUrl)
  const { data, error } = await supabase.storage.from(BUCKET).download(path)
  if (error || !data) throw new Error(error?.message ?? "Téléchargement échoué")

  const url = URL.createObjectURL(data)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Déclenche le téléchargement depuis n'importe quelle source */
export async function triggerDownload(mediaUrl: string, fallbackName: string): Promise<void> {
  if (isSupabaseUrl(mediaUrl)) {
    await downloadFromSupabase(mediaUrl, fallbackName)
    return
  }


  try {
    const response = await fetch(mediaUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fallbackName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // Dernier recours : ouverture dans un nouvel onglet
    window.open(mediaUrl, "_blank", "noreferrer")
  }
}
