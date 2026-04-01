import type { NoteStructured, Section } from "@/types"

// ── Mots-clés ──────────────────────────────────────────────────────────────

const INTRO_KEYWORDS = [
  "introduction", "intro", "présentation", "avant-propos", "préambule",
  "contexte", "overview", "à propos", "objectif", "objectifs",
]

const CONCLUSION_KEYWORDS = [
  "conclusion", "conclusions", "synthèse", "résumé", "bilan",
  "récapitulatif", "recap", "en résumé", "pour conclure", "takeaway",
  "takeaways", "key takeaways", "points clés", "points-clés", "à retenir",
  "ce qu'il faut retenir", "next steps", "prochaines étapes",
]

const CHAPTER_PATTERNS = [
  /^chapitre\s+\d+/i,
  /^chapter\s+\d+/i,
  /^partie\s+\d+/i,
  /^part\s+\d+/i,
  /^\d+[\.\)]\s+\w/,          // "1. Titre", "2) Titre"
  /^[IVXLC]+[\.\)]\s+\w/,    // "I. Titre", "II. Titre"
  /^[A-Z][\.\)]\s+\w/,       // "A. Titre", "B) Titre"
]

// ── Utilitaires ────────────────────────────────────────────────────────────

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/gm, "")
    .trim()
}

function matchesKeywords(line: string, keywords: string[]): boolean {
  const normalized = line.toLowerCase().trim()
  return keywords.some(
    (kw) => normalized === kw || normalized.startsWith(kw + " ") || normalized.startsWith(kw + ":")
  )
}

function isChapterHeader(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  return CHAPTER_PATTERNS.some((re) => re.test(trimmed))
}

function isGenericHeader(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length < 3) return false

  // Tout en majuscules
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-ZÀÉÈÊËÎÏÔÙÛ]/.test(trimmed)) return true

  // Numéroté
  if (isChapterHeader(trimmed)) return true

  // Court, sans ponctuation finale → probable titre
  if (trimmed.length < 70 && !trimmed.endsWith(".") && !trimmed.endsWith(",") && !trimmed.endsWith(";")) {
    if (trimmed.split(" ").length <= 9) return true
  }

  return false
}

function lineToBullets(paragraph: string): string[] {
  const lines = paragraph.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
  const bullets: string[] = []

  for (const line of lines) {
    // Déjà bullet
    if (/^[-•*►▶→]\s/.test(line)) {
      bullets.push(line.replace(/^[-•*►▶→]\s+/, "").trim())
      continue
    }
    // Phrase longue → découpe sur ". "
    if (line.length > 120 && line.includes(". ")) {
      line.split(/(?<=\.)\s+/).forEach((s) => { if (s.trim()) bullets.push(s.trim()) })
    } else {
      bullets.push(line)
    }
  }

  return bullets.filter((b) => b.length > 0)
}

// ── Extraction titre + sous-titre ──────────────────────────────────────────

function extractTitleAndSubtitle(lines: string[]): {
  title: string
  subtitle: string | null
  rest: string[]
} {
  // Titre = première ligne non vide
  const firstIdx = lines.findIndex((l) => l.trim().length > 0)
  if (firstIdx === -1) return { title: "Note sans titre", subtitle: null, rest: [] }

  const title = lines[firstIdx].trim()
  const after = lines.slice(firstIdx + 1)

  // Sous-titre = prochaine ligne non vide, courte (< 100 chars), qui n'est pas un header de section
  const secondIdx = after.findIndex((l) => l.trim().length > 0)
  if (secondIdx === -1) return { title, subtitle: null, rest: after }

  const candidate = after[secondIdx].trim()
  const isSubtitle =
    candidate.length < 100 &&
    !matchesKeywords(candidate, INTRO_KEYWORDS) &&
    !matchesKeywords(candidate, CONCLUSION_KEYWORDS) &&
    !isChapterHeader(candidate) &&
    candidate.split(" ").length <= 12

  if (isSubtitle) {
    return { title, subtitle: candidate, rest: after.slice(secondIdx + 1) }
  }

  return { title, subtitle: null, rest: after }
}

// ── Regroupement lignes → blocs ────────────────────────────────────────────

interface RawBlock {
  type: "intro" | "conclusion" | "chapter" | "generic" | "body"
  header: string
  lines: string[]
}

function buildRawBlocks(lines: string[]): RawBlock[] {
  const blocks: RawBlock[] = []
  let current: RawBlock | null = null
  let pendingLines: string[] = []

  const flush = () => {
    if (pendingLines.length > 0 && current) {
      current.lines.push(...pendingLines)
      pendingLines = []
    }
  }

  const pushBlock = (block: RawBlock) => {
    flush()
    if (current) blocks.push(current)
    current = block
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { pendingLines.push(""); continue }

    if (matchesKeywords(trimmed, INTRO_KEYWORDS)) {
      pushBlock({ type: "intro", header: trimmed, lines: [] })
    } else if (matchesKeywords(trimmed, CONCLUSION_KEYWORDS)) {
      pushBlock({ type: "conclusion", header: trimmed, lines: [] })
    } else if (isChapterHeader(trimmed)) {
      pushBlock({ type: "chapter", header: trimmed, lines: [] })
    } else if (isGenericHeader(trimmed)) {
      pushBlock({ type: "generic", header: trimmed, lines: [] })
    } else {
      if (!current) {
        current = { type: "body", header: "Introduction", lines: [] }
      }
      if (pendingLines.length > 0) {
        current.lines.push(...pendingLines)
        pendingLines = []
      }
      current.lines.push(trimmed)
    }
  }

  flush()
  if (current) blocks.push(current)

  return blocks
}

// ── Assemblage structure finale ────────────────────────────────────────────

function assembleStructure(blocks: RawBlock[]): Section[] {
  const introBlocks: Section[] = []
  const chapterBlocks: Section[] = []
  const conclusionBlocks: Section[] = []

  for (const block of blocks) {
    const bullets = lineToBullets(block.lines.join("\n"))
    if (bullets.length === 0) continue

    const section: Section = { title: block.header, bullets }

    if (block.type === "intro" || block.type === "body") {
      introBlocks.push(section)
    } else if (block.type === "conclusion") {
      conclusionBlocks.push(section)
    } else {
      chapterBlocks.push(section)
    }
  }

  const result: Section[] = []

  // Introduction — toujours en premier
  if (introBlocks.length > 0) {
    // Fusionner si plusieurs blocs intro/body
    const merged: Section = {
      title: "Introduction",
      bullets: introBlocks.flatMap((s) => s.bullets),
    }
    result.push(merged)
  } else {
    // Forcer une intro vide si aucun contenu introductif détecté
    result.push({ title: "Introduction", bullets: ["Aucune introduction détectée dans ce document."] })
  }

  // Chapitres
  result.push(...chapterBlocks)

  // Conclusion — toujours en dernier
  if (conclusionBlocks.length > 0) {
    const merged: Section = {
      title: "Conclusion",
      bullets: conclusionBlocks.flatMap((s) => s.bullets),
    }
    result.push(merged)
  } else {
    result.push({ title: "Conclusion", bullets: ["Aucune conclusion détectée dans ce document."] })
  }

  return result
}

// ── API publique ───────────────────────────────────────────────────────────

export function structureText(raw: string): { title: string; subtitle: string | null; structured: NoteStructured } {
  const cleaned = cleanText(raw)
  const allLines = cleaned.split("\n")

  const { title, subtitle, rest } = extractTitleAndSubtitle(allLines)
  const blocks = buildRawBlocks(rest)
  const sections = assembleStructure(blocks)

  return { title, subtitle, structured: { sections } }
}

export async function extractPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default
  const data = await pdfParse(buffer)
  return data.text
}
