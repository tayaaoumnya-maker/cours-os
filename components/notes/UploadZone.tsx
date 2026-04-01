"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Category } from "@/types"

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "smma", label: "SMMA" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "autre", label: "Autre" },
]

type Status = "idle" | "uploading" | "success" | "error"

export default function UploadZone() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState<Category>("smma")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string>("")

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setStatus("idle")
      setErrorMsg("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (!file) return
    setStatus("uploading")
    setErrorMsg("")

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("category", category)

      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data.error ?? "Erreur inconnue")
        return
      }

      setStatus("success")
      setTimeout(() => {
        setOpen(false)
        setFile(null)
        setStatus("idle")
        router.refresh()
      }, 1200)
    } catch {
      setStatus("error")
      setErrorMsg("Impossible de contacter le serveur")
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setFile(null)
      setStatus("idle")
      setErrorMsg("")
    }
    setOpen(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Upload size={13} />
          Importer un PDF
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer un PDF</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-accent bg-accent/5"
              : file
              ? "border-bg-border bg-bg-elevated"
              : "border-bg-border hover:border-text-muted"
          )}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 size={24} className="text-accent" />
              <p className="text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} Mo
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-text-muted" />
              <p className="text-sm text-text-secondary">
                {isDragActive ? "Déposez le fichier ici" : "Glissez un PDF ici"}
              </p>
              <p className="text-xs text-text-muted">ou cliquez pour sélectionner · max 20 Mo</p>
            </div>
          )}
        </div>

        {/* Catégorie */}
        <div className="mt-4">
          <p className="text-xs font-medium text-text-secondary mb-2">Catégorie</p>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors",
                  category === cat.value
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-bg-border text-text-muted hover:text-text-secondary hover:border-text-muted"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback erreur */}
        {status === "error" && (
          <div className="flex items-center gap-2 mt-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
            <AlertCircle size={13} />
            {errorMsg}
          </div>
        )}

        {/* Action */}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={!file || status === "uploading" || status === "success"}
          >
            {status === "uploading" && <Loader2 size={13} className="animate-spin" />}
            {status === "success" && <CheckCircle2 size={13} />}
            {status === "uploading" ? "Traitement…" : status === "success" ? "Importé !" : "Importer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
