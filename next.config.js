/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Empêche le clickjacking (l'app ne peut pas être intégrée dans une iframe tierce)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Empêche le MIME-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limite les infos envoyées dans le Referer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les fonctionnalités sensibles du navigateur non utilisées
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Force HTTPS pendant 1 an (actif uniquement en production)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Content Security Policy : sources autorisées
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // unsafe-eval requis par React/Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: http:",   // images depuis HTTPS/HTTP (logos produits)
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
]

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "pdf-parse"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
