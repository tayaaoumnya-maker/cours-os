import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"
import { cn, formatDate, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_DOT } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Note, NoteStructured } from "@/types"

interface NoteCardFeaturedProps {
  note: Note
}

export default function NoteCardFeatured({ note }: NoteCardFeaturedProps) {
  const structured: NoteStructured | null = note.structured
    ? JSON.parse(note.structured)
    : null

  const sectionCount = structured?.sections?.length ?? 0
  const bullets = structured?.sections?.flatMap((s) => s.bullets) ?? []
  const preview = bullets.slice(0, 2)

  return (
    <Link href={`/notes/${note.id}`} className="group block h-full">
      <div className={cn(
        "relative h-full flex flex-col rounded-xl border bg-bg-surface p-5 transition-all duration-200",
        "border-bg-border hover:border-bg-border/60 hover:bg-bg-elevated",
        "hover:shadow-xl hover:shadow-black/30"
      )}>
        {/* Accent top bar */}
        <span className={cn(
          "absolute top-0 left-5 right-5 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
          CATEGORY_DOT[note.category]
        )} />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className={cn("shrink-0 text-[10px]", CATEGORY_COLORS[note.category])}>
            {CATEGORY_LABELS[note.category]}
          </Badge>
          <ChevronRight
            size={13}
            className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
          />
        </div>

        {/* Titre */}
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-3 line-clamp-2">
          {note.title}
        </h3>

        {/* Preview bullets */}
        {preview.length > 0 && (
          <ul className="space-y-1.5 flex-1 mb-4">
            {preview.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={cn("w-1 h-1 rounded-full mt-1.5 shrink-0", CATEGORY_DOT[note.category])} />
                <span className="text-xs text-text-muted leading-relaxed line-clamp-2">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-bg-border/50">
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <Calendar size={10} />
            {formatDate(note.created_at)}
          </span>
          <span className="text-[11px] text-text-muted">
            {sectionCount} section{sectionCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  )
}
