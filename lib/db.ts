import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import type { Note, CreateNoteInput, UpdateNoteInput } from "@/types"

const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "cours-os.db")

function getDb(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  const db = new Database(DB_PATH)
  db.pragma("journal_mode = WAL")
  return db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      category   TEXT    NOT NULL CHECK(category IN ('smma', 'ecommerce', 'autre')),
      raw_text   TEXT,
      structured TEXT,
      filename   TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

// Initialise la DB au démarrage
const db = getDb()
initSchema(db)

// ── Queries ────────────────────────────────────────────────────────────────

export function getAllNotes(category?: string): Note[] {
  if (category && category !== "all") {
    return db
      .prepare("SELECT * FROM notes WHERE category = ? ORDER BY created_at DESC")
      .all(category) as Note[]
  }
  return db
    .prepare("SELECT * FROM notes ORDER BY created_at DESC")
    .all() as Note[]
}

export function getNoteById(id: number): Note | null {
  return (
    (db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note) ?? null
  )
}

export function createNote(input: CreateNoteInput): Note {
  const stmt = db.prepare(`
    INSERT INTO notes (title, category, raw_text, structured, filename)
    VALUES (@title, @category, @raw_text, @structured, @filename)
  `)
  const result = stmt.run({
    ...input,
    structured: JSON.stringify(input.structured),
  })
  return getNoteById(result.lastInsertRowid as number)!
}

export function updateNote(id: number, input: UpdateNoteInput): Note | null {
  const existing = getNoteById(id)
  if (!existing) return null

  const updates: string[] = []
  const params: Record<string, unknown> = { id }

  if (input.title !== undefined) {
    updates.push("title = @title")
    params.title = input.title
  }
  if (input.category !== undefined) {
    updates.push("category = @category")
    params.category = input.category
  }
  if (input.structured !== undefined) {
    updates.push("structured = @structured")
    params.structured = JSON.stringify(input.structured)
  }

  if (updates.length === 0) return existing

  db.prepare(`UPDATE notes SET ${updates.join(", ")} WHERE id = @id`).run(params)
  return getNoteById(id)
}

export function deleteNote(id: number): boolean {
  const result = db.prepare("DELETE FROM notes WHERE id = ?").run(id)
  return result.changes > 0
}

export function getStats(): { total: number; smma: number; ecommerce: number; autre: number } {
  const row = db
    .prepare(`
      SELECT
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN category = 'smma' THEN 1 ELSE 0 END), 0) as smma,
        COALESCE(SUM(CASE WHEN category = 'ecommerce' THEN 1 ELSE 0 END), 0) as ecommerce,
        COALESCE(SUM(CASE WHEN category = 'autre' THEN 1 ELSE 0 END), 0) as autre
      FROM notes
    `)
    .get() as { total: number; smma: number; ecommerce: number; autre: number }
  return row
}
