import { cn, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { NoteStructured, Category, Section } from "@/types"

interface NoteDetailProps {
  structured: NoteStructured | null
}

function sectionType(title: string): "intro" | "conclusion" | "chapter" {
  const t = title.toLowerCase()
  if (t === "introduction") return "intro"
  if (t === "conclusion") return "conclusion"
  return "chapter"
}

const TYPE_CONFIG = {
  intro: {
    icon: "①",
    label: "Introduction",
    headerBg: "bg-sky-400/5 border-sky-400/15",
    titleColor: "text-sky-300",
    dotColor: "bg-sky-400",
    bulletDot: "bg-sky-400/60",
    badgeCn: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    divider: "bg-sky-400/20",
  },
  chapter: {
    icon: "◆",
    label: "Chapitre",
    headerBg: "bg-accent/5 border-accent/15",
    titleColor: "text-indigo-300",
    dotColor: "bg-accent",
    bulletDot: "bg-accent/60",
    badgeCn: "text-accent bg-accent/10 border-accent/20",
    divider: "bg-accent/20",
  },
  conclusion: {
    icon: "✦",
    label: "Conclusion",
    headerBg: "bg-emerald-400/5 border-emerald-400/15",
    titleColor: "text-emerald-300",
    dotColor: "bg-emerald-400",
    bulletDot: "bg-emerald-400/60",
    badgeCn: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    divider: "bg-emerald-400/20",
  },
}

function SectionBlock({ section, index }: { section: Section; index: number }) {
  const type = sectionType(section.title)
  const cfg = TYPE_CONFIG[type]
  const chapterNumber = type === "chapter" ? index : null

  return (
    <div id={`section-${index}`} className="scroll-mt-6">
      <div className={cn("rounded-xl border overflow-hidden", cfg.headerBg)}>

        {/* Section header */}
        <div className={cn("px-5 py-4 border-b", cfg.headerBg)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Numéro / Icône */}
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                type === "intro" ? "bg-sky-400/15 text-sky-300" :
                type === "conclusion" ? "bg-emerald-400/15 text-emerald-300" :
                "bg-accent/15 text-indigo-300"
              )}>
                {chapterNumber !== null ? chapterNumber : cfg.icon}
              </div>

              {/* Titre de section */}
              <h2 className={cn("text-sm font-semibold tracking-tight", cfg.titleColor)}>
                {section.title}
              </h2>
            </div>

            {/* Badge type + compteur */}
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={cn("text-[10px]", cfg.badgeCn)}>{cfg.label}</Badge>
              <span className="text-[11px] text-text-muted">
                {section.bullets.length} point{section.bullets.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Bullet points */}
        <div className="px-5 py-4 bg-bg-surface/40">
          {section.bullets.length > 0 ? (
            <ul className="space-y-3">
              {section.bullets.map((bullet, j) => (
                <li key={j} className="flex items-start gap-3 group">
                  {/* Numéro bullet */}
                  <span className={cn(
                    "mt-0.5 min-w-[20px] h-5 flex items-center justify-center",
                    "text-[10px] font-semibold rounded shrink-0",
                    type === "intro" ? "text-sky-400/70" :
                    type === "conclusion" ? "text-emerald-400/70" :
                    "text-accent/70"
                  )}>
                    {String(j + 1).padStart(2, "0")}
                  </span>

                  {/* Séparateur vertical */}
                  <span className={cn("w-px self-stretch rounded-full shrink-0 mt-0.5", cfg.divider)} />

                  {/* Texte */}
                  <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted italic">Section vide.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NoteDetail({ structured }: NoteDetailProps) {
  if (!structured || structured.sections.length === 0) {
    return (
      <p className="text-sm text-text-muted italic">
        Aucun contenu structuré disponible.
      </p>
    )
  }

  let chapterIndex = 0

  return (
    <div className="space-y-4">
      {structured.sections.map((section, i) => {
        const type = sectionType(section.title)
        if (type === "chapter") chapterIndex++
        return (
          <SectionBlock
            key={i}
            section={section}
            index={type === "chapter" ? chapterIndex : i}
          />
        )
      })}
    </div>
  )
}
