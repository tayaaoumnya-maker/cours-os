import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protéger uniquement /facture
  if (pathname.startsWith("/facture")) {
    // Laisser passer l'API d'auth
    if (pathname.startsWith("/api/facture-auth")) {
      return NextResponse.next()
    }

    const token = req.cookies.get("facture_session")?.value

    if (!token) {
      // Pas de session → page de login (gérée côté client)
      // On laisse passer mais le composant affichera le PIN
      return NextResponse.next()
    }

    // Vérifier l'expiration du token
    try {
      const payload = JSON.parse(Buffer.from(token, "base64url").toString())
      if (payload.exp <= Date.now()) {
        // Session expirée → supprimer le cookie
        const response = NextResponse.next()
        response.cookies.delete("facture_session")
        return response
      }
    } catch {
      // Token invalide → supprimer
      const response = NextResponse.next()
      response.cookies.delete("facture_session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/facture/:path*"],
}
