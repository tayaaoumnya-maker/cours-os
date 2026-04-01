export type Category = "smma" | "ecommerce" | "autre"

export interface Section {
  title: string
  bullets: string[]
}

export interface NoteStructured {
  subtitle?: string | null
  sections: Section[]
}

export interface Note {
  id: number
  title: string
  category: Category
  raw_text: string | null
  structured: string | null   // JSON stringifié de NoteStructured
  filename: string | null
  created_at: string
}

export interface NoteWithParsed extends Omit<Note, "structured"> {
  structured: NoteStructured | null
}

export interface CreateNoteInput {
  title: string
  category: Category
  raw_text: string
  structured: NoteStructured
  filename: string
}

export interface UpdateNoteInput {
  title?: string
  category?: Category
  structured?: NoteStructured
}
