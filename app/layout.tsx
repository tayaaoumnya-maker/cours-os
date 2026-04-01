import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cours OS",
  description: "Dashboard personnel — notes de cours SMMA & E-commerce",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
