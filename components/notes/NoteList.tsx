import { FileText } from "lucide-react"
import NoteCard from "./NoteCard"
import type { Note } from "@/types"

interface NoteListProps {
  notes: Note[]
  category?: string
}

export default function NoteList({ notes, category }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center mb-4">
          <FileText size={20} className="text-text-muted" />
        </div>
        <p className="text-sm font-medium text-text-secondary mb-1">Aucune note</p>
        <p className="text-xs text-text-muted">
          {category && category !== "all"
            ? "Aucune note dans cette catégorie."
            : "Uploadez un PDF pour commencer."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
