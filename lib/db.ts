// Stub — SQLite remplacé par stockage en mémoire (non requis par l'app ATM)
import type { Note, CreateNoteInput, UpdateNoteInput } from "@/types"

let _notes: Note[] = []
let _nextId = 1

// ── Queries ────────────────────────────────────────────────────────────────

export function getAllNotes(category?: string): Note[] {
  if (category && category !== "all") return _notes.filter(n => n.category === category)
  return _notes
}

export function getNoteById(id: number): Note | null {
  return _notes.find(n => n.id === id) ?? null
}

export function createNote(input: CreateNoteInput): Note {
  const note: Note = {
    id: _nextId++,
    title: input.title,
    category: input.category,
    raw_text: input.raw_text ?? null,
    structured: JSON.stringify(input.structured),
    filename: input.filename ?? null,
    created_at: new Date().toISOString(),
  }
  _notes.push(note)
  return note
}

export function updateNote(id: number, input: UpdateNoteInput): Note | null {
  const idx = _notes.findIndex(n => n.id === id)
  if (idx === -1) return null
  if (input.title !== undefined) _notes[idx].title = input.title
  if (input.category !== undefined) _notes[idx].category = input.category
  if (input.structured !== undefined) _notes[idx].structured = JSON.stringify(input.structured)
  return _notes[idx]
}

export function deleteNote(id: number): boolean {
  const before = _notes.length
  _notes = _notes.filter(n => n.id !== id)
  return _notes.length < before
}

export function getStats(): { total: number; smma: number; ecommerce: number; autre: number } {
  return {
    total: _notes.length,
    smma: _notes.filter(n => n.category === "smma").length,
    ecommerce: _notes.filter(n => n.category === "ecommerce").length,
    autre: _notes.filter(n => n.category === "autre").length,
  }
}
