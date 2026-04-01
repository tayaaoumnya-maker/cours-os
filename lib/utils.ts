import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import type { Category } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "d MMM yyyy", { locale: fr })
  } catch {
    return dateStr
  }
}

export const CATEGORY_LABELS: Record<Category, string> = {
  smma: "SMMA",
  ecommerce: "E-commerce",
  autre: "Autre",
}

export const CATEGORY_COLORS: Record<Category, string> = {
  smma: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  ecommerce: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  autre: "text-orange-400 bg-orange-400/10 border-orange-400/20",
}

export const CATEGORY_DOT: Record<Category, string> = {
  smma: "bg-cyan-400",
  ecommerce: "bg-violet-400",
  autre: "bg-orange-400",
}
