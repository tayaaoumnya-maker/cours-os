"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { BookOpen, Layers, Tag, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

const CATEGORIES: { value: Category | "all"; label: string; color: string; dot: string }[] = [
  { value: "all", label: "Toutes", color: "text-text-secondary", dot: "bg-text-muted" },
  { value: "smma", label: "SMMA", color: "text-cyan-400", dot: "bg-cyan-400" },
  { value: "ecommerce", label: "E-commerce", color: "text-violet-400", dot: "bg-violet-400" },
  { value: "autre", label: "Autre", color: "text-orange-400", dot: "bg-orange-400" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? "all"

  const isNotesRoot = pathname === "/notes" || pathname.startsWith("/notes/")

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-bg-border bg-bg-surface">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-bg-border">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
          <BookOpen size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-text-primary">Cours OS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* Dashboard link */}
        <Link
          href="/notes"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
            isNotesRoot && activeCategory === "all"
              ? "bg-bg-elevated text-text-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
          )}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </Link>

        {/* Séparateur catégories */}
        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Catégories
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const href =
            cat.value === "all"
              ? "/notes"
              : `/notes?category=${cat.value}`
          const isActive =
            cat.value === "all"
              ? isNotesRoot && activeCategory === "all"
              : isNotesRoot && activeCategory === cat.value

          return (
            <Link
              key={cat.value}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-bg-elevated text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cat.dot)} />
              <span className={cn(isActive ? "text-text-primary" : cat.color)}>
                {cat.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-bg-border">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Usage personnel uniquement
        </p>
      </div>
    </aside>
  )
}
