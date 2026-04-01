import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"
import { cn, formatDate, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_DOT } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Note, NoteStructured } from "@/types"

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  const structured: NoteStructured | null = note.structured
    ? JSON.parse(note.structured)
    : null

  const sectionCount = structured?.sections?.length ?? 0
  const preview = structured?.sections?.[0]?.bullets?.[0] ?? null

  return (
    <Link href={`/notes/${note.id}`} className="group block">
      <div className={cn(
        "relative flex items-center gap-4 rounded-xl border bg-bg-surface px-4 py-3.5 transition-all duration-200",
        "border-bg-border hover:border-bg-border/60 hover:bg-bg-elevated",
        "hover:shadow-lg hover:shadow-black/20"
      )}>
        {/* Accent left bar */}
        <span className={cn(
          "absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
          CATEGORY_DOT[note.category]
        )} />

        {/* Dot catégorie */}
        <span className={cn("w-2 h-2 rounded-full shrink-0", CATEGORY_DOT[note.category])} />

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-medium text-text-primary truncate">
              {note.title}
            </h3>
            <Badge className={cn("shrink-0 text-[10px]", CATEGORY_COLORS[note.category])}>
              {CATEGORY_LABELS[note.category]}
            </Badge>
          </div>
          {preview && (
            <p className="text-xs text-text-muted truncate">{preview}</p>
          )}
        </div>

        {/* Meta + arrow */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-text-muted">{formatDate(note.created_at)}</p>
            <p className="text-[11px] text-text-muted">
              {sectionCount} section{sectionCount !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight
            size={13}
            className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  )
}
