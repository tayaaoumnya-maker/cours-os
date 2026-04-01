import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { extractPdf, structureText } from "@/lib/parser"
import { createNote } from "@/lib/db"
import type { Category } from "@/types"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

const ALLOWED_CATEGORIES: Category[] = ["smma", "ecommerce", "autre"]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const category = (formData.get("category") as Category) ?? "autre"

    // Validation
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés" }, { status: 400 })
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)" }, { status: 400 })
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 })
    }

    // Lecture du buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extraction PDF
    const rawText = await extractPdf(buffer)
    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "Impossible d'extraire le texte du PDF" }, { status: 422 })
    }

    // Structuration automatique
    const { title, subtitle, structured } = structureText(rawText)
    if (subtitle) structured.subtitle = subtitle

    // Sauvegarde du fichier sur disque
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }
    const timestamp = Date.now()
    const safeFilename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`
    const filePath = path.join(UPLOADS_DIR, safeFilename)
    fs.writeFileSync(filePath, buffer)

    // Sauvegarde en base
    const note = createNote({
      title,
      category,
      raw_text: rawText,
      structured,
      filename: safeFilename,
    })

    return NextResponse.json(note, { status: 201 })
  } catch (err) {
    console.error("[POST /api/upload]", err)
    return NextResponse.json({ error: "Erreur lors du traitement du PDF" }, { status: 500 })
  }
}
