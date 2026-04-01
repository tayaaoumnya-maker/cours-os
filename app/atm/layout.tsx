import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ATM — Application de vente",
  description: "Application de vente avec gestion de stock intégrée",
}

export default function ATMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
