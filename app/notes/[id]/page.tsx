import { notFound } from "next/navigation"
import Link from "next/link"
import { getNoteById } from "@/lib/db"
import { formatDate, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_DOT } from "@/lib/utils"
import { ArrowLeft, Calendar, FileText, Hash, AlignLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import NoteDetail from "@/components/notes/NoteDetail"
import NoteActions from "@/components/notes/NoteActions"
import TableOfContents from "@/components/notes/TableOfContents"
import type { NoteStructured } from "@/types"

interface PageProps {
  params: { id: string }
}

export default function NoteDetailPage({ params }: PageProps) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) notFound()

  const note = getNoteById(id)
  if (!note) notFound()

  const structured: NoteStructured | null = note.structured
    ? JSON.parse(note.structured)
    : null

  const sections = structured?.sections ?? []
  const sectionCount = sections.length
  const bulletCount = sections.reduce((acc, s) => acc + s.bullets.length, 0)
  const chapterCount = sections.filter(
    (s) => s.title.toLowerCase() !== "introduction" && s.title.toLowerCase() !== "conclusion"
  ).length

  return (
    <div className="min-h-screen bg-bg-base">

      {/* ── Top bar sticky ─────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-bg-border bg-bg-surface/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-8 h-13 py-3 flex items-center justify-between gap-4">
          <Link
            href="/notes"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={13} />
            Retour
          </Link>
          <NoteActions
            id={note.id}
            title={note.title}
            category={note.category}
            structured={structured}
          />
        </div>
      </div>

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className="border-b border-bg-border bg-bg-surface">
        <div className="max-w-6xl mx-auto px-8 py-8">

          {/* Catégorie */}
          <Badge className={cn("mb-3 text-xs", CATEGORY_COLORS[note.category])}>
            {CATEGORY_LABELS[note.category]}
          </Badge>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight mb-2 max-w-3xl">
            {note.title}
          </h1>

          {/* Sous-titre */}
          {structured?.subtitle && (
            <p className="text-base text-text-secondary mb-5 max-w-2xl leading-relaxed">
              {structured.subtitle}
            </p>
          )}

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-5 mt-4">
            <MetaItem icon={<Calendar size={12} />} label={formatDate(note.created_at)} />
            <MetaItem icon={<AlignLeft size={12} />} label={`${sectionCount} section${sectionCount !== 1 ? "s" : ""}`} />
            <MetaItem icon={<Hash size={12} />} label={`${bulletCount} point${bulletCount !== 1 ? "s" : ""}`} />
            <MetaItem icon={<FileText size={12} />} label={`${chapterCount} chapitre${chapterCount !== 1 ? "s" : ""}`} />
            {note.filename && (
              <MetaItem icon={<FileText size={12} />} label={note.filename.replace(/^\d+-/, "")} />
            )}
          </div>

          {/* Barre de progression sections */}
          {sectionCount > 0 && (
            <div className="flex gap-1 mt-5">
              {sections.map((s, i) => {
                const t = s.title.toLowerCase()
                const color =
                  t === "introduction" ? "bg-sky-400" :
                  t === "conclusion" ? "bg-emerald-400" :
                  "bg-accent"
                return (
                  <div
                    key={i}
                    className={cn("h-1 rounded-full flex-1", color)}
                    style={{ opacity: 0.6 + (i / sectionCount) * 0.4 }}
                    title={s.title}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Contenu principal ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-8">

          {/* Table des matières sticky */}
          {sections.length > 1 && (
            <aside className="w-52 shrink-0">
              <div className="sticky top-20">
                <TableOfContents sections={sections} />
              </div>
            </aside>
          )}

          {/* Sections */}
          <div className="flex-1 min-w-0">
            <NoteDetail structured={structured} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-muted">
      {icon}
      {label}
    </span>
  )
}
