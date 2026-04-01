import { NextRequest, NextResponse } from "next/server"
import { getAllNotes } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") ?? undefined
    const notes = getAllNotes(category)
    return NextResponse.json(notes)
  } catch (err) {
    console.error("[GET /api/notes]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
