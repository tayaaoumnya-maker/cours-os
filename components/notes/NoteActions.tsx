"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Pencil, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { cn, CATEGORY_LABELS } from "@/lib/utils"
import type { Category, NoteStructured } from "@/types"

interface NoteActionsProps {
  id: number
  title: string
  category: Category
  structured: NoteStructured | null
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "smma", label: "SMMA" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "autre", label: "Autre" },
]

// ── Delete ─────────────────────────────────────────────────────────────────

function DeleteDialog({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      if (res.ok) {
        setOpen(false)
        router.push("/notes")
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 size={13} />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer cette note ?</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-2 mt-1 mb-5 text-xs text-text-secondary bg-red-400/5 border border-red-400/15 rounded-md px-3 py-2.5">
          <AlertCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
          Cette action est irréversible. La note sera définitivement supprimée.
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Annuler</Button>
          </DialogClose>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 size={13} className="animate-spin" />}
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit ───────────────────────────────────────────────────────────────────

function EditDialog({
  id,
  title: initialTitle,
  category: initialCategory,
}: {
  id: number
  title: string
  category: Category
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState<Category>(initialCategory)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!title.trim()) { setError("Le titre ne peut pas être vide"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category }),
      })
      if (res.ok) {
        setOpen(false)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? "Erreur lors de la sauvegarde")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setTitle(initialTitle); setCategory(initialCategory); setError("") } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil size={13} />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
        </DialogHeader>

        {/* Titre */}
        <div className="space-y-1.5 mt-1">
          <label className="text-xs font-medium text-text-secondary">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              "w-full bg-bg-base border border-bg-border rounded-md px-3 py-2",
              "text-sm text-text-primary placeholder:text-text-muted",
              "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent",
              "transition-colors"
            )}
            placeholder="Titre de la note"
          />
        </div>

        {/* Catégorie */}
        <div className="space-y-1.5 mt-4">
          <label className="text-xs font-medium text-text-secondary">Catégorie</label>
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

        {/* Erreur */}
        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Annuler</Button>
          </DialogClose>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {loading && <Loader2 size={13} className="animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Export ─────────────────────────────────────────────────────────────────

export default function NoteActions({ id, title, category, structured }: NoteActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <EditDialog id={id} title={title} category={category} />
      <DeleteDialog id={id} />
    </div>
  )
}
