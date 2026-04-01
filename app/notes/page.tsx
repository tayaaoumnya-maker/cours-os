import { getAllNotes, getStats } from "@/lib/db"
import NoteCard from "@/components/notes/NoteCard"
import NoteCardFeatured from "@/components/notes/NoteCardFeatured"
import UploadZone from "@/components/notes/UploadZone"
import { CATEGORY_LABELS } from "@/lib/utils"
import {
  BookOpen, FileText, Layers, Tag, ArrowRight
} from "lucide-react"
import Link from "next/link"
import type { Category } from "@/types"

interface PageProps {
  searchParams: { category?: string }
}

export default function NotesPage({ searchParams }: PageProps) {
  const category = searchParams.category as Category | undefined
  const allNotes = getAllNotes()
  const filteredNotes = getAllNotes(category)
  const stats = getStats()

  const recent = allNotes.slice(0, 3)
  const isFiltered = !!category

  const now = new Date()
  const dateLabel = now.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="min-h-screen bg-bg-base">

      {/* ── Top Header ───────────────────────────────────────── */}
      <div className="border-b border-bg-border bg-bg-surface/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-text-primary">
              {isFiltered ? CATEGORY_LABELS[category!] : "Dashboard"}
            </h1>
            <span className="text-bg-border">·</span>
            <span className="text-xs text-text-muted capitalize">{dateLabel}</span>
          </div>
          <UploadZone />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">

        {/* ── KPIs ─────────────────────────────────────────────── */}
        {!isFiltered && (
          <section>
            <SectionLabel icon={<Layers size={12} />} label="Vue d'ensemble" />
            <div className="grid grid-cols-4 gap-3 mt-3">
              <KpiCard
                label="Total notes"
                value={stats.total}
                icon={<BookOpen size={16} />}
                color="text-text-primary"
                bg="bg-bg-elevated"
                border="border-bg-border"
              />
              <KpiCard
                label="SMMA"
                value={stats.smma}
                icon={<Tag size={16} />}
                color="text-cyan-400"
                bg="bg-cyan-400/5"
                border="border-cyan-400/15"
                href="/notes?category=smma"
              />
              <KpiCard
                label="E-commerce"
                value={stats.ecommerce}
                icon={<Tag size={16} />}
                color="text-violet-400"
                bg="bg-violet-400/5"
                border="border-violet-400/15"
                href="/notes?category=ecommerce"
              />
              <KpiCard
                label="Autre"
                value={stats.autre}
                icon={<Tag size={16} />}
                color="text-orange-400"
                bg="bg-orange-400/5"
                border="border-orange-400/15"
                href="/notes?category=autre"
              />
            </div>
          </section>
        )}

        {/* ── Notes récentes ────────────────────────────────────── */}
        {!isFiltered && recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel icon={<FileText size={12} />} label="Notes récentes" />
              {allNotes.length > 3 && (
                <Link
                  href="/notes"
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
                >
                  Voir tout <ArrowRight size={11} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {recent.map((note) => (
                <NoteCardFeatured key={note.id} note={note} />
              ))}
            </div>
          </section>
        )}

        {/* ── Toutes les notes / filtrées ───────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel
              icon={<BookOpen size={12} />}
              label={isFiltered ? `${CATEGORY_LABELS[category!]} — ${filteredNotes.length} note${filteredNotes.length !== 1 ? "s" : ""}` : `Toutes les notes — ${allNotes.length}`}
            />
          </div>

          {filteredNotes.length === 0 ? (
            <EmptyState category={category} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

// ── Composants internes ────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted">{icon}</span>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </span>
    </div>
  )
}

function KpiCard({
  label, value, icon, color, bg, border, href,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bg: string
  border: string
  href?: string
}) {
  const inner = (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-4 flex flex-col gap-3 transition-colors ${href ? "hover:border-opacity-60 cursor-pointer" : ""}`}>
      <div className="flex items-center justify-between">
        <span className={`${color} opacity-70`}>{icon}</span>
        {href && <ArrowRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
      <div>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="group">{inner}</Link>
  }
  return inner
}

function EmptyState({ category }: { category?: string }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-bg-border text-center">
      <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-bg-border flex items-center justify-center mb-3">
        <FileText size={18} className="text-text-muted" />
      </div>
      <p className="text-sm font-medium text-text-secondary mb-1">Aucune note</p>
      <p className="text-xs text-text-muted">
        {category ? `Aucune note dans la catégorie ${CATEGORY_LABELS[category as Category]}.` : "Importez un PDF pour commencer."}
      </p>
    </div>
  )
}
