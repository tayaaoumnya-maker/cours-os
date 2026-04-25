import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const SESSION_NAME = "facture_session"
const SESSION_DURATION = 30 * 60 // 30 minutes en secondes
const DEFAULT_PIN = process.env.FACTURE_PIN || "2026"

// Supabase server-side
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function getStoredPin(): Promise<string> {
  const sb = getSupabase()
  if (!sb) return DEFAULT_PIN
  try {
    const { data } = await sb.from("atm_store").select("value").eq("key", "facture_pin").single()
    if (data?.value) return String(data.value)
  } catch { /* fallback */ }
  return DEFAULT_PIN
}

async function setStoredPin(pin: string): Promise<boolean> {
  const sb = getSupabase()
  if (!sb) return false
  try {
    await sb.from("atm_store").upsert({ key: "facture_pin", value: pin, updated_at: new Date().toISOString() })
    return true
  } catch { return false }
}

function generateToken(): string {
  const payload = { ts: Date.now(), exp: Date.now() + SESSION_DURATION * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString())
    return payload.exp > Date.now()
  } catch { return false }
}

// POST — vérifier le PIN et créer la session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pin } = body

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ ok: false, error: "PIN requis" }, { status: 400 })
    }

    const storedPin = await getStoredPin()

    if (pin !== storedPin) {
      return NextResponse.json({ ok: false, error: "Code incorrect" }, { status: 401 })
    }

    const token = generateToken()
    const cookieStore = await cookies()

    cookieStore.set(SESSION_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION,
      path: "/facture",
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// GET — vérifier si la session est valide
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_NAME)?.value

    if (!token || !validateToken(token)) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// PUT — changer le PIN (nécessite d'être authentifié + ancien PIN)
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_NAME)?.value

    if (!token || !validateToken(token)) {
      return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 })
    }

    const { oldPin, newPin } = await req.json()

    if (!oldPin || !newPin || typeof newPin !== "string" || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return NextResponse.json({ ok: false, error: "Le nouveau PIN doit contenir 4 chiffres" }, { status: 400 })
    }

    const storedPin = await getStoredPin()
    if (oldPin !== storedPin) {
      return NextResponse.json({ ok: false, error: "Ancien PIN incorrect" }, { status: 401 })
    }

    const saved = await setStoredPin(newPin)
    if (!saved) {
      return NextResponse.json({ ok: false, error: "Erreur de sauvegarde" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE — déconnexion
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_NAME)
  return NextResponse.json({ ok: true })
}
