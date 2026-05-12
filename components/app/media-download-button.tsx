"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { triggerDownload } from "@/lib/supabase"

type MediaDownloadButtonProps = {
  mediaUrl: string
  filename?: string
  label?: string
  className?: string
}

export function MediaDownloadButton({
  mediaUrl,
  filename,
  label = "Télécharger le document",
  className,
}: MediaDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fallbackName = filename ?? mediaUrl.split("/").at(-1) ?? "document"

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      await triggerDownload(mediaUrl, fallbackName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de téléchargement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {loading ? "Téléchargement..." : label}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
