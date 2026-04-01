import { NextRequest, NextResponse } from "next/server"
import { getNoteById, updateNote, deleteNote } from "@/lib/db"
import type { UpdateNoteInput } from "@/types"

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const note = getNoteById(id)
    if (!note) return NextResponse.json({ error: "Note introuvable" }, { status: 404 })

    return NextResponse.json(note)
  } catch (err) {
    console.error("[GET /api/notes/:id]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const body: UpdateNoteInput = await req.json()
    const updated = updateNote(id, body)
    if (!updated) return NextResponse.json({ error: "Note introuvable" }, { status: 404 })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("[PUT /api/notes/:id]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

    const deleted = deleteNote(id)
    if (!deleted) return NextResponse.json({ error: "Note introuvable" }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/notes/:id]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
