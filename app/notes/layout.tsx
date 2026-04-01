import { Suspense } from "react"
import Sidebar from "@/components/layout/Sidebar"

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Suspense fallback={<div className="w-56 shrink-0 bg-bg-surface border-r border-bg-border" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
