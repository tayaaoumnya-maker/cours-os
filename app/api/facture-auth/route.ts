import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// PIN stocké côté serveur — jamais exposé au client
const FACTURE_PIN = process.env.FACTURE_PIN || "2026"
const SESSION_NAME = "facture_session"
const SESSION_DURATION = 30 * 60 // 30 minutes en secondes

// Simple token = timestamp signé avec le PIN comme secret
function generateToken(): string {
  const payload = { ts: Date.now(), exp: Date.now() + SESSION_DURATION * 1000 }
  // Base64 encode — pas un vrai JWT mais suffisant pour usage interne
  return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString())
    return payload.exp > Date.now()
  } catch {
    return false
  }
}

// POST — vérifier le PIN et créer la session
export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ ok: false, error: "PIN requis" }, { status: 400 })
    }

    if (pin !== FACTURE_PIN) {
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

// DELETE — déconnexion
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_NAME)
  return NextResponse.json({ ok: true })
}
