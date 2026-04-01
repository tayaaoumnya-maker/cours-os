"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Section } from "@/types"

function sectionType(title: string): "intro" | "conclusion" | "chapter" {
  const t = title.toLowerCase()
  if (t === "introduction") return "intro"
  if (t === "conclusion") return "conclusion"
  return "chapter"
}

const TYPE_STYLES = {
  intro:      { dot: "bg-sky-400",     text: "text-sky-400",     icon: "①" },
  chapter:    { dot: "bg-accent",      text: "text-accent",      icon: "◆" },
  conclusion: { dot: "bg-emerald-400", text: "text-emerald-400", icon: "✦" },
}

interface TableOfContentsProps {
  sections: Section[]
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )
    sections.forEach((_, i) => {
      const el = document.getElementById(`section-${i}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return null

  return (
    <nav className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
        Table des matières
      </p>
      {sections.map((section, i) => {
        const type = sectionType(section.title)
        const style = TYPE_STYLES[type]
        const isActive = active === `section-${i}`

        return (
          <a
            key={i}
            href={`#section-${i}`}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all",
              isActive
                ? `bg-bg-elevated ${style.text} font-medium`
                : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
            )}
          >
            <span className={cn("text-[10px] shrink-0", isActive ? style.text : "text-text-muted")}>
              {style.icon}
            </span>
            <span className="truncate">{section.title}</span>
            <span className="ml-auto text-[10px] text-text-muted shrink-0">
              {section.bullets.length}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
