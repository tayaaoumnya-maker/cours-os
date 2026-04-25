"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { dbGetAll, dbSet } from "@/lib/supabase-atm"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Plus,
  FileText,
  Package,
  Menu,
  X,
  TrendingUp,
  Users,
  Receipt,
  ShoppingCart,
  Search,
  Copy,
  Trash2,
  Printer,
  Share2,
  Save,
  CheckCircle2,
  ChevronDown,
  Lock,
  ShieldCheck,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

type InvoiceStatus = "brouillon" | "envoyee" | "payee" | "en_retard"

interface ATMProduct {
  id: string
  name: string
  price: number
}

interface InvoiceRow {
  code: string
  designation: string
  qte: number | ""
  pu: number | ""
  tva: number
}

interface SavedInvoice {
  num: string
  date: string
  echeance: string
  client: string
  items: InvoiceRow[]
  totalHT: string
  totalTTC: string
  status: InvoiceStatus
}

type View = "dashboard" | "new" | "edit" | "invoices" | "products"

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMoney(val: number): string {
  return val.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"
}

function today(): string {
  return new Date().toISOString().split("T")[0]
}

function plus30(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split("T")[0]
}

function emptyRow(): InvoiceRow {
  return { code: "", designation: "", qte: "", pu: "", tva: 20 }
}

function genNum(count: number): string {
  const year = new Date().getFullYear()
  return `F-${year}-${(count + 1).toString().padStart(4, "0")}`
}

function parseTTC(val: string): number {
  return parseFloat(val.replace(/[^\d,]/g, "").replace(",", ".")) || 0
}

function formatDateFR(d: string): string {
  if (!d) return "—"
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  brouillon: { label: "Brouillon", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  envoyee: { label: "Envoyée", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  payee: { label: "Payée", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  en_retard: { label: "En retard", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
}

const STATUS_ORDER: InvoiceStatus[] = ["brouillon", "envoyee", "payee", "en_retard"]

function nextStatus(s: InvoiceStatus): InvoiceStatus {
  const i = STATUS_ORDER.indexOf(s)
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length]
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function FacturePage() {
  // ─── PIN Lock ────────────────────────────────────────────────────────────
  const PIN_CODE = "2026"
  const MAX_ATTEMPTS = 5
  const LOCKOUT_MS = 60_000
  const SESSION_KEY = "facture_session"

  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      const session = localStorage.getItem(SESSION_KEY)
      if (session) {
        const { ts } = JSON.parse(session)
        // Session valide 30 min
        if (Date.now() - ts < 30 * 60_000) return true
      }
    } catch { /* ignore */ }
    return false
  })
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)
  const [pinAttempts, setPinAttempts] = useState(0)
  const [pinLockUntil, setPinLockUntil] = useState(0)
  const [pinShake, setPinShake] = useState(false)

  function handlePinSubmit() {
    if (Date.now() < pinLockUntil) return
    if (pinInput === PIN_CODE) {
      setIsUnlocked(true)
      setPinInput("")
      setPinError(false)
      setPinAttempts(0)
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }))
    } else {
      setPinError(true)
      setPinShake(true)
      setTimeout(() => setPinShake(false), 500)
      setPinInput("")
      const next = pinAttempts + 1
      setPinAttempts(next)
      if (next >= MAX_ATTEMPTS) {
        setPinLockUntil(Date.now() + LOCKOUT_MS)
        setTimeout(() => { setPinAttempts(0); setPinLockUntil(0) }, LOCKOUT_MS)
      }
    }
  }

  function handlePinKey(digit: string) {
    if (Date.now() < pinLockUntil) return
    const next = pinInput + digit
    setPinError(false)
    if (next.length <= 4) {
      setPinInput(next)
      if (next.length === 4) {
        setTimeout(() => {
          if (next === PIN_CODE) {
            setIsUnlocked(true)
            setPinInput("")
            setPinError(false)
            setPinAttempts(0)
            localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }))
          } else {
            setPinError(true)
            setPinShake(true)
            setTimeout(() => setPinShake(false), 500)
            setPinInput("")
            const att = pinAttempts + 1
            setPinAttempts(att)
            if (att >= MAX_ATTEMPTS) {
              setPinLockUntil(Date.now() + LOCKOUT_MS)
              setTimeout(() => { setPinAttempts(0); setPinLockUntil(0) }, LOCKOUT_MS)
            }
          }
        }, 150)
      }
    }
  }

  // Navigation
  const [view, setView] = useState<View>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data
  const [products, setProducts] = useState<ATMProduct[]>([])
  const [invoices, setInvoices] = useState<SavedInvoice[]>([])
  const [loaded, setLoaded] = useState(false)

  // Invoice form state
  const [rows, setRows] = useState<InvoiceRow[]>(() => Array.from({ length: 6 }, emptyRow))
  const [client, setClient] = useState("")
  const [factureNum, setFactureNum] = useState("")
  const [factureDate, setFactureDate] = useState(today())
  const [echeance, setEcheance] = useState(plus30())
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [shareMsg, setShareMsg] = useState("")

  // Autocomplete
  const [acIndex, setAcIndex] = useState<number | null>(null)
  const [acFiltered, setAcFiltered] = useState<ATMProduct[]>([])
  const [acHighlight, setAcHighlight] = useState(-1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const acRef = useRef<any>(null)

  // Invoice list filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")

  // Product search
  const [productSearch, setProductSearch] = useState("")

  // ─── Load from Supabase + localStorage ──────────────────────────────────

  useEffect(() => {
    async function load() {
      const db = await dbGetAll()

      let prods: ATMProduct[] = []
      if (db && db.atm_products) {
        const raw = db.atm_products as Array<Record<string, unknown>>
        prods = raw.map(p => ({ id: String(p.id), name: String(p.name), price: Number(p.price) }))
      }
      setProducts(prods)

      let invs: SavedInvoice[] = []
      if (db && db.facture_invoices) {
        const raw = db.facture_invoices as SavedInvoice[]
        invs = raw.map(inv => ({ ...inv, status: inv.status || "brouillon" }))
      } else {
        try {
          const ls = localStorage.getItem("facture_invoices")
          if (ls) {
            const raw = JSON.parse(ls) as SavedInvoice[]
            invs = raw.map(inv => ({ ...inv, status: inv.status || "brouillon" }))
          }
        } catch { /* ignore */ }
      }
      setInvoices(invs)
      setFactureNum(genNum(invs.length))
      setLoaded(true)
    }
    load()
  }, [])

  // ─── Persist invoices ───────────────────────────────────────────────────

  const persistInvoices = useCallback(async (invs: SavedInvoice[]) => {
    localStorage.setItem("facture_invoices", JSON.stringify(invs))
    await dbSet("facture_invoices", invs)
  }, [])

  // ─── Calculations ─────────────────────────────────────────────────────

  const totals = (() => {
    let ht = 0, ttc = 0
    rows.forEach(r => {
      const q = Number(r.qte) || 0
      const p = Number(r.pu) || 0
      const t = Number(r.tva) || 0
      const lineHT = q * p
      ht += lineHT
      ttc += lineHT * (1 + t / 100)
    })
    return { ht, tva: ttc - ht, ttc }
  })()

  // ─── Row handlers ─────────────────────────────────────────────────────

  function updateRow(i: number, field: keyof InvoiceRow, value: string) {
    setRows(prev => {
      const next = [...prev]
      const row = { ...next[i] }
      if (field === "qte" || field === "pu") {
        row[field] = value === "" ? "" : Number(value)
      } else if (field === "tva") {
        row[field] = Number(value) || 0
      } else {
        row[field] = value
      }
      next[i] = row
      return next
    })
  }

  function addRow() { setRows(prev => [...prev, emptyRow()]) }
  function removeRow(i: number) { setRows(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev) }

  // ─── Autocomplete ─────────────────────────────────────────────────────

  function openAutocomplete(i: number) {
    setAcIndex(i)
    setAcFiltered(products)
    setAcHighlight(-1)
  }

  function filterAutocomplete(i: number, val: string) {
    updateRow(i, "designation", val)
    const q = val.toLowerCase()
    setAcFiltered(q ? products.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) : products)
    setAcHighlight(-1)
  }

  function selectProduct(i: number, p: ATMProduct) {
    setRows(prev => {
      const next = [...prev]
      next[i] = { ...next[i], code: p.id, designation: p.name, pu: p.price, qte: next[i].qte || 1 }
      return next
    })
    setAcIndex(null)
  }

  function handleAcKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown") { e.preventDefault(); setAcHighlight(prev => Math.min(prev + 1, acFiltered.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAcHighlight(prev => Math.max(prev - 1, 0)) }
    else if (e.key === "Enter" && acHighlight >= 0 && acFiltered[acHighlight]) { e.preventDefault(); selectProduct(i, acFiltered[acHighlight]) }
    else if (e.key === "Escape") { setAcIndex(null) }
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (acRef.current && !acRef.current.contains(e.target as Node)) setAcIndex(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ─── Save / Reset ─────────────────────────────────────────────────────

  function saveInvoice(status: InvoiceStatus = "brouillon") {
    if (!client.trim()) return
    const items = rows.filter(r => r.designation.trim())
    if (items.length === 0) return

    const inv: SavedInvoice = {
      num: factureNum,
      date: factureDate,
      echeance,
      client: client.trim(),
      items,
      totalHT: formatMoney(totals.ht),
      totalTTC: formatMoney(totals.ttc),
      status,
    }

    let next: SavedInvoice[]
    if (editingIndex !== null) {
      next = [...invoices]
      next[editingIndex] = inv
    } else {
      next = [...invoices, inv]
    }

    setInvoices(next)
    persistInvoices(next)
    resetForm(next.length)
    setView("invoices")
  }

  function resetForm(count?: number) {
    setClient("")
    setRows(Array.from({ length: 6 }, emptyRow))
    setFactureDate(today())
    setEcheance(plus30())
    setFactureNum(genNum(count ?? invoices.length))
    setEditingIndex(null)
  }

  function startNewInvoice() {
    resetForm()
    setView("new")
  }

  function editInvoice(idx: number) {
    const inv = invoices[idx]
    setClient(inv.client)
    setFactureNum(inv.num)
    setFactureDate(inv.date)
    setEcheance(inv.echeance)
    const loaded = inv.items.map(item => ({ ...item }))
    while (loaded.length < 6) loaded.push(emptyRow())
    setRows(loaded)
    setEditingIndex(idx)
    setView("edit")
  }

  function duplicateInvoice(idx: number) {
    const inv = invoices[idx]
    setClient(inv.client)
    setFactureNum(genNum(invoices.length))
    setFactureDate(today())
    setEcheance(plus30())
    const loaded = inv.items.map(item => ({ ...item }))
    while (loaded.length < 6) loaded.push(emptyRow())
    setRows(loaded)
    setEditingIndex(null)
    setView("new")
  }

  function deleteInvoice(idx: number) {
    const next = invoices.filter((_, i) => i !== idx)
    setInvoices(next)
    persistInvoices(next)
  }

  function toggleStatus(idx: number) {
    const next = [...invoices]
    next[idx] = { ...next[idx], status: nextStatus(next[idx].status) }
    setInvoices(next)
    persistInvoices(next)
  }

  // ─── Print ────────────────────────────────────────────────────────────

  function handlePrint() { window.print() }

  // ─── Share ────────────────────────────────────────────────────────────

  async function handleShare() {
    const items = rows.filter(r => r.designation.trim())
    const text = [
      `Facture ${factureNum}`,
      `Client: ${client || "—"}`,
      `Date: ${factureDate}`,
      "",
      ...items.map(r => `${r.designation} × ${r.qte} = ${formatMoney((Number(r.qte) || 0) * (Number(r.pu) || 0))}`),
      "",
      `Total HT: ${formatMoney(totals.ht)}`,
      `TVA: ${formatMoney(totals.tva)}`,
      `Total TTC: ${formatMoney(totals.ttc)}`,
    ].join("\n")

    if (navigator.share) {
      try { await navigator.share({ title: `Facture ${factureNum}`, text }); return } catch { /* fallback */ }
    }
    await navigator.clipboard.writeText(text)
    setShareMsg("Copié !")
    setTimeout(() => setShareMsg(""), 2000)
  }

  // ─── Line totals ─────────────────────────────────────────────────────

  function linePtHT(r: InvoiceRow): number { return (Number(r.qte) || 0) * (Number(r.pu) || 0) }
  function linePtTTC(r: InvoiceRow): number { return linePtHT(r) * (1 + (Number(r.tva) || 0) / 100) }

  // ─── Stats ──────────────────────────────────────────────────────────────

  const stats = (() => {
    const ca = invoices.reduce((sum, inv) => sum + parseTTC(inv.totalTTC), 0)
    const nbFactures = invoices.length
    const clientsSet = new Set(invoices.map(inv => inv.client.split("\n")[0]))
    const nbClients = clientsSet.size
    const panierMoyen = nbFactures > 0 ? ca / nbFactures : 0
    return { ca, nbFactures, nbClients, panierMoyen }
  })()

  // ─── Filtered invoices ──────────────────────────────────────────────────

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const clientName = inv.client.split("\n")[0].toLowerCase()
      return clientName.includes(q) || inv.num.toLowerCase().includes(q)
    }
    return true
  })

  // ─── Filtered products ─────────────────────────────────────────────────

  const filteredProducts = productSearch
    ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase()))
    : products

  // ─── Navigation helper ──────────────────────────────────────────────────

  function navigate(v: View) {
    setView(v)
    setSidebarOpen(false)
    if (v === "new") startNewInvoice()
  }

  // ─── Render ───────────────────────────────────────────────────────────

  // PIN Lock Screen
  if (!isUnlocked) {
    const isLocked = Date.now() < pinLockUntil
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className={cn("bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-700", pinShake && "animate-[shake_0.5s_ease-in-out]")}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock size={28} className="text-blue-400" />
            </div>
            <h1 className="text-white text-xl font-bold">ATM Facturation</h1>
            <p className="text-slate-400 text-sm mt-1">Entrez votre code PIN</p>
          </div>

          {/* PIN dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-200",
                  i < pinInput.length
                    ? pinError ? "bg-red-500 scale-110" : "bg-blue-500 scale-110"
                    : "bg-slate-600"
                )}
              />
            ))}
          </div>

          {/* Error message */}
          {pinError && (
            <p className="text-red-400 text-sm text-center mb-4">
              Code incorrect {pinAttempts > 1 && `(${MAX_ATTEMPTS - pinAttempts} essai(s) restant(s))`}
            </p>
          )}
          {isLocked && (
            <p className="text-red-400 text-sm text-center mb-4">
              Trop de tentatives. Réessayez dans 1 minute.
            </p>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map(key => (
              key === "" ? <div key="empty" /> : (
                <button
                  key={key}
                  disabled={isLocked}
                  onClick={() => {
                    if (key === "←") { setPinInput(prev => prev.slice(0, -1)); setPinError(false) }
                    else handlePinKey(key)
                  }}
                  className={cn(
                    "w-16 h-16 rounded-xl text-xl font-semibold transition-all",
                    isLocked
                      ? "bg-slate-700/50 text-slate-600 cursor-not-allowed"
                      : key === "←"
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600 active:scale-95"
                        : "bg-slate-700 text-white hover:bg-slate-600 active:scale-95 active:bg-blue-500"
                  )}
                >
                  {key}
                </button>
              )
            ))}
          </div>

          <p className="text-slate-500 text-xs text-center mt-6">
            <ShieldCheck size={12} className="inline mr-1" />
            Accès sécurisé — usage interne
          </p>
        </div>

        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
        `}</style>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Chargement...</span>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: "dashboard" as View, icon: LayoutDashboard, label: "Dashboard" },
    { id: "new" as View, icon: Plus, label: "Nouvelle facture" },
    { id: "invoices" as View, icon: FileText, label: "Factures" },
    { id: "products" as View, icon: Package, label: "Produits" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 print:bg-white print:p-0">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-slate-800 z-50 transition-all duration-300 print:hidden",
        "w-64 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-slate-900 font-black text-lg px-3 py-1.5 tracking-widest rounded">ATM</div>
            <div>
              <div className="text-white font-bold text-sm">Facturation</div>
              <div className="text-slate-400 text-xs">ATM Outillage</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 mt-2">
          {sidebarItems.map(item => {
            const active = view === item.id || (item.id === "new" && view === "edit")
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500">Total factures</div>
          <div className="text-lg font-bold text-white">{invoices.length}</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen print:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {view === "dashboard" && "Dashboard"}
              {view === "new" && "Nouvelle facture"}
              {view === "edit" && `Édition — ${factureNum}`}
              {view === "invoices" && "Factures"}
              {view === "products" && "Produits"}
            </h1>
          </div>
          {(view === "dashboard" || view === "invoices") && (
            <button
              onClick={() => navigate("new")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nouvelle facture</span>
            </button>
          )}
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* ═══ DASHBOARD ═══ */}
          {view === "dashboard" && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Chiffre d'affaires", value: formatMoney(stats.ca), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Factures", value: String(stats.nbFactures), icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Clients", value: String(stats.nbClients), icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Panier moyen", value: formatMoney(stats.panierMoyen), icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</span>
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.bg)}>
                        <card.icon size={18} className={card.color} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent invoices */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Factures récentes</h2>
                  {invoices.length > 5 && (
                    <button onClick={() => setView("invoices")} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                      Voir tout
                    </button>
                  )}
                </div>
                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Receipt size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Aucune facture créée</p>
                    <button onClick={() => navigate("new")} className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium">
                      Créer ma première facture
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                          <th className="px-5 py-3 font-medium">N°</th>
                          <th className="px-5 py-3 font-medium">Client</th>
                          <th className="px-5 py-3 font-medium hidden sm:table-cell">Date</th>
                          <th className="px-5 py-3 font-medium text-right">Total TTC</th>
                          <th className="px-5 py-3 font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...invoices].reverse().slice(0, 5).map((inv, i) => {
                          const realIdx = invoices.length - 1 - i
                          const cfg = STATUS_CONFIG[inv.status]
                          return (
                            <tr
                              key={realIdx}
                              className="border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                              onClick={() => editInvoice(realIdx)}
                            >
                              <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{inv.num}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-700">{inv.client.split("\n")[0]}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell">{formatDateFR(inv.date)}</td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">{inv.totalTTC}</td>
                              <td className="px-5 py-3.5">
                                <button
                                  onClick={e => { e.stopPropagation(); toggleStatus(realIdx) }}
                                  className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors", cfg.bg, cfg.text)}
                                >
                                  <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                                  {cfg.label}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ INVOICES LIST ═══ */}
          {view === "invoices" && (
            <div className="space-y-4">
              {/* Search + filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par client ou n° facture..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
                        statusFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      Tous ({invoices.length})
                    </button>
                    {STATUS_ORDER.map(s => {
                      const count = invoices.filter(inv => inv.status === s).length
                      const cfg = STATUS_CONFIG[s]
                      return (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
                            statusFilter === s ? cn(cfg.bg, cfg.text, "border-current") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          {cfg.label} ({count})
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-200">
                {filteredInvoices.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Aucune facture trouvée</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-5 py-3 font-medium">N°</th>
                          <th className="px-5 py-3 font-medium">Client</th>
                          <th className="px-5 py-3 font-medium hidden sm:table-cell">Date</th>
                          <th className="px-5 py-3 font-medium hidden md:table-cell">Échéance</th>
                          <th className="px-5 py-3 font-medium text-right">Total TTC</th>
                          <th className="px-5 py-3 font-medium">Statut</th>
                          <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...filteredInvoices].reverse().map(inv => {
                          const realIdx = invoices.indexOf(inv)
                          const cfg = STATUS_CONFIG[inv.status]
                          return (
                            <tr
                              key={realIdx}
                              className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-5 py-3.5 text-sm font-medium text-gray-900 cursor-pointer" onClick={() => editInvoice(realIdx)}>{inv.num}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-700 cursor-pointer" onClick={() => editInvoice(realIdx)}>{inv.client.split("\n")[0]}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell">{formatDateFR(inv.date)}</td>
                              <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">{formatDateFR(inv.echeance)}</td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">{inv.totalTTC}</td>
                              <td className="px-5 py-3.5">
                                <button
                                  onClick={() => toggleStatus(realIdx)}
                                  className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors", cfg.bg, cfg.text)}
                                >
                                  <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                                  {cfg.label}
                                  <ChevronDown size={12} />
                                </button>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => duplicateInvoice(realIdx)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Dupliquer">
                                    <Copy size={15} />
                                  </button>
                                  <button onClick={() => deleteInvoice(realIdx)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500" title="Supprimer">
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ PRODUCTS ═══ */}
          {view === "products" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Base Produits ATM</h2>
                  <span className="text-xs text-gray-400">{products.length} produit(s)</span>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Aucun produit trouvé</p>
                    <p className="text-xs mt-1">Gérez vos produits dans l&apos;app ATM</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-mono text-gray-500">
                            {p.id.slice(0, 3)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-400">{p.id}</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{formatMoney(p.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                  Gérez vos produits depuis l&apos;app ATM
                </div>
              </div>
            </div>
          )}

          {/* ═══ NEW / EDIT INVOICE ═══ */}
          {(view === "new" || view === "edit") && (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-2 print:hidden">
                <button onClick={() => saveInvoice("brouillon")} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors">
                  <Save size={16} />
                  Brouillon
                </button>
                <button onClick={() => saveInvoice("envoyee")} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-colors">
                  <CheckCircle2 size={16} />
                  Finaliser
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-colors">
                  <Printer size={16} />
                  Imprimer
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-sm transition-colors relative">
                  <Share2 size={16} />
                  Partager
                  {shareMsg && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">{shareMsg}</span>}
                </button>
                <button onClick={addRow} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg text-sm transition-colors ml-auto">
                  <Plus size={16} />
                  Ligne
                </button>
              </div>

              {/* Invoice document */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10 print:border-none print:shadow-none print:p-5 print:rounded-none">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div className="w-40">
                    <div className="bg-gray-900 text-amber-500 font-black text-3xl text-center py-3 px-5 tracking-widest rounded-t">ATM</div>
                    <div className="bg-gray-900 text-white text-[11px] text-center pb-2 px-5 tracking-[4px] rounded-b">OUTILLAGE</div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg p-3 w-full sm:w-72">
                    <label className="block text-[11px] text-gray-400 uppercase mb-1">Client</label>
                    <textarea
                      value={client}
                      onChange={e => setClient(e.target.value)}
                      placeholder={"Nom / Société\nAdresse\nCode postal, Ville"}
                      className="w-full border-none text-sm text-gray-900 outline-none resize-none bg-transparent h-16"
                    />
                  </div>
                </div>

                {/* Invoice info */}
                <div className="grid grid-cols-3 border-2 border-blue-500 rounded-lg overflow-hidden mb-5">
                  {["Facture", "Date", "Échéance"].map(h => (
                    <div key={h} className="bg-blue-500 text-white font-bold text-xs text-center py-2.5 uppercase tracking-wide">{h}</div>
                  ))}
                  <div className="p-2 text-center">
                    <input
                      value={factureNum}
                      onChange={e => setFactureNum(e.target.value)}
                      className="w-full border-none text-center text-sm text-gray-900 outline-none bg-transparent"
                      placeholder="F-2026-0001"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <input type="date" value={factureDate} onChange={e => setFactureDate(e.target.value)} className="w-full border-none text-center text-sm text-gray-900 outline-none bg-transparent" />
                  </div>
                  <div className="p-2 text-center">
                    <input type="date" value={echeance} onChange={e => setEcheance(e.target.value)} className="w-full border-none text-center text-sm text-gray-900 outline-none bg-transparent" />
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {[
                          { label: "Code", w: "w-[12%]" },
                          { label: "Désignation", w: "w-[30%]" },
                          { label: "Qté", w: "w-[8%]" },
                          { label: "PU HT", w: "w-[14%]" },
                          { label: "TVA %", w: "w-[10%]" },
                          { label: "PT HT", w: "w-[13%]" },
                          { label: "PT TTC", w: "w-[13%]" },
                        ].map(col => (
                          <th key={col.label} className={cn(col.w, "bg-blue-500 text-white py-2.5 px-2 text-[11px] uppercase tracking-wide font-bold")}>
                            {col.label}
                          </th>
                        ))}
                        <th className="w-8 bg-blue-500 print:hidden" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="border border-gray-200 px-2 py-1.5">
                            <input value={row.code} onChange={e => updateRow(i, "code", e.target.value)} className="w-full border-none bg-transparent text-[13px] text-gray-900 outline-none" placeholder="STM..." />
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5 relative" ref={acIndex === i ? acRef : undefined}>
                            <input
                              value={row.designation}
                              onChange={e => filterAutocomplete(i, e.target.value)}
                              onFocus={() => openAutocomplete(i)}
                              onKeyDown={e => handleAcKey(e, i)}
                              className="w-full border-none bg-transparent text-[13px] text-gray-900 outline-none"
                              placeholder="Désignation"
                            />
                            {acIndex === i && acFiltered.length > 0 && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {acFiltered.map((p, j) => (
                                  <div
                                    key={p.id}
                                    onClick={() => selectProduct(i, p)}
                                    className={cn("px-3 py-2 cursor-pointer text-sm flex justify-between", j === acHighlight ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50")}
                                  >
                                    <span className="truncate">{p.name}</span>
                                    <span className="text-gray-400 ml-2 shrink-0">{formatMoney(p.price)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5">
                            <input type="number" min={0} step={1} value={row.qte} onChange={e => updateRow(i, "qte", e.target.value)} className="w-full border-none bg-transparent text-[13px] text-gray-900 outline-none text-center" />
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5">
                            <input type="number" min={0} step={0.01} value={row.pu} onChange={e => updateRow(i, "pu", e.target.value)} className="w-full border-none bg-transparent text-[13px] text-gray-900 outline-none text-right" />
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5">
                            <input type="number" min={0} step={1} value={row.tva} onChange={e => updateRow(i, "tva", e.target.value)} className="w-full border-none bg-transparent text-[13px] text-gray-900 outline-none text-center" />
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5 text-right text-[13px] font-semibold text-blue-600">
                            {linePtHT(row) > 0 ? formatMoney(linePtHT(row)) : ""}
                          </td>
                          <td className="border border-gray-200 px-2 py-1.5 text-right text-[13px] font-semibold text-blue-600">
                            {linePtTTC(row) > 0 ? formatMoney(linePtTTC(row)) : ""}
                          </td>
                          <td className="border border-gray-200 px-1 text-center print:hidden">
                            <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 text-lg leading-none" title="Supprimer">×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden space-y-3 mb-6">
                  {rows.map((row, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white relative">
                      <button onClick={() => removeRow(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg print:hidden">×</button>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase">Code</label>
                          <input value={row.code} onChange={e => updateRow(i, "code", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none" placeholder="STM..." />
                        </div>
                        <div className="col-span-2 relative" ref={acIndex === i ? acRef : undefined}>
                          <label className="text-[10px] text-gray-400 uppercase">Désignation</label>
                          <input
                            value={row.designation}
                            onChange={e => filterAutocomplete(i, e.target.value)}
                            onFocus={() => openAutocomplete(i)}
                            onKeyDown={e => handleAcKey(e, i)}
                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none"
                            placeholder="Désignation"
                          />
                          {acIndex === i && acFiltered.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b shadow-lg z-50 max-h-48 overflow-y-auto">
                              {acFiltered.map((p, j) => (
                                <div
                                  key={p.id}
                                  onClick={() => selectProduct(i, p)}
                                  className={cn("px-3 py-2 cursor-pointer text-sm flex justify-between", j === acHighlight ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50")}
                                >
                                  <span className="truncate">{p.name}</span>
                                  <span className="text-gray-400 ml-2 shrink-0">{formatMoney(p.price)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase">Qté</label>
                          <input type="number" min={0} value={row.qte} onChange={e => updateRow(i, "qte", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase">PU HT</label>
                          <input type="number" min={0} step={0.01} value={row.pu} onChange={e => updateRow(i, "pu", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase">TVA %</label>
                          <input type="number" min={0} value={row.tva} onChange={e => updateRow(i, "tva", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none text-center" />
                        </div>
                        <div className="text-right">
                          <label className="text-[10px] text-gray-400 uppercase">PT TTC</label>
                          <div className="text-sm font-bold text-blue-600 py-1.5">
                            {linePtTTC(row) > 0 ? formatMoney(linePtTTC(row)) : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addRow} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 text-sm print:hidden">
                    + Ajouter ligne
                  </button>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-10">
                  <div className="border-2 border-blue-500 rounded-lg overflow-hidden min-w-[280px] sm:min-w-[300px]">
                    <div className="flex border-b border-gray-100">
                      <div className="flex-1 px-4 py-2.5 font-bold text-[13px] bg-blue-50 text-blue-700 uppercase">Prix HT</div>
                      <div className="flex-1 px-4 py-2.5 text-right text-sm font-semibold text-gray-900">{formatMoney(totals.ht)}</div>
                    </div>
                    <div className="flex border-b border-gray-100">
                      <div className="flex-1 px-4 py-2.5 font-bold text-[13px] bg-blue-50 text-blue-700 uppercase">TVA 20%</div>
                      <div className="flex-1 px-4 py-2.5 text-right text-sm font-semibold text-gray-900">{formatMoney(totals.tva)}</div>
                    </div>
                    <div className="flex bg-blue-500">
                      <div className="flex-1 px-4 py-2.5 font-bold text-sm text-white uppercase">Prix TTC</div>
                      <div className="flex-1 px-4 py-2.5 text-right text-base font-extrabold text-white">{formatMoney(totals.ttc)}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-2 border-blue-500 pt-4 text-[11px] text-gray-500 leading-relaxed">
                  <strong className="text-gray-900">ATM OUTILLAGE</strong> — 78 Avenue des Champs-Élysées 75008 PARIS<br />
                  SAS au capital 10 000 euros — Siret : 983 431 487 RCS : Paris<br />
                  N° TVA Intercom. : FR91 983 431 487 — IBAN : FR76 3000 4201 2760 184<br />
                  Domiciliation SG Paris Clément Marot
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          aside, header, .print\\:hidden { display: none !important; }
          main { margin-left: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
