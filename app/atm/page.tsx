"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { dbGetAll, dbSet } from "@/lib/supabase-atm"

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = string
type PaymentMethod = "espèces" | "carte" | "virement" | "chèque"
type DiscountType = "percent" | "fixed"

interface Product {
  id: string
  name: string
  category: Category
  price: number
  stock: number
  unit: string
  emoji: string
  alertThreshold: number
  image?: string
  description: string
  variablePrice?: boolean
  taxId?: string       // référence à Tax.id — prix considéré TTC
  promoPercent?: number // % de remise (ex: 10 = -10%), prix barré + badge PROMO
  purchasePrice?: number // prix d'achat HT (coût fournisseur)
  supplierId?: string  // référence à Supplier.id
}

interface Supplier {
  id: string
  name: string
  phone?: string
  email?: string
  notes?: string
}

interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  notes?: string
  createdAt: Date
}

interface OrderItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

type OrderStatus = "en cours" | "prêt" | "livré" | "annulé" | "remboursé"

interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  discountType: DiscountType
  discountValue: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: Date
  table?: string
  comment?: string
  isRefund?: boolean
  refundReason?: string
  refundOf?: string
  isTestMode?: boolean
  cashGiven?: number   // montant remis en espèces (pour rendu monnaie)
  clientId?: string    // lien vers Client.id
  orderedBy?: string   // nom de l'utilisateur qui a validé la commande
}

interface PendingOrder {
  id: string
  items: Record<string, number>
  cartPrices: Record<string, number>
  subtotal: number
  discountType: DiscountType
  discountValue: number
  tableInput: string
  comment: string
  savedAt: Date
}

interface Tax {
  id: string
  name: string
  rate: number
}

interface FormulaItem {
  productId: string
  qty: number
}

interface Formula {
  id: string
  name: string
  emoji: string
  items: FormulaItem[]
  customPrice?: number  // si vide → somme des composants
  description?: string
}

type View = "vendre" | "activite" | "catalogue" | "stock" | "parametres" | "vitrine" | "clients" | "notes"

interface InternalNote {
  id: string
  text: string
  author: string
  createdAt: Date
  pinned?: boolean
}
type UserRole = "Administrateur" | "Partenaire"

// ─── Security helpers ──────────────────────────────────────────────────────────

/** Échappe les caractères HTML pour prévenir les injections XSS */
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/** Hash SHA-256 d'un PIN via Web Crypto API (asynchrone) */
async function hashPin(pin: string): Promise<string> {
  if (!pin) return ""
  const data = new TextEncoder().encode("atm-pin-v1-" + pin)
  const buf = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}

/** Valide qu'une URL est sûre (http/https ou data:image/ uniquement — bloque javascript:, etc.) */
function isSafeUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith("data:image/")) return true
  try {
    const u = new URL(url)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch { return false }
}

// ─── LocalStorage helpers ──────────────────────────────────────────────────────

const LS = {
  get: <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback
    try {
      const v = localStorage.getItem(key)
      if (v === null) return fallback
      return JSON.parse(v) as T
    } catch { return fallback }
  },
  set: (key: string, value: unknown) => {
    if (typeof window === "undefined") return
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
  },
}

// ─── Données initiales ────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1",  name: "Perceuse-visseuse 18V",           category: "Électroportatif",  price: 89.90, stock: 12, unit: "pièce",   emoji: "🔧", alertThreshold: 3,  image: "https://images.unsplash.com/photo-1645651964715-d200ce0939cc?w=400&h=300&fit=crop&q=80", description: "Perceuse-visseuse sans fil 18V Li-Ion — couple max 55 Nm, 2 vitesses, mandrin auto-serrant 13 mm. Perçage bois jusqu'à 35 mm, métal jusqu'à 13 mm. Livré sans batterie ni chargeur." },
  { id: "p2",  name: "Meuleuse d'angle 125mm",          category: "Électroportatif",  price: 59.90, stock: 8,  unit: "pièce",   emoji: "⚙️", alertThreshold: 2,  image: "https://images.unsplash.com/photo-1674117068854-9dcc8a16dba2?w=400&h=300&fit=crop&q=80", description: "Meuleuse d'angle 900 W, disque Ø125 mm, vitesse 11 000 tr/min, protection anti-rebond électronique. Découpe et meulage acier, inox, pierre et carrelage. Livré sans disque." },
  { id: "p3",  name: "Visseuse à chocs 18V",            category: "Électroportatif",  price: 74.50, stock: 6,  unit: "pièce",   emoji: "🔩", alertThreshold: 2,  image: "https://images.unsplash.com/photo-1761252987156-8518404632cd?w=400&h=300&fit=crop&q=80", description: "Visseuse à chocs 18V — couple max 165 Nm, 0 à 3 200 tr/min, 3 modes de frappe, embout 1/4\" hex. Idéale pour vissage intensif, boulonnage charpente et assemblages métalliques." },
  { id: "p4",  name: "Scie sauteuse 700W",              category: "Électroportatif",  price: 69.00, stock: 4,  unit: "pièce",   emoji: "🪚", alertThreshold: 2,  image: "https://images.unsplash.com/photo-1615746363486-92cd8c5e0a90?w=400&h=300&fit=crop&q=80", description: "Scie sauteuse filaire 700 W — course 26 mm, 500 à 3 100 cpm, coupe biseautée jusqu'à 45°. Découpe bois jusqu'à 80 mm, acier jusqu'à 8 mm, aluminium jusqu'à 15 mm." },
  { id: "p5",  name: "Marteau de charpentier",          category: "Outillage à main", price: 18.50, stock: 25, unit: "pièce",   emoji: "🔨", alertThreshold: 5,  image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop&q=80", description: "Marteau de charpentier 560 g — manche bi-matière antivibrations, tête acier forgé trempé, coupe-fil intégré. Enfoncement clous, arrachage et travaux de charpente courants." },
  { id: "p6",  name: "Clé à molette 250mm",             category: "Outillage à main", price: 12.90, stock: 20, unit: "pièce",   emoji: "🔧", alertThreshold: 5,  image: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=400&h=300&fit=crop&q=80", description: "Clé à molette 250 mm — ouverture max 30 mm, mâchoires chromées-vanadium, graduation millimétrique au dos. Polyvalente sur tous types d'écrous et boulons standard." },
  { id: "p7",  name: "Niveau à bulle 60cm",             category: "Outillage à main", price: 14.00, stock: 3,  unit: "pièce",   emoji: "📏", alertThreshold: 4,  image: "https://images.unsplash.com/photo-1772401750471-9d501a3a1da6?w=400&h=300&fit=crop&q=80", description: "Niveau à bulle aluminium 60 cm — 3 ampoules (horizontal, vertical, 45°), précision ±0,5 mm/m, bords magnétiques. Pour pose de menuiseries, caissons et carrelages." },
  { id: "p8",  name: "Tournevis plat 6mm",              category: "Outillage à main", price: 5.50,  stock: 30, unit: "pièce",   emoji: "🪛", alertThreshold: 8,  image: "https://images.unsplash.com/photo-1668854191413-a2f8f448e6b6?w=400&h=300&fit=crop&q=80", description: "Tournevis plat 6×100 mm — pointe acier chrome-vanadium trempé, manche bi-matière ergonomique. Usage général en électricité, menuiserie et bricolage courant." },
  { id: "p9",  name: "Tournevis cruciforme PZ2",        category: "Outillage à main", price: 5.50,  stock: 28, unit: "pièce",   emoji: "🪛", alertThreshold: 8,  image: "https://images.unsplash.com/photo-1668854191413-a2f8f448e6b6?w=400&h=300&fit=crop&q=80", description: "Tournevis cruciforme PZ2×100 mm — pointe Pozidrive trempée anti-usure, manche soft-grip antidérapant. PZ2 est le standard du bâtiment, compatible 90 % des vis chantier." },
  { id: "p10", name: "Chevilles + vis 6×40 (50 pcs)",  category: "Fixation",         price: 4.90,  stock: 60, unit: "boîte",   emoji: "📦", alertThreshold: 15, image: "https://images.unsplash.com/photo-1609745403093-a9e285560999?w=400&h=300&fit=crop&q=80", description: "Boîte de 50 chevilles nylon Ø6 mm + 50 vis tête fraisée Ø4×40 mm zinguées. Fixation dans béton, brique et parpaing — charge max 25 kg selon support." },
  { id: "p11", name: "Vis tête fraisée 4×40 (100 pcs)", category: "Fixation",        price: 3.50,  stock: 45, unit: "boîte",   emoji: "📦", alertThreshold: 10, image: "https://images.unsplash.com/photo-1713705321079-8be45ed1d5c0?w=400&h=300&fit=crop&q=80", description: "Boîte de 100 vis acier zingué tête fraisée Torx T20, filetage partiel Ø4×40 mm. Assemblage bois massif et panneaux dérivés (contreplaqué, OSB, aggloméré)." },
  { id: "p12", name: "Boulons M8×60 (25 pcs)",         category: "Fixation",         price: 6.20,  stock: 0,  unit: "boîte",   emoji: "📦", alertThreshold: 8,  image: "https://images.unsplash.com/photo-1441796522229-b3a3cb3d58fd?w=400&h=300&fit=crop&q=80", description: "Boîte de 25 boulons hexagonaux M8×60 mm classe 8.8 — écrous et rondelles inclus. Assemblage structures métalliques, charpentes bois et fixations lourdes." },
  { id: "p13", name: "Disques meuleuse Ø125 (5 pcs)",  category: "Consommables",     price: 8.90,  stock: 5,  unit: "lot",     emoji: "💿", alertThreshold: 5,  image: "https://images.unsplash.com/photo-1729005938013-b4d3e24053cf?w=400&h=300&fit=crop&q=80", description: "Lot de 5 disques à tronçonner métal Ø125×1 mm, alésage 22,23 mm. Découpe acier, inox et profilés métalliques. Compatibles toutes meuleuses d'angle 125 mm." },
  { id: "p14", name: "Forets béton Ø6 (5 pcs)",        category: "Consommables",     price: 7.50,  stock: 18, unit: "lot",     emoji: "🔩", alertThreshold: 5,  image: "https://images.unsplash.com/photo-1687920810115-921c06661914?w=400&h=300&fit=crop&q=80", description: "Lot de 5 forets béton Ø6×110 mm — pointe carbure brasée, double spirale d'évacuation. Perçage béton, brique et pierre avec marteau perforateur. Queue cylindrique 6 mm." },
  { id: "p15", name: "Ruban adhésif toile 50m",        category: "Consommables",     price: 6.00,  stock: 22, unit: "rouleau", emoji: "🟫", alertThreshold: 6,  image: "https://images.unsplash.com/photo-1665750373596-f5008ce81951?w=400&h=300&fit=crop&q=80", description: "Ruban toile polyéthylène 50 m × 50 mm — résistant à la déchirure, imperméable, adhésif acrylique haute tenue. Réparations provisoires, protection et repérage chantier." },
  { id: "p16", name: "Papier abrasif G80 (10 feuilles)", category: "Consommables",   price: 3.20,  stock: 2,  unit: "lot",     emoji: "🟧", alertThreshold: 5,  image: "https://images.unsplash.com/photo-1534593963832-01c3595183bd?w=400&h=300&fit=crop&q=80", description: "Lot de 10 feuilles abrasives corindon grain 80, format 230×280 mm. Ponçage bois brut, enduit et surfaces métalliques. Idéal avant application d'un primaire ou finition." },
]

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "espèces",  label: "Espèces",  icon: "💵" },
  { id: "carte",    label: "Carte",    icon: "💳" },
  { id: "chèque",   label: "Chèque",   icon: "🖊️" },
  { id: "virement", label: "Virement", icon: "🏦" },
]

const PAYMENT_COLOR: Record<PaymentMethod, string> = {
  espèces:  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  carte:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  chèque:   "bg-green-500/20 text-green-400 border-green-500/30",
  virement: "bg-violet-500/20 text-violet-400 border-violet-500/30",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return `CMD-${Date.now().toString(36).toUpperCase()}`
}

function _fp(n: number, cur = "€") {
  return n.toFixed(2).replace(".", ",") + " " + cur
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

function exportCSV(filename: string, headers: string[], rows: (string | number)[]) {
  const escape = (v: string | number) => {
    const s = String(v).replace(/"/g, '""')
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s
  }
  const csv = [headers, ...rows.map(r => (r as unknown as (string | number)[]))]
    .map(row => (Array.isArray(row) ? row : [row]).map(escape).join(","))
    .join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  "en cours":  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "prêt":      "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "livré":     "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "annulé":    "bg-red-500/20 text-red-400 border-red-500/30",
  "remboursé": "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  "en cours": "prêt",
  "prêt":     "livré",
}

const DEFAULT_CATEGORIES: string[] = ["Électroportatif", "Outillage à main", "Fixation", "Consommables"]

// ─── Composants UI de base ────────────────────────────────────────────────────

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

// ─── Composant formulaire catalogue ──────────────────────────────────────────

function CatForm({ products, setProducts, editProduct, onClose, taxes, suppliers, categories }: {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  editProduct?: Product | null
  onClose: () => void
  taxes: Tax[]
  suppliers: Supplier[]
  categories: string[]
}) {
  const cats = categories
  const [name, setName]         = useState(editProduct?.name ?? "")
  const [category, setCategory] = useState<Category>(editProduct?.category ?? categories[0] ?? "Divers")
  const [price, setPrice]       = useState(editProduct?.price?.toString() ?? "")
  const [stock, setStock]       = useState(editProduct?.stock?.toString() ?? "")
  const [unit, setUnit]         = useState(editProduct?.unit ?? "pièce")
  const [alertThreshold, setAlertThreshold] = useState(editProduct?.alertThreshold?.toString() ?? "3")
  const [image, setImage]             = useState(editProduct?.image ?? "")
  const [description, setDescription] = useState(editProduct?.description ?? "")
  const [variablePrice, setVariablePrice] = useState(editProduct?.variablePrice ?? false)
  const [taxId, setTaxId]             = useState(editProduct?.taxId ?? "")
  const [promoPercent, setPromoPercent] = useState(editProduct?.promoPercent?.toString() ?? "")
  const [purchasePrice, setPurchasePrice] = useState(editProduct?.purchasePrice?.toString() ?? "")
  const [supplierId, setSupplierId]       = useState(editProduct?.supplierId ?? "")

  function handleSubmit() {
    if (!name.trim() || (!price && !variablePrice)) return
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? {
        ...p, name: name.trim(), category, price: parseFloat(price) || 0, stock: parseInt(stock) || 0,
        unit: unit.trim() || "pièce", alertThreshold: parseInt(alertThreshold) || 3,
        image: image.trim() || undefined, description: description.trim(), variablePrice,
        taxId: taxId || undefined,
        promoPercent: promoPercent ? parseFloat(promoPercent) : undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        supplierId: supplierId || undefined,
      } : p))
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`, name: name.trim(), category, price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0, unit: unit.trim() || "pièce", emoji: "🔧",
        alertThreshold: parseInt(alertThreshold) || 3,
        image: image.trim() || undefined, description: description.trim(), variablePrice,
        taxId: taxId || undefined,
        promoPercent: promoPercent ? parseFloat(promoPercent) : undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        supplierId: supplierId || undefined,
      }
      setProducts(prev => [...prev, newProduct])
    }
    onClose()
  }

  const [showPA, setShowPA] = useState(!!editProduct?.purchasePrice)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { if (ev.target?.result) setImage(ev.target.result as string) }
    reader.readAsDataURL(file)
  }

  // Champ select stylisé en rangée avec flèche (comme dans l'image)
  function SelectRow({ label, value, onChange, options, placeholder }: {
    label: string; value: string; onChange: (v: string) => void
    options: { value: string; label: string }[]; placeholder?: string
  }) {
    const selected = options.find(o => o.value === value)
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-white">{label}</label>
        <div className="relative">
          <select value={value} onChange={e => onChange(e.target.value)}
            className="w-full appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
            style={{ color: selected ? "white" : "rgba(255,255,255,0.3)" }}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value} style={{background:"#0e0e18",color:"white"}}>{o.label}</option>)}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-lg">›</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{height:"100%",minHeight:0}}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.06] text-white/50 hover:text-white transition-all">✕</button>
        <h2 className="text-sm font-bold">{editProduct ? "Modifier l'article" : "Nouvel article"}</h2>
        <button onClick={handleSubmit} className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors px-2">OK</button>
      </div>

      {/* Corps scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6" style={{minHeight:0}}>

        {/* Zone photo — cercle avec import fichier */}
        <div className="flex flex-col items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          <button onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center gap-2 group">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-500/50">
              {image
                ? <img src={image} alt="" className="w-full h-full object-cover" />
                : <span className="text-xl text-amber-400/60">📷</span>
              }
            </div>
            <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">Importer une photo</span>
          </button>
        </div>

        {/* Titre */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-white">Titre</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Titre de l'article"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
        </div>

        {/* Prix HT */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white">Prix HT (€)</label>
          <input type="number" min={0} step={0.01} value={price} onChange={e => setPrice(e.target.value)} placeholder="0,00"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={variablePrice} onChange={e => setVariablePrice(e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
            <span className="text-xs text-white/40">Prix variable (saisie à chaque vente)</span>
          </label>
        </div>

        {/* Unité */}
        <SelectRow label="Unité" value={unit} onChange={v => setUnit(v)}
          options={["Par article","pièce","lot","boîte","kg","m","m²","litre","rouleau"].map(u => ({ value: u, label: u }))}
        />

        {/* Catégorie */}
        <SelectRow label="Catégorie" value={category} onChange={v => setCategory(v as Category)}
          placeholder="Ajouter une catégorie"
          options={cats.map(c => ({ value: c, label: c }))}
        />

        {/* Taxe */}
        <SelectRow label="Taxe" value={taxId} onChange={v => setTaxId(v)}
          placeholder="Ajouter une taxe"
          options={taxes.map(t => ({ value: t.id, label: `${t.name} (${t.rate}%)` }))}
        />

        {/* Gestion de stock */}
        <div className="space-y-4 pt-1">
          <p className="text-base font-black text-white">Gestion de stock</p>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">Stock initial</label>
            <input type="number" min={0} value={stock} onChange={e => setStock(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">Seuil d&apos;alerte</label>
            <input type="number" min={0} value={alertThreshold} onChange={e => setAlertThreshold(e.target.value)} placeholder="3"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>
        </div>

        {/* Infos supplémentaires */}
        <div className="space-y-4 pt-1">
          <p className="text-base font-black text-white">Informations supplémentaires</p>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Caractéristiques techniques..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white">Remise produit (%)</label>
            <div className="flex gap-3 items-center">
              <input type="number" min={0} max={99} value={promoPercent} onChange={e => setPromoPercent(e.target.value)} placeholder="0"
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
              <span className="text-white/40 font-bold">%</span>
            </div>
            {promoPercent && price && <p className="text-xs text-cyan-400 pl-1">Prix promo : {(parseFloat(price) * (1 - parseFloat(promoPercent)/100)).toFixed(2)} €</p>}
          </div>
          <SelectRow label="Fournisseur" value={supplierId} onChange={v => setSupplierId(v)}
            placeholder="— Aucun fournisseur —"
            options={suppliers.map(s => ({ value: s.id, label: s.name + (s.phone ? ` · ${s.phone}` : "") }))}
          />
        </div>

      </div>
    </div>
  )
}

// ─── Modal Formule ────────────────────────────────────────────────────────────

function FormulaModalContent({ initial, isNew, products, formatPrice, onSave, onClose }: {
  initial: Formula
  isNew: boolean
  products: Product[]
  formatPrice: (n: number) => string
  onSave: (f: Formula) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initial.name)
  const [emoji, setEmoji] = useState(initial.emoji)
  const [description, setDescription] = useState(initial.description ?? "")
  const [items, setItems] = useState<FormulaItem[]>(initial.items)
  const [useCustomPrice, setUseCustomPrice] = useState(initial.customPrice !== undefined)
  const [customPriceVal, setCustomPriceVal] = useState(initial.customPrice?.toString() ?? "")
  const [productSearch, setProductSearch] = useState("")
  const [showProductSearch, setShowProductSearch] = useState(false)

  const autoPrice = items.reduce((s, { productId, qty }) => {
    const p = products.find(x => x.id === productId)
    return s + (p ? p.price * qty : 0)
  }, 0)

  function handleSave() {
    if (!name.trim() || items.length === 0) return
    onSave({
      id: initial.id,
      name: name.trim(),
      emoji,
      description: description.trim() || undefined,
      items,
      customPrice: useCustomPrice && customPriceVal ? parseFloat(customPriceVal.replace(",", ".")) : undefined,
    })
  }

  const filteredProds = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !items.find(i => i.productId === p.id)
  ).slice(0, 6)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-base font-bold">{isNew ? "Nouvelle formule" : "Modifier la formule"}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60 text-xs">✕</button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Icône</label>
              <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)}
                className="w-14 text-center bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-2.5 text-xl focus:outline-none focus:border-amber-500/50" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-white/40 mb-1">Nom *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Kit Électricien"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Description (optionnel)</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description courte"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">Produits inclus *</label>
            <div className="space-y-2 mb-2">
              {items.map(({ productId, qty }) => {
                const p = products.find(x => x.id === productId)
                if (!p) return null
                return (
                  <div key={productId} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-base flex-shrink-0">{p.emoji}</span>
                    <span className="flex-1 text-xs font-medium truncate">{p.name}</span>
                    <span className="text-xs text-white/40 flex-shrink-0">{formatPrice(p.price)}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setItems(prev => prev.map(i => i.productId === productId ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                        className="w-6 h-6 rounded-md bg-white/[0.08] hover:bg-white/15 flex items-center justify-center text-xs font-bold">−</button>
                      <span className="w-6 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => setItems(prev => prev.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i))}
                        className="w-6 h-6 rounded-md bg-white/[0.08] hover:bg-white/15 flex items-center justify-center text-xs font-bold">+</button>
                    </div>
                    <button onClick={() => setItems(prev => prev.filter(i => i.productId !== productId))}
                      className="w-6 h-6 rounded-md bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</button>
                  </div>
                )
              })}
            </div>
            <div className="relative">
              <input type="text" value={productSearch} onChange={e => { setProductSearch(e.target.value); setShowProductSearch(true) }}
                onFocus={() => setShowProductSearch(true)}
                placeholder="+ Ajouter un produit..."
                className="w-full bg-white/[0.04] border border-dashed border-white/[0.15] hover:border-amber-500/40 rounded-lg px-3 py-2 text-sm text-white/60 placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" />
              {showProductSearch && filteredProds.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#0e0e18] border border-white/[0.12] rounded-xl overflow-hidden shadow-xl">
                  {filteredProds.map(p => (
                    <button key={p.id} onClick={() => { setItems(prev => [...prev, { productId: p.id, qty: 1 }]); setProductSearch(""); setShowProductSearch(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/[0.06] text-left transition-colors">
                      <span>{p.emoji}</span>
                      <span className="flex-1 text-sm">{p.name}</span>
                      <span className="text-xs text-white/40">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Prix automatique</span>
              <span className="font-bold text-amber-400">{formatPrice(autoPrice)}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useCustomPrice} onChange={e => setUseCustomPrice(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs text-white/60">Prix de pack personnalisé</span>
            </label>
            {useCustomPrice && (
              <div className="flex items-center gap-2">
                <input type="number" min={0} step={0.01} value={customPriceVal} onChange={e => setCustomPriceVal(e.target.value)} placeholder="0.00"
                  className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 text-right font-bold" />
                <span className="text-white/40 font-bold">€</span>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-white/[0.06] flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/50 text-sm transition-colors">Annuler</button>
          <button onClick={handleSave} disabled={!name.trim() || items.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-30">
            {isNew ? "Créer la formule" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function ATMApp() {
  const initialized = useRef(false)
  const supabaseOk  = useRef(false)  // true uniquement si Supabase est joignable
  const [isLoading, setIsLoading]           = useState(true)

  const [view, setView]                     = useState<View>("vendre")

  // ─── Swipe navigation mobile ──────────────────────────────────────────────
  const SWIPE_VIEWS: View[] = ["vendre", "activite", "clients", "catalogue", "stock", "notes", "parametres"]
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * 0.6) return // seuil + ignorer scroll vertical
    const idx = SWIPE_VIEWS.indexOf(view)
    if (idx === -1) return
    if (dx < 0 && idx < SWIPE_VIEWS.length - 1) setView(SWIPE_VIEWS[idx + 1]) // swipe gauche → section suivante
    if (dx > 0 && idx > 0) setView(SWIPE_VIEWS[idx - 1]) // swipe droite → section précédente
  }
  const [products, setProducts]             = useState<Product[]>(() => {
    const prods = LS.get<Product[]>("atm_products", INITIAL_PRODUCTS)
    if (typeof window === "undefined") return prods
    // Migration : récupère les images des anciens emplacements de stockage
    const legacy = LS.get<Record<string, string>>("atm_product_images", {})
    return prods.map(p => {
      // 1. Clé individuelle (nouveau format) — priorité max
      const saved = localStorage.getItem(`atm_img_${p.id}`)
      if (saved) return { ...p, image: saved }
      // 2. Ancienne clé groupée (premier fix) — migration automatique
      if (legacy[p.id]) {
        try { localStorage.setItem(`atm_img_${p.id}`, legacy[p.id]) } catch { /* quota */ }
        return { ...p, image: legacy[p.id] }
      }
      // 3. Image déjà dans le produit (format original, avant tout fix)
      if (p.image?.startsWith("data:image/")) {
        try { localStorage.setItem(`atm_img_${p.id}`, p.image) } catch { /* quota */ }
      }
      return p
    })
  })
  const [orders, setOrders]                 = useState<Order[]>(() =>
    LS.get<Order[]>("atm_orders", []).map(o => ({ ...o, createdAt: new Date(o.createdAt) }))
  )
  const [categories, setCategories]         = useState<string[]>(() => LS.get("atm_categories", DEFAULT_CATEGORIES))
  const [cart, setCart]                     = useState<Record<string, number>>({})
  const [categoryFilter, setCategoryFilter] = useState<Category | "Tout">("Tout")
  const [searchQuery, setSearchQuery]       = useState("")
  const [favorites, setFavorites]           = useState<string[]>(() => LS.get("atm_favorites", []))
  const [tableInput, setTableInput]         = useState("")
  const [discountType, setDiscountType]     = useState<DiscountType>("percent")
  const [discountValue, setDiscountValue]   = useState(0)
  const [showPayModal, setShowPayModal]     = useState(false)
  const [receiptOrder, setReceiptOrder]     = useState<Order | null>(null)
  const [stockEditing, setStockEditing]     = useState<string | null>(null)
  const [stockEditVal, setStockEditVal]     = useState("")
  const [photoEditing, setPhotoEditing]     = useState<string | null>(null)
  const [photoEditVal, setPhotoEditVal]     = useState("")
  const [orderSearch, setOrderSearch]       = useState("")
  const [receiptIsDuplicate, setReceiptIsDuplicate] = useState(false)
  const [detailProduct, setDetailProduct]   = useState<Product | null>(null)
  const [detailQty, setDetailQty]           = useState(1)
  // Réception marchandise
  const [receptionSearch, setReceptionSearch] = useState("")
  const [receptionProductId, setReceptionProductId] = useState<string>("")
  const [receptionQty, setReceptionQty]       = useState("")
  const [receptionHistory, setReceptionHistory] = useState<{ productId: string; name: string; qty: number; at: Date }[]>([])
  const [sortiesHistory, setSortiesHistory]     = useState<{ productId: string; name: string; qty: number; orderId: string; at: Date }[]>(() =>
    LS.get<{ productId: string; name: string; qty: number; orderId: string; at: string }[]>("atm_sorties", [])
      .map(s => ({ ...s, at: new Date(s.at) }))
  )
  // Activité tabs
  const [activiteTab, setActiviteTab]         = useState<"stats" | "commandes">("stats")
  const [activitePeriod, setActivitePeriod]   = useState<"7j" | "tout">("7j")
  const [activiteStatus, setActiviteStatus]   = useState<"tout" | "livré" | "en cours" | "prêt" | "annulé">("tout")
  const [dateFilter, setDateFilter]           = useState<"today" | "week" | "month" | "all">("today")
  // Tickets en attente
  const [pendingOrders, setPendingOrders]     = useState<PendingOrder[]>(() =>
    LS.get<PendingOrder[]>("atm_pending", []).map(o => ({ ...o, savedAt: new Date(o.savedAt) }))
  )
  const [showPendingPanel, setShowPendingPanel] = useState(false)
  const [cartComment, setCartComment]         = useState("")
  const [showAdminMenu, setShowAdminMenu]     = useState(false)
  const [userRole, setUserRole]               = useState<UserRole>("Administrateur")
  const [isLoggedIn, setIsLoggedIn]           = useState(true) // Login désactivé en dev — à réactiver au déploiement
  const [loginStep, setLoginStep]             = useState<"choose" | "pin">("choose")
  const [loginRole, setLoginRole]             = useState<UserRole>("Administrateur")
  const [loginInput, setLoginInput]           = useState("")
  const [loginError, setLoginError]           = useState(false)
  const [showMobileMenu, setShowMobileMenu]   = useState(false)
  const [showMobileCart, setShowMobileCart]   = useState(false)
  // Vitrine
  const [vitrineCart, setVitrineCart]         = useState<Record<string, number>>({})
  const [vitrineStep, setVitrineStep]         = useState<"select" | "paiement">("select")
  const [vitrineClient, setVitrineClient]     = useState("")
  const [vitrineSearch, setVitrineSearch]     = useState("")
  const [refundModal, setRefundModal]         = useState<{ orderId: string; total: number } | null>(null)
  const [refundReason, setRefundReason]       = useState("Vente annulée")
  // Prix variable
  const [cartPrices, setCartPrices]           = useState<Record<string, number>>({})
  const [variablePriceModal, setVariablePriceModal] = useState<{ productId: string; name: string } | null>(null)
  const [variablePriceInput, setVariablePriceInput] = useState("")
  // Catalogue
  const [catEditProduct, setCatEditProduct]   = useState<Product | null>(null)
  const [catAddMode, setCatAddMode]           = useState(false)
  const [catSearch, setCatSearch]             = useState("")
  // Stock — edit inline
  const [stockEditProduct, setStockEditProduct] = useState<Product | null>(null)
  const [stockAddMode, setStockAddMode]         = useState(false)
  // Formules
  const [formulas, setFormulas]               = useState<Formula[]>(() => LS.get("atm_formulas", []))
  const [formulaModal, setFormulaModal]       = useState<Formula | "new" | null>(null)
  const [formulaTab, setFormulaTab]           = useState<"produits" | "formules">("produits")
  // Paramètres boutique
  const [shopName, setShopName]               = useState(() => LS.get("atm_shopName", "ATM Outillage"))
  const [shopSubtitle, setShopSubtitle]       = useState(() => LS.get("atm_shopSubtitle", "Vente de matériel & outillage"))
  const [shopAddress, setShopAddress]         = useState(() => LS.get("atm_shopAddress", ""))
  const [shopPhone, setShopPhone]             = useState(() => LS.get("atm_shopPhone", ""))
  // Paramètres avancés
  const [currency, setCurrency]               = useState(() => LS.get("atm_currency", "€"))
  const [ticketLogo, setTicketLogo]           = useState(() => LS.get("atm_ticketLogo", ""))
  const [ticketFooter, setTicketFooter]       = useState(() => LS.get("atm_ticketFooter", "Merci de votre confiance !"))
  const [adminPin, setAdminPin]               = useState("")
  const [partenairePin, setPartenairePin]     = useState("")
  const [adminName, setAdminName]             = useState(() => LS.get("atm_adminName", "Administrateur"))
  const [partenaireName, setPartenaireName]   = useState(() => LS.get("atm_partenaireName", "Partenaire"))
  const [testMode, setTestMode]               = useState(false)
  const [taxes, setTaxes]                     = useState<Tax[]>(() => LS.get("atm_taxes", [
    { id: "t1", name: "TVA 20%", rate: 20 },
    { id: "t2", name: "TVA 5,5%", rate: 5.5 },
  ]))
  const [taxForm, setTaxForm]                 = useState(false)
  const [taxName, setTaxName]                 = useState("")
  const [taxRate, setTaxRate]                 = useState("")
  const [taxEditId, setTaxEditId]             = useState<string | null>(null)
  const [shopSiret, setShopSiret]             = useState(() => LS.get("atm_shopSiret", ""))
  const [shopTva, setShopTva]                 = useState(() => LS.get("atm_shopTva", ""))
  const [shopNaf, setShopNaf]                 = useState(() => LS.get("atm_shopNaf", ""))
  const [showTicketZ, setShowTicketZ]         = useState(false)
  const [cashPayStep, setCashPayStep]         = useState(false)
  const [cashGivenInput, setCashGivenInput]   = useState("")
  // Fond de caisse
  const [fondDeCaisse, setFondDeCaisse]       = useState(() => LS.get("atm_fondDeCaisse", 0))
  const [fondDeCaisseDate, setFondDeCaisseDate] = useState(() => LS.get("atm_fondDate", ""))
  const [showFondModal, setShowFondModal]     = useState(false)
  const [fondInput, setFondInput]             = useState("")
  const [today, setToday]                     = useState("")
  // Clients
  const [clients, setClients]                 = useState<Client[]>(() =>
    LS.get<Client[]>("atm_clients", []).map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
  )
  const [clientSearch, setClientSearch]       = useState("")
  const [clientFormMode, setClientFormMode]   = useState<"add" | "edit" | null>(null)
  const [selectedClient, setSelectedClient]   = useState<Client | null>(null)
  const [clientFormName, setClientFormName]   = useState("")
  const [clientFormPhone, setClientFormPhone] = useState("")
  const [clientFormEmail, setClientFormEmail] = useState("")
  const [clientFormNotes, setClientFormNotes] = useState("")
  // Cart client selector
  const [cartClientId, setCartClientId]       = useState("")
  const [cartClientSearch, setCartClientSearch] = useState("")
  const [showCartClientDrop, setShowCartClientDrop] = useState(false)
  // Fournisseurs
  const [suppliers, setSuppliers]             = useState<Supplier[]>(() => LS.get("atm_suppliers", []))
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [editSupplier, setEditSupplier]       = useState<Supplier | null>(null)
  const [supplierName, setSupplierName]       = useState("")
  const [supplierPhone, setSupplierPhone]     = useState("")
  const [supplierEmail, setSupplierEmail]     = useState("")
  const [supplierNotes, setSupplierNotes]     = useState("")
  // Notes internes
  const [internalNotes, setInternalNotes]     = useState<InternalNote[]>(() =>
    LS.get<InternalNote[]>("atm_notes", []).map(n => ({ ...n, createdAt: new Date(n.createdAt) }))
  )
  const [noteInput, setNoteInput]             = useState("")

  // ─── Persistence localStorage + Supabase ────────────────────────────────────
  useEffect(() => {
    // Images base64 → stockées dans des clés individuelles (atm_img_<id>) dans localStorage ET Supabase
    const productsForStorage = products.map(p => {
      if (p.image?.startsWith("data:image/")) {
        // Nouvelle image base64 → sauvegarder individuellement
        try { localStorage.setItem(`atm_img_${p.id}`, p.image) } catch { /* quota */ }
        // Aussi sauvegarder dans Supabase pour persistance fiable
        if (initialized.current && supabaseOk.current) dbSet(`atm_img_${p.id}`, p.image)
        return { ...p, image: undefined }
      } else if (p.image) {
        // Image URL → effacer toute base64 obsolète pour ce produit
        localStorage.removeItem(`atm_img_${p.id}`)
        if (initialized.current && supabaseOk.current) dbSet(`atm_img_${p.id}`, null)
      } else if (initialized.current) {
        // Image explicitement supprimée par l'utilisateur (pas un simple chargement)
        localStorage.removeItem(`atm_img_${p.id}`)
        if (supabaseOk.current) dbSet(`atm_img_${p.id}`, null)
      }
      return p
    })
    LS.set("atm_products", productsForStorage)
    if (initialized.current && supabaseOk.current) dbSet("atm_products", productsForStorage)
  }, [products])
  useEffect(() => { LS.set("atm_orders", orders);           if (initialized.current && supabaseOk.current) dbSet("atm_orders", orders) }, [orders])
  useEffect(() => { LS.set("atm_pending", pendingOrders);   if (initialized.current && supabaseOk.current) dbSet("atm_pending", pendingOrders) }, [pendingOrders])
  useEffect(() => { LS.set("atm_formulas", formulas);       if (initialized.current && supabaseOk.current) dbSet("atm_formulas", formulas) }, [formulas])
  useEffect(() => { LS.set("atm_shopName", shopName);       if (initialized.current && supabaseOk.current) dbSet("atm_shopName", shopName) }, [shopName])
  useEffect(() => { LS.set("atm_shopSubtitle", shopSubtitle); if (initialized.current && supabaseOk.current) dbSet("atm_shopSubtitle", shopSubtitle) }, [shopSubtitle])
  useEffect(() => { LS.set("atm_shopAddress", shopAddress); if (initialized.current && supabaseOk.current) dbSet("atm_shopAddress", shopAddress) }, [shopAddress])
  useEffect(() => { LS.set("atm_shopPhone", shopPhone);     if (initialized.current && supabaseOk.current) dbSet("atm_shopPhone", shopPhone) }, [shopPhone])
  useEffect(() => { LS.set("atm_currency", currency);       if (initialized.current && supabaseOk.current) dbSet("atm_currency", currency) }, [currency])
  useEffect(() => { LS.set("atm_ticketLogo", ticketLogo);   if (initialized.current && supabaseOk.current) dbSet("atm_ticketLogo", ticketLogo) }, [ticketLogo])
  useEffect(() => { LS.set("atm_ticketFooter", ticketFooter); if (initialized.current && supabaseOk.current) dbSet("atm_ticketFooter", ticketFooter) }, [ticketFooter])
  useEffect(() => { LS.set("atm_adminPin", adminPin) }, [adminPin])
  useEffect(() => { LS.set("atm_partenairePin", partenairePin) }, [partenairePin])
  useEffect(() => { LS.set("atm_adminName", adminName);     if (initialized.current && supabaseOk.current) dbSet("atm_adminName", adminName) }, [adminName])
  useEffect(() => { LS.set("atm_partenaireName", partenaireName); if (initialized.current && supabaseOk.current) dbSet("atm_partenaireName", partenaireName) }, [partenaireName])
  useEffect(() => { LS.set("atm_taxes", taxes);             if (initialized.current && supabaseOk.current) dbSet("atm_taxes", taxes) }, [taxes])
  useEffect(() => { LS.set("atm_shopSiret", shopSiret);     if (initialized.current && supabaseOk.current) dbSet("atm_shopSiret", shopSiret) }, [shopSiret])
  useEffect(() => { LS.set("atm_shopTva", shopTva);         if (initialized.current && supabaseOk.current) dbSet("atm_shopTva", shopTva) }, [shopTva])
  useEffect(() => { LS.set("atm_shopNaf", shopNaf);         if (initialized.current && supabaseOk.current) dbSet("atm_shopNaf", shopNaf) }, [shopNaf])
  useEffect(() => { LS.set("atm_fondDeCaisse", fondDeCaisse); if (initialized.current && supabaseOk.current) dbSet("atm_fondDeCaisse", fondDeCaisse) }, [fondDeCaisse])
  useEffect(() => { LS.set("atm_fondDate", fondDeCaisseDate); if (initialized.current && supabaseOk.current) dbSet("atm_fondDate", fondDeCaisseDate) }, [fondDeCaisseDate])
  useEffect(() => { LS.set("atm_clients", clients);         if (initialized.current && supabaseOk.current) dbSet("atm_clients", clients) }, [clients])
  useEffect(() => { LS.set("atm_sorties", sortiesHistory);  if (initialized.current && supabaseOk.current) dbSet("atm_sorties", sortiesHistory) }, [sortiesHistory])
  useEffect(() => { LS.set("atm_suppliers", suppliers);     if (initialized.current && supabaseOk.current) dbSet("atm_suppliers", suppliers) }, [suppliers])
  useEffect(() => { LS.set("atm_favorites", favorites);     if (initialized.current && supabaseOk.current) dbSet("atm_favorites", favorites) }, [favorites])
  useEffect(() => { LS.set("atm_notes", internalNotes);     if (initialized.current && supabaseOk.current) dbSet("atm_notes", internalNotes) }, [internalNotes])
  useEffect(() => { LS.set("atm_categories", categories);   if (initialized.current && supabaseOk.current) dbSet("atm_categories", categories) }, [categories])
  useEffect(() => { setToday(new Date().toDateString()) }, [])

  // PINs désactivés — réactivation possible depuis Paramètres
  useEffect(() => {
    LS.set("atm_adminPin", "")
    LS.set("atm_partenairePin", "")
  }, [])

  // ─── Chargement initial depuis Supabase ──────────────────────────────────────
  useEffect(() => {
    async function loadFromSupabase() {
      const all = await dbGetAll()

      if (all === null) {
        // Supabase inaccessible — on utilise localStorage, on n'écrit rien
        // supabaseOk reste false → aucune écriture Supabase possible
      } else if (Object.keys(all).length > 0) {
        // Supabase a des données → les charger dans les states
        supabaseOk.current = true
        if (all.atm_products) {
          setProducts((all.atm_products as Product[]).map(p => {
            // Priorité : localStorage > Supabase > rien
            const savedLocal = localStorage.getItem(`atm_img_${p.id}`)
            if (savedLocal) return { ...p, image: savedLocal }
            const savedSupabase = all[`atm_img_${p.id}`] as string | undefined
            if (savedSupabase) {
              // Restaurer aussi dans localStorage pour les prochains chargements
              try { localStorage.setItem(`atm_img_${p.id}`, savedSupabase) } catch { /* quota */ }
              return { ...p, image: savedSupabase }
            }
            return p
          }))
        }
        if (all.atm_categories) setCategories(all.atm_categories as string[])
        if (all.atm_orders) setOrders(
          (all.atm_orders as Order[]).map(o => ({ ...o, createdAt: new Date(o.createdAt) }))
        )
        if (all.atm_pending) setPendingOrders(
          (all.atm_pending as PendingOrder[]).map(o => ({ ...o, savedAt: new Date(o.savedAt) }))
        )
        if (all.atm_formulas) setFormulas(all.atm_formulas as Formula[])
        if (all.atm_shopName !== undefined) setShopName(all.atm_shopName as string)
        if (all.atm_shopSubtitle !== undefined) setShopSubtitle(all.atm_shopSubtitle as string)
        if (all.atm_shopAddress !== undefined) setShopAddress(all.atm_shopAddress as string)
        if (all.atm_shopPhone !== undefined) setShopPhone(all.atm_shopPhone as string)
        if (all.atm_currency !== undefined) setCurrency(all.atm_currency as string)
        if (all.atm_ticketLogo !== undefined) setTicketLogo(all.atm_ticketLogo as string)
        if (all.atm_ticketFooter !== undefined) setTicketFooter(all.atm_ticketFooter as string)
        if (all.atm_adminName !== undefined) setAdminName(all.atm_adminName as string)
        if (all.atm_partenaireName !== undefined) setPartenaireName(all.atm_partenaireName as string)
        if (all.atm_taxes) setTaxes(all.atm_taxes as Tax[])
        if (all.atm_shopSiret !== undefined) setShopSiret(all.atm_shopSiret as string)
        if (all.atm_shopTva !== undefined) setShopTva(all.atm_shopTva as string)
        if (all.atm_shopNaf !== undefined) setShopNaf(all.atm_shopNaf as string)
        if (all.atm_fondDeCaisse !== undefined) setFondDeCaisse(all.atm_fondDeCaisse as number)
        if (all.atm_fondDate !== undefined) setFondDeCaisseDate(all.atm_fondDate as string)
        if (all.atm_clients) setClients(
          (all.atm_clients as Client[]).map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
        )
        if (all.atm_sorties) setSortiesHistory(
          (all.atm_sorties as { productId: string; name: string; qty: number; orderId: string; at: string }[])
            .map(s => ({ ...s, at: new Date(s.at) }))
        )
        if (all.atm_suppliers) setSuppliers(all.atm_suppliers as Supplier[])
        if (all.atm_favorites) setFavorites(all.atm_favorites as string[])
        if (all.atm_notes) setInternalNotes(
          (all.atm_notes as InternalNote[]).map(n => ({ ...n, createdAt: new Date(n.createdAt) }))
        )
      } else {
        // Supabase joignable mais vide → migration one-shot depuis localStorage
        supabaseOk.current = true
        const keys = [
          "atm_products", "atm_orders", "atm_pending", "atm_formulas",
          "atm_shopName", "atm_shopSubtitle", "atm_shopAddress", "atm_shopPhone",
          "atm_currency", "atm_ticketLogo", "atm_ticketFooter",
          "atm_adminName", "atm_partenaireName", "atm_taxes",
          "atm_shopSiret", "atm_shopTva", "atm_shopNaf",
          "atm_fondDeCaisse", "atm_fondDate",
          "atm_clients", "atm_sorties", "atm_suppliers", "atm_favorites", "atm_notes",
          "atm_categories",
        ]
        for (const k of keys) {
          const v = LS.get(k, null)
          if (v !== null) await dbSet(k, v)
        }
        // Migrer aussi les images individuelles vers Supabase
        const prods = LS.get<Product[]>("atm_products", [])
        for (const p of prods) {
          const img = localStorage.getItem(`atm_img_${p.id}`)
          if (img) await dbSet(`atm_img_${p.id}`, img)
        }
      }
      initialized.current = true
      setIsLoading(false)
    }
    loadFromSupabase()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // formatPrice lié à la devise
  const formatPrice = (n: number) => _fp(n, currency)

  // ─── Calculs dérivés ────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p => {
      const matchCat = categoryFilter === "Tout" || p.category === categoryFilter
      const matchSearch = searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
    return [...filtered].sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 0 : 1
      const bFav = favorites.includes(b.id) ? 0 : 1
      return aFav - bFav
    })
  }, [products, categoryFilter, searchQuery, favorites])

  const cartItems = useMemo(() =>
    Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product: products.find(p => p.id === id)!, qty }))
      .filter(({ product }) => product !== undefined),
    [cart, products]
  )

  const cartSubtotal = useMemo(() =>
    cartItems.reduce((sum, { product, qty }) => sum + (cartPrices[product.id] ?? product.price) * qty, 0),
    [cartItems, cartPrices]
  )

  const discountAmount   = discountType === "percent"
    ? cartSubtotal * discountValue / 100
    : Math.min(discountValue, cartSubtotal)
  const cartTotal        = cartSubtotal - discountAmount

  // Prix produits = HT — TVA fixe 20%
  const cartHT  = cartTotal
  const cartTVA = cartTotal * 0.2
  const cartTTC = cartTotal * 1.2

  const lowStockProducts  = products.filter(p => p.stock <= p.alertThreshold && p.stock > 0)
  const outOfStockProducts = products.filter(p => p.stock === 0)
  const valeurStock     = products.reduce((s, p) => s + p.stock * p.price, 0)
  const coutStock       = products.reduce((s, p) => s + p.stock * (p.purchasePrice ?? 0), 0)
  const margeStockPct   = valeurStock > 0 && coutStock > 0 ? ((valeurStock - coutStock) / valeurStock * 100) : null

  const filteredByDate = useMemo(() => {
    const now = new Date()
    return orders.filter(o => {
      if (o.isTestMode) return false
      switch (dateFilter) {
        case "today": return o.createdAt.toDateString() === now.toDateString()
        case "week": { const w = new Date(now); w.setDate(w.getDate() - 7); return o.createdAt >= w }
        case "month": return o.createdAt.getMonth() === now.getMonth() && o.createdAt.getFullYear() === now.getFullYear()
        default: return true
      }
    })
  }, [orders, dateFilter])

  const deliveredFiltered = filteredByDate.filter(o => o.status === "livré")
  const filteredRevenue   = deliveredFiltered.reduce((sum, o) => sum + o.total, 0)
  const filteredAvgTicket = deliveredFiltered.length > 0 ? filteredRevenue / deliveredFiltered.length : 0

  const revenueByPayment = useMemo(() => {
    const acc: Record<PaymentMethod, number> = { espèces: 0, carte: 0, chèque: 0, virement: 0 }
    filteredByDate.filter(o => o.status === "livré").forEach(o => { acc[o.paymentMethod] += o.total })
    return acc
  }, [filteredByDate])

  const filteredOrders = useMemo(() => {
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); sevenDaysAgo.setHours(0, 0, 0, 0)
    return orders.filter(o => {
      if (activitePeriod === "7j" && o.createdAt < sevenDaysAgo) return false
      if (activiteStatus === "tout" && o.status === "annulé") return false
      if (activiteStatus !== "tout" && o.status !== activiteStatus) return false
      if (orderSearch !== "" && !o.id.toLowerCase().includes(orderSearch.toLowerCase()) && !(o.table && o.table.toLowerCase().includes(orderSearch.toLowerCase()))) return false
      return true
    })
  }, [orders, activitePeriod, activiteStatus, orderSearch])

  // Groupement par jour pour la vue commandes
  const ordersByDay = useMemo(() => {
    const map: Record<string, Order[]> = {}
    filteredOrders.forEach(o => {
      const key = o.createdAt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()
      if (!map[key]) map[key] = []
      map[key].push(o)
    })
    return map
  }, [filteredOrders])

  const totalCAFiltre = useMemo(() =>
    filteredOrders.filter(o => o.status === "livré" || o.status === "en cours" || o.status === "prêt").reduce((s, o) => s + o.total, 0)
  , [filteredOrders])

  // ─── Actions ────────────────────────────────────────────────────────────────

  function addToCart(productId: string) {
    const product = products.find(p => p.id === productId)!
    const currentQty = cart[productId] ?? 0
    if (currentQty >= product.stock) return
    // Prix variable : ouvrir modal si aucun prix saisi
    if (product.variablePrice && cartPrices[productId] === undefined) {
      setVariablePriceModal({ productId, name: product.name })
      setVariablePriceInput("")
      return
    }
    // Appliquer promo si pas encore dans cartPrices
    if (product.promoPercent && product.promoPercent > 0 && cartPrices[productId] === undefined) {
      const promoPrice = product.price * (1 - product.promoPercent / 100)
      setCartPrices(p => ({ ...p, [productId]: promoPrice }))
    }
    setCart(c => ({ ...c, [productId]: (c[productId] ?? 0) + 1 }))
  }

  function addFormulaToCart(formula: Formula) {
    setCart(prev => {
      const next = { ...prev }
      formula.items.forEach(({ productId, qty }) => {
        next[productId] = (next[productId] ?? 0) + qty
      })
      return next
    })
    if (formula.customPrice !== undefined) {
      // prix fixe : on l'applique sur le premier produit de la formule comme prix custom
      // (simplifié : on stocke le prix total de la formule dans cartPrices du premier item)
      // Pour un vrai système, on ajouterait une ligne "formule" dédiée
    }
  }

  function confirmVariablePrice() {
    if (!variablePriceModal) return
    const price = parseFloat(variablePriceInput.replace(",", "."))
    if (isNaN(price) || price < 0) return
    setCartPrices(p => ({ ...p, [variablePriceModal.productId]: price }))
    setCart(c => ({ ...c, [variablePriceModal.productId]: (c[variablePriceModal.productId] ?? 0) + 1 }))
    setVariablePriceModal(null)
    setVariablePriceInput("")
  }

  function removeFromCart(productId: string) {
    const currentQty = cart[productId] ?? 0
    if (currentQty <= 1) {
      setCart(c => { const n = { ...c }; delete n[productId]; return n })
      setCartPrices(p => { const n = { ...p }; delete n[productId]; return n })
    } else {
      setCart(c => ({ ...c, [productId]: currentQty - 1 }))
    }
  }

  function clearCart() {
    setCart({})
    setCartPrices({})
    setTableInput("")
    setCartComment("")
    setDiscountType("percent")
    setDiscountValue(0)
    setCartClientId("")
    setCartClientSearch("")
  }

  function holdCart() {
    if (cartItems.length === 0) return
    const pending: PendingOrder = {
      id: genId(),
      items: { ...cart },
      cartPrices: { ...cartPrices },
      subtotal: cartSubtotal,
      discountType,
      discountValue,
      tableInput,
      comment: cartComment,
      savedAt: new Date(),
    }
    setPendingOrders(prev => [pending, ...prev])
    clearCart()
  }

  function resumePendingOrder(pending: PendingOrder) {
    setCart(pending.items)
    setCartPrices(pending.cartPrices)
    setDiscountType(pending.discountType)
    setDiscountValue(pending.discountValue)
    setTableInput(pending.tableInput)
    setCartComment(pending.comment)
    setPendingOrders(prev => prev.filter(p => p.id !== pending.id))
    setShowPendingPanel(false)
  }

  function validateOrder(method: PaymentMethod, cashGiven?: number) {
    if (cartItems.length === 0) return
    const items: OrderItem[] = cartItems.map(({ product, qty }) => ({
      productId: product.id,
      name:      product.name,
      quantity:  qty,
      unitPrice: cartPrices[product.id] ?? product.price,
    }))
    const order: Order = {
      id:            genId(),
      items,
      subtotal:      cartSubtotal,
      discountType,
      discountValue,
      total:         cartTTC,
      paymentMethod: method,
      status:        "en cours",
      createdAt:     new Date(),
      table:         tableInput.trim() || undefined,
      comment:       cartComment.trim() || undefined,
      isTestMode:    testMode || undefined,
      cashGiven:     cashGiven || undefined,
      clientId:      cartClientId || undefined,
      orderedBy:     userRole === "Administrateur" ? adminName : partenaireName,
    }
    setProducts(prev => prev.map(p => {
      const qty = cart[p.id] ?? 0
      return qty > 0 ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    }))
    const now = new Date()
    setSortiesHistory(prev => [
      ...items.map(i => ({ productId: i.productId, name: i.name, qty: i.quantity, orderId: order.id, at: now })),
      ...prev,
    ].slice(0, 200))
    setOrders(prev => [order, ...prev])
    clearCart()
    setShowPayModal(false)
    setCashPayStep(false)
    setCashGivenInput("")
    setReceiptOrder(order)
    setReceiptIsDuplicate(false)
  }

  function validateVitrineOrder(method: PaymentMethod) {
    const items: OrderItem[] = Object.entries(vitrineCart)
      .filter(([, qty]) => qty > 0)
      .map(([pid, qty]) => {
        const p = products.find(x => x.id === pid)!
        return { productId: pid, name: p.name, quantity: qty, unitPrice: p.price }
      })
    if (items.length === 0) return
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
    const order: Order = {
      id: genId(), items, subtotal, discountType: "percent", discountValue: 0,
      total: subtotal, paymentMethod: method, status: "en cours", createdAt: new Date(),
      table: vitrineClient.trim() || undefined,
      orderedBy: userRole === "Administrateur" ? adminName : partenaireName,
    }
    setProducts(prev => prev.map(p => {
      const qty = vitrineCart[p.id] ?? 0
      return qty > 0 ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    }))
    const now2 = new Date()
    setSortiesHistory(prev => [
      ...items.map(i => ({ productId: i.productId, name: i.name, qty: i.quantity, orderId: order.id, at: now2 })),
      ...prev,
    ].slice(0, 200))
    setOrders(prev => [order, ...prev])
    setVitrineCart({})
    setVitrineStep("select")
    setVitrineClient("")
    setReceiptOrder(order)
    setReceiptIsDuplicate(false)
  }

  function advanceOrder(orderId: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const next = STATUS_NEXT[o.status]
      return next ? { ...o, status: next } : o
    }))
  }

  function cancelOrder(orderId: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId || o.status === "livré") return o
      const toRestore = o.items
      setProducts(pp => pp.map(p => {
        const item = toRestore.find(i => i.productId === p.id)
        return item ? { ...p, stock: p.stock + item.quantity } : p
      }))
      return { ...o, status: "annulé" }
    }))
  }

  function processRefund(orderId: string, reason: string) {
    const original = orders.find(o => o.id === orderId)
    if (!original || original.status !== "livré") return
    const refund: Order = {
      id:            genId(),
      items:         original.items,
      subtotal:      -original.subtotal,
      discountType:  original.discountType,
      discountValue: original.discountValue,
      total:         -Math.abs(original.total),
      paymentMethod: original.paymentMethod,
      status:        "remboursé",
      createdAt:     new Date(),
      table:         original.table,
      isRefund:      true,
      refundReason:  reason,
      refundOf:      orderId,
    }
    setProducts(prev => prev.map(p => {
      const item = original.items.find(i => i.productId === p.id)
      return item ? { ...p, stock: p.stock + item.quantity } : p
    }))
    setOrders(prev => [refund, ...prev.map(o => o.id === orderId ? { ...o, status: "remboursé" as OrderStatus } : o)])
    setRefundModal(null)
  }

  // ── Export CSV ────────────────────────────────────────────────────────────
  const [showExportMenu, setShowExportMenu] = useState(false)

  function exportVentes() {
    const rows = orders.map(o => [
      o.id,
      o.createdAt.toLocaleDateString("fr-FR") + " " + formatTime(o.createdAt),
      o.table ?? "",
      o.items.map(i => `${i.quantity}x ${i.name}`).join(" | "),
      o.discountValue > 0 ? (o.discountType === "percent" ? `${o.discountValue}%` : `${o.discountValue}€`) : "",
      o.total.toFixed(2),
      o.paymentMethod,
      o.status,
      o.comment ?? "",
      o.isRefund ? (o.refundReason ?? "") : "",
    ])
    exportCSV("ventes.csv",
      ["N° commande","Date","Client/Table","Articles","Remise","Total (€)","Paiement","Statut","Commentaire","Motif remboursement"],
      rows as unknown as (string | number)[]
    )
    setShowExportMenu(false)
  }

  function exportParArticle() {
    const counts: Record<string, { name: string; category: string; qty: number; revenue: number }> = {}
    orders.filter(o => o.status === "livré").forEach(o =>
      o.items.forEach(item => {
        const p = products.find(pr => pr.id === item.productId)
        if (!counts[item.productId]) counts[item.productId] = { name: item.name, category: p?.category ?? "", qty: 0, revenue: 0 }
        counts[item.productId].qty     += item.quantity
        counts[item.productId].revenue += item.quantity * item.unitPrice
      })
    )
    const rows = Object.values(counts).sort((a, b) => b.qty - a.qty).map(r => [r.name, r.category, r.qty, r.revenue.toFixed(2)])
    exportCSV("par-article.csv", ["Article","Catégorie","Qté vendue","CA total (€)"], rows as unknown as (string | number)[])
    setShowExportMenu(false)
  }

  function exportParCategorie() {
    const cats: Record<string, { qty: number; revenue: number }> = {}
    orders.filter(o => o.status === "livré").forEach(o =>
      o.items.forEach(item => {
        const p = products.find(pr => pr.id === item.productId)
        const cat = p?.category ?? "Autre"
        if (!cats[cat]) cats[cat] = { qty: 0, revenue: 0 }
        cats[cat].qty     += item.quantity
        cats[cat].revenue += item.quantity * item.unitPrice
      })
    )
    const rows = Object.entries(cats).map(([cat, d]) => [cat, d.qty, d.revenue.toFixed(2)])
    exportCSV("par-categorie.csv", ["Catégorie","Articles vendus","CA (€)"], rows as unknown as (string | number)[])
    setShowExportMenu(false)
  }

  function exportParPaiement() {
    const pay: Record<PaymentMethod, { nb: number; total: number }> = { espèces: { nb: 0, total: 0 }, carte: { nb: 0, total: 0 }, chèque: { nb: 0, total: 0 }, virement: { nb: 0, total: 0 } }
    orders.filter(o => o.status === "livré").forEach(o => {
      pay[o.paymentMethod].nb++
      pay[o.paymentMethod].total += o.total
    })
    const rows = Object.entries(pay).map(([m, d]) => [m, d.nb, d.total.toFixed(2)])
    exportCSV("par-paiement.csv", ["Moyen de paiement","Nb ventes","Total (€)"], rows as unknown as (string | number)[])
    setShowExportMenu(false)
  }

  function exportRemises() {
    const discounted = orders.filter(o => o.discountValue > 0)
    const rows = discounted.map(o => {
      const sub = o.subtotal
      const disc = o.discountType === "percent" ? sub * o.discountValue / 100 : Math.min(o.discountValue, sub)
      return [o.id, o.discountType === "percent" ? "%" : "fixe", o.discountValue, disc.toFixed(2), o.total.toFixed(2)]
    })
    exportCSV("remises.csv", ["N° commande","Type remise","Valeur","Montant remisé (€)","Total final (€)"], rows as unknown as (string | number)[])
    setShowExportMenu(false)
  }

  function exportJournalier() {
    const todayDate = new Date()
    const todayStr = todayDate.toLocaleDateString("fr-FR")
    const todayOrders = orders.filter(o => o.createdAt.toDateString() === todayDate.toDateString())
    const delivered = todayOrders.filter(o => o.status === "livré")
    const cancelled = todayOrders.filter(o => o.status === "annulé")
    const refunded  = todayOrders.filter(o => o.status === "remboursé" || o.isRefund)
    const ca = delivered.reduce((s, o) => s + o.total, 0)
    const avg = delivered.length > 0 ? ca / delivered.length : 0

    // Répartition paiements
    const pay: Record<string, { nb: number; total: number }> = {}
    delivered.forEach(o => {
      if (!pay[o.paymentMethod]) pay[o.paymentMethod] = { nb: 0, total: 0 }
      pay[o.paymentMethod].nb++
      pay[o.paymentMethod].total += o.total
    })

    // Répartition vendeurs
    const vendeurs: Record<string, { nb: number; ca: number }> = {}
    delivered.forEach(o => {
      const who = o.orderedBy ?? "Inconnu"
      if (!vendeurs[who]) vendeurs[who] = { nb: 0, ca: 0 }
      vendeurs[who].nb++
      vendeurs[who].ca += o.total
    })

    // Top produits
    const prods: Record<string, { name: string; qty: number; revenue: number }> = {}
    delivered.forEach(o => o.items.forEach(item => {
      if (!prods[item.productId]) prods[item.productId] = { name: item.name, qty: 0, revenue: 0 }
      prods[item.productId].qty     += item.quantity
      prods[item.productId].revenue += item.quantity * item.unitPrice
    }))

    const rows: (string | number)[] = []

    // En-tête résumé
    rows.push(["=== CLÔTURE JOURNÉE DU " + todayStr + " ==="] as unknown as (string | number))
    rows.push([""] as unknown as (string | number))
    rows.push(["RÉSUMÉ", "", ""] as unknown as (string | number))
    rows.push(["CA Total", ca.toFixed(2) + " €", ""] as unknown as (string | number))
    rows.push(["Nb ventes livrées", delivered.length, ""] as unknown as (string | number))
    rows.push(["Ticket moyen", avg.toFixed(2) + " €", ""] as unknown as (string | number))
    rows.push(["Annulations", cancelled.length, ""] as unknown as (string | number))
    rows.push(["Remboursements", refunded.length, ""] as unknown as (string | number))
    rows.push([""] as unknown as (string | number))

    // Paiements
    rows.push(["--- PAIEMENTS ---", "", ""] as unknown as (string | number))
    Object.entries(pay).forEach(([m, d]) => rows.push([m, d.nb + " vente(s)", d.total.toFixed(2) + " €"] as unknown as (string | number)))
    rows.push([""] as unknown as (string | number))

    // Vendeurs
    rows.push(["--- VENDEURS ---", "", ""] as unknown as (string | number))
    Object.entries(vendeurs).forEach(([name, d]) => rows.push([name, d.nb + " vente(s)", d.ca.toFixed(2) + " €"] as unknown as (string | number)))
    rows.push([""] as unknown as (string | number))

    // Top produits
    rows.push(["--- TOP PRODUITS ---", "", ""] as unknown as (string | number))
    Object.values(prods).sort((a, b) => b.qty - a.qty).forEach(p => rows.push([p.name, p.qty + " vendus", p.revenue.toFixed(2) + " €"] as unknown as (string | number)))
    rows.push([""] as unknown as (string | number))

    // Détail commandes
    rows.push(["--- DÉTAIL COMMANDES ---", "", ""] as unknown as (string | number))
    todayOrders.forEach(o => rows.push([
      o.id,
      formatTime(o.createdAt),
      o.orderedBy ?? "",
      o.table ?? "",
      o.items.map(i => `${i.quantity}x ${i.name}`).join(" | "),
      o.total.toFixed(2) + " €",
      o.paymentMethod,
      o.status,
    ] as unknown as (string | number)))

    exportCSV(`cloture-${todayStr.replace(/\//g, "-")}.csv`,
      ["Info", "Valeur", "Complément"],
      rows
    )
    setShowExportMenu(false)
  }

  // ─── Export / Import données ─────────────────────────────────────────────────
  const importRef = useRef<HTMLInputElement>(null)

  function exportData() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products,
      orders,
      pendingOrders,
      formulas,
      settings: {
        shopName, shopSubtitle, shopAddress, shopPhone,
        shopSiret, shopTva, shopNaf,
        currency, ticketLogo, ticketFooter,
        adminPin, partenairePin, taxes,
      },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `atm-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.version !== 1) { alert("Format de fichier incompatible."); return }
        if (data.products) setProducts(data.products)
        if (data.orders) setOrders(data.orders.map((o: Order) => ({ ...o, createdAt: new Date(o.createdAt) })))
        if (data.pendingOrders) setPendingOrders(data.pendingOrders.map((o: PendingOrder) => ({ ...o, savedAt: new Date(o.savedAt) })))
        if (data.formulas) setFormulas(data.formulas)
        if (data.settings) {
          const s = data.settings
          if (s.shopName !== undefined) setShopName(s.shopName)
          if (s.shopSubtitle !== undefined) setShopSubtitle(s.shopSubtitle)
          if (s.shopAddress !== undefined) setShopAddress(s.shopAddress)
          if (s.shopPhone !== undefined) setShopPhone(s.shopPhone)
          if (s.currency !== undefined) setCurrency(s.currency)
          if (s.ticketLogo !== undefined) setTicketLogo(s.ticketLogo)
          if (s.ticketFooter !== undefined) setTicketFooter(s.ticketFooter)
          // PINs NON importés : les codes d'accès ne peuvent pas être écrasés par un fichier externe
          if (s.shopSiret !== undefined) setShopSiret(s.shopSiret)
          if (s.shopTva !== undefined) setShopTva(s.shopTva)
          if (s.shopNaf !== undefined) setShopNaf(s.shopNaf)
          if (s.taxes !== undefined) setTaxes(s.taxes)
        }
        alert("✅ Données importées avec succès !")
      } catch { alert("❌ Fichier invalide ou corrompu.") }
    }
    reader.readAsText(file)
  }

  function saveStock(productId: string) {
    const val = parseInt(stockEditVal, 10)
    if (isNaN(val) || val < 0) return
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: val } : p))
    setStockEditing(null)
    setStockEditVal("")
  }

  function savePhoto(productId: string) {
    const url = photoEditVal.trim()
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: url || undefined } : p))
    setPhotoEditing(null)
    setPhotoEditVal("")
  }

  function buildReceiptHTML(order: Order, autoprint: boolean): string {
    const paymentLabel: Record<PaymentMethod, string> = { espèces: "Espèces", carte: "Carte bancaire", chèque: "Chèque", virement: "Virement" }
    const userName = userRole === "Administrateur" ? adminName : partenaireName
    const fmt = (n: number) => n.toFixed(2).replace(".", ",")

    // Construire la table des taxes utilisées dans la commande
    const taxEntries: Record<string, { idx: number; rate: number; name: string; tvaAmt: number; htAmt: number; ttcAmt: number }> = {}
    let taxCounter = 1
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId)
      if (prod?.taxId && !taxEntries[prod.taxId]) {
        const tax = taxes.find(t => t.id === prod.taxId)
        if (tax) taxEntries[prod.taxId] = { idx: taxCounter++, rate: tax.rate, name: tax.name, tvaAmt: 0, htAmt: 0, ttcAmt: 0 }
      }
    })

    // Calculer les montants HT/TVA/TTC par taux
    let totalHT = 0
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId)
      const ttc = item.quantity * item.unitPrice
      const entry = prod?.taxId ? taxEntries[prod.taxId] : null
      if (entry) {
        const ht = ttc / (1 + entry.rate / 100)
        entry.ttcAmt += ttc; entry.htAmt += ht; entry.tvaAmt += (ttc - ht)
        totalHT += ht
      } else {
        totalHT += ttc
      }
    })

    // Appliquer la remise proportionnellement
    const discountAmt = order.subtotal - order.total
    if (discountAmt > 0 && order.subtotal > 0) {
      const ratio = order.total / order.subtotal
      totalHT *= ratio
      Object.values(taxEntries).forEach(e => { e.ttcAmt *= ratio; e.htAmt *= ratio; e.tvaAmt *= ratio })
    }

    const totalTVA = Object.values(taxEntries).reduce((s, e) => s + e.tvaAmt, 0)
    const hasTaxes = Object.keys(taxEntries).length > 0
    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0)

    // Lignes articles (noms échappés pour éviter XSS)
    const itemRows = order.items.map(item => {
      const prod = products.find(p => p.id === item.productId)
      const taxCode = prod?.taxId && taxEntries[prod.taxId] ? ` ${taxEntries[prod.taxId].idx}` : ""
      return `<tr><td style="padding:2px 0;font-size:12px">${item.quantity} ${escHtml(item.name)} (${fmt(item.unitPrice)} €)</td><td style="padding:2px 0;text-align:right;font-size:12px;white-space:nowrap">${fmt(item.quantity * item.unitPrice)} €${escHtml(taxCode)}</td></tr>`
    }).join("")

    // Remise
    const discountRows = discountAmt > 0 ? `
      <tr><td style="color:#555;font-size:11px;padding:2px 0">Sous-total</td><td style="text-align:right;color:#555;font-size:11px;padding:2px 0">${fmt(order.subtotal)} €</td></tr>
      <tr><td style="color:#0891b2;font-size:11px;padding:2px 0">${order.discountType === "percent" ? `Remise ${order.discountValue}%` : "Remise"}</td><td style="text-align:right;color:#0891b2;font-size:11px;padding:2px 0">−${fmt(discountAmt)} €</td></tr>` : ""

    // Tableau TVA
    const taxRows = hasTaxes ? Object.values(taxEntries).map(e =>
      `<tr><td style="padding:2px 3px 2px 0;font-size:11px">${escHtml(String(e.idx))} ${escHtml(e.name.replace("TVA ", ""))}</td><td style="padding:2px 3px;text-align:right;font-size:11px">${fmt(e.tvaAmt)}</td><td style="padding:2px 3px;text-align:right;font-size:11px">${fmt(e.htAmt)}</td><td style="padding:2px 0;text-align:right;font-size:11px">${fmt(e.ttcAmt)}</td></tr>`
    ).join("") + `<tr style="font-weight:800;border-top:1px solid #bbb"><td style="padding:3px 3px 2px 0;font-size:11px">Total</td><td style="padding:3px 3px 2px;text-align:right;font-size:11px">${fmt(totalTVA)}</td><td style="padding:3px 3px 2px;text-align:right;font-size:11px">${fmt(totalHT)}</td><td style="padding:3px 0 2px;text-align:right;font-size:11px">${fmt(order.total)}</td></tr>` : ""

    const cashGiven = order.cashGiven ?? 0
    const rendu = order.paymentMethod === "espèces" && cashGiven > order.total ? cashGiven - order.total : 0
    // URLs logo validées (bloque javascript:, data:, etc.)
    const safeLogoUrl = isSafeUrl(ticketLogo) ? ticketLogo : ""
    const siretLine = shopSiret ? `<div style="display:flex;justify-content:space-between"><span>SIRET :</span><span>${escHtml(shopSiret)}</span></div>` : ""
    const tvaNumLine = shopTva ? `<div style="display:flex;justify-content:space-between"><span>N° TVA intracommunautaire :</span><span>${escHtml(shopTva)}</span></div>` : ""
    const nafLine = shopNaf ? `<div style="display:flex;justify-content:space-between"><span>Code NAF :</span><span>${escHtml(shopNaf)}</span></div>` : ""

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: http: data:; script-src 'unsafe-inline';">
  <title>Ticket ${escHtml(order.id)}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Courier New',Courier,monospace; font-size:12px; background:#fff; color:#111; max-width:320px; margin:20px auto; padding:16px 20px 28px; }
    .c { text-align:center; }
    .sep { border:none; border-top:1px solid #ccc; margin:8px 0; }
    table { width:100%; border-collapse:collapse; }
    .btn { display:block;width:100%;margin-top:16px;padding:10px;background:#d97706;color:#fff;font-size:13px;font-weight:700;border:none;border-radius:6px;cursor:pointer; }
    @page { size:80mm auto; margin:6mm; }
    @media print { .btn { display:none; } body { margin:0; max-width:100%; } }
  </style>
</head>
<body>
  <div class="c" style="margin-bottom:10px">
    ${safeLogoUrl ? `<img src="${escHtml(safeLogoUrl)}" alt="" style="max-height:60px;max-width:200px;object-fit:contain;display:block;margin:0 auto 8px">` : ""}
    <strong style="font-size:14px">${escHtml(shopName || "Ma boutique")}</strong>
    ${shopAddress ? `<br><span style="font-size:10px;color:#555">${escHtml(shopAddress)}</span>` : ""}
    ${shopPhone ? `<br><span style="font-size:10px;color:#555">${escHtml(shopPhone)}</span>` : ""}
  </div>
  <hr class="sep">
  <div class="c" style="font-size:10px;color:#555;margin-bottom:6px">
    Ticket ${escHtml(order.id)} — ${order.createdAt.toLocaleDateString("fr-FR")} ${order.createdAt.toLocaleTimeString("fr-FR")}
    ${order.table ? `<br>Client : <strong style="color:#111">${escHtml(order.table)}</strong>` : ""}
    ${order.comment ? `<br><em style="color:#888">&ldquo;${escHtml(order.comment)}&rdquo;</em>` : ""}
  </div>
  <hr class="sep">
  <table>
    <tr style="font-weight:800;font-size:11px;border-bottom:1px solid #bbb">
      <td style="padding-bottom:4px">Articles</td>
      <td style="text-align:right;padding-bottom:4px">Total T</td>
    </tr>
    ${itemRows}
  </table>
  <hr class="sep">
  <table>
    ${discountRows}
    <tr><td style="font-size:12px;padding:2px 0">Total HT</td><td style="text-align:right;font-size:12px;padding:2px 0">${fmt(totalHT)} €</td></tr>
    <tr style="border-top:1px solid #111"><td style="font-size:15px;font-weight:800;padding-top:5px">Total</td><td style="text-align:right;font-size:15px;font-weight:800;padding-top:5px">${fmt(order.total)} €</td></tr>
  </table>
  <hr class="sep">
  <table>
    <tr><td style="font-size:12px;padding:2px 0">${escHtml(paymentLabel[order.paymentMethod])}${order.paymentMethod === "espèces" && cashGiven > 0 ? ` (remis ${fmt(cashGiven)} €)` : ""}</td><td style="text-align:right;font-size:12px;padding:2px 0">${fmt(order.total)} €</td></tr>
    <tr><td style="font-size:12px;padding:2px 0">Rendu</td><td style="text-align:right;font-size:12px;padding:2px 0">${fmt(rendu)} €</td></tr>
  </table>
  ${hasTaxes ? `<hr class="sep">
  <table>
    <tr style="font-weight:800;font-size:11px;border-bottom:1px solid #bbb">
      <td style="padding-bottom:3px">Taux</td>
      <td style="text-align:right;padding-bottom:3px">Taxe</td>
      <td style="text-align:right;padding-bottom:3px">HT</td>
      <td style="text-align:right;padding-bottom:3px">TTC</td>
    </tr>
    ${taxRows}
  </table>` : ""}
  <hr class="sep">
  <div style="font-size:10px;color:#555;line-height:1.9">
    <div style="display:flex;justify-content:space-between"><span>Caisse :</span><span>${escHtml(shopName || "ATM Outillage")} (#1)</span></div>
    <div style="display:flex;justify-content:space-between"><span>Vendeur :</span><span>${escHtml(userName)}</span></div>
    <div style="display:flex;justify-content:space-between"><span>Nombre d&apos;impression :</span><span>1</span></div>
    <div style="display:flex;justify-content:space-between"><span>Nombre de ligne :</span><span>${order.items.length}</span></div>
    <div style="display:flex;justify-content:space-between"><span>Nombre d&apos;articles :</span><span>${totalQty}</span></div>
    <div style="display:flex;justify-content:space-between"><span>Logiciel :</span><span>ATM Outillage</span></div>
    ${siretLine}${tvaNumLine}${nafLine}
    <div style="display:flex;justify-content:space-between"><span>ID :</span><span>${escHtml(order.id)}</span></div>
  </div>
  <hr class="sep">
  <div class="c" style="font-size:10px;color:#888;margin-top:4px">${escHtml(ticketFooter || "Merci de votre confiance !")}</div>
  ${autoprint ? `<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script>` : `<button class="btn" onclick="window.print()">🖨️ Imprimer</button>`}
</body>
</html>`
  }

  function printReceipt(order: Order) {
    const w = window.open("", "_blank", "width=420,height=720")
    if (w) { w.document.write(buildReceiptHTML(order, true)); w.document.close() }
  }

  function downloadReceipt(order: Order) {
    const w = window.open("", "_blank", "width=420,height=720")
    if (w) { w.document.write(buildReceiptHTML(order, false)); w.document.close() }
  }

  async function shareReceipt(order: Order) {
    const payLabel: Record<PaymentMethod, string> = { espèces: "Espèces", carte: "Carte bancaire", chèque: "Chèque", virement: "Virement" }
    const lines = [
      `🧾 Ticket — ${shopName || "ATM Outillage"}`,
      `📅 ${order.createdAt.toLocaleDateString("fr-FR")} ${formatTime(order.createdAt)}`,
      `N° ${order.id}`,
      order.table ? `👤 ${order.table}` : "",
      ``,
      ...order.items.map(i => `${i.quantity}× ${i.name}  ${(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")} €`),
      ``,
      order.discountValue > 0 ? `Remise : −${(order.subtotal - order.total).toFixed(2).replace(".", ",")} €` : "",
      `💰 TOTAL : ${order.total.toFixed(2).replace(".", ",")} €`,
      `💳 ${payLabel[order.paymentMethod]}`,
      ``,
      ticketFooter || "Merci de votre confiance !",
    ].filter(l => l !== undefined && l !== null)

    const text = lines.join("\n")
    if (navigator.share) {
      try { await navigator.share({ title: `Ticket ${order.id}`, text }) } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(text)
      alert("✅ Ticket copié dans le presse-papiers !")
    }
  }

  // ─── Sidebar ─────────────────────────────────────────────────────────────────

  const NAV_ITEMS: { id: View; label: string; icon: string; badge?: number; warn?: boolean }[] = [
    { id: "vendre",     label: "Vendre",            icon: "🛍", badge: Object.keys(cart).length || undefined },
    { id: "activite",   label: "Activité",           icon: "📊", badge: orders.filter(o => o.status === "en cours" || o.status === "prêt").length || undefined },
    { id: "clients",    label: "Clients",            icon: "👥", badge: clients.length || undefined },
    { id: "catalogue",  label: "Catalogue",          icon: "📁" },
    { id: "stock",      label: "Gestion de stock",   icon: "🗄", badge: (lowStockProducts.length + outOfStockProducts.length) || undefined },
    { id: "notes",      label: "Notes internes",      icon: "📝", badge: internalNotes.filter(n => n.pinned).length || undefined },
    { id: "parametres", label: "Paramètres",         icon: "⚙️", warn: !shopAddress || !shopPhone },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="flex h-[100dvh] bg-[#09090f] items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔧</div>
        <div className="text-orange-400 font-semibold text-lg">Chargement…</div>
        <div className="text-zinc-500 text-sm mt-1">Synchronisation des données</div>
      </div>
    </div>
  )

  return (
    <div className="flex h-[100dvh] bg-[#09090f] text-white font-sans overflow-hidden">

      {/* ── ÉCRAN DE CONNEXION ──────────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07070e]">
          <div className="w-full max-w-sm px-6 text-center">
            {/* Logo / nom boutique */}
            <div className="mb-8">
              {ticketLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ticketLogo} alt="logo" className="h-20 max-w-[200px] object-contain mx-auto mb-4 rounded-xl" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4">🔧</div>
              )}
              <h1 className="text-2xl font-black tracking-tight">{shopName || "ATM Outillage"}</h1>
              <p className="text-white/30 text-sm mt-1">Système de caisse</p>
            </div>

            {loginStep === "choose" ? (
              /* Étape 1 — Choix du profil */
              <div className="space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Choisissez votre profil</p>
                {([
                  { role: "Administrateur" as UserRole, icon: "👑", label: adminName, pin: adminPin },
                  { role: "Partenaire" as UserRole,      icon: "🤝", label: partenaireName, pin: partenairePin },
                ] as { role: UserRole; icon: string; label: string; pin: string }[]).map(({ role, icon, label, pin }) => (
                  <button key={role}
                    onClick={() => {
                      if (!pin) {
                        setUserRole(role); setIsLoggedIn(true)
                      } else {
                        setLoginRole(role); setLoginStep("pin"); setLoginInput(""); setLoginError(false)
                      }
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-white/30">Accès complet{!pin ? " · Pas de PIN" : ""}</p>
                    </div>
                    <span className="text-white/20 group-hover:text-amber-400 transition-colors text-sm">→</span>
                  </button>
                ))}
              </div>
            ) : (
              /* Étape 2 — Saisie PIN */
              <div>
                <button onClick={() => { setLoginStep("choose"); setLoginInput(""); setLoginError(false) }}
                  className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-6 mx-auto transition-colors">
                  ← Retour
                </button>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg">{loginRole === "Administrateur" ? "👑" : "🤝"}</span>
                  <p className="font-semibold">{loginRole === "Administrateur" ? adminName : partenaireName}</p>
                </div>
                <p className="text-white/30 text-xs mb-6">Saisissez votre code PIN</p>
                <div className="flex justify-center gap-3 mb-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                      loginInput.length > i ? "bg-amber-500 border-amber-500" : "border-white/20"
                    }`} />
                  ))}
                </div>
                {loginError && <p className="text-red-400 text-xs mb-4 animate-pulse">Code incorrect</p>}
                <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto">
                  {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
                    k === "" ? <div key={i} /> :
                    <button key={i}
                      onClick={() => {
                        if (k === "⌫") { setLoginInput(p => p.slice(0,-1)); setLoginError(false); return }
                        const next = loginInput + k
                        setLoginInput(next)
                        if (next.length === 4) {
                          const storedHash = loginRole === "Administrateur" ? adminPin : partenairePin
                          // Aucun PIN configuré → accès libre
                          if (!storedHash) {
                            setUserRole(loginRole); setIsLoggedIn(true)
                            setLoginInput(""); setLoginStep("choose")
                            return
                          }
                          hashPin(next).then(inputHash => {
                            if (inputHash === storedHash) {
                              setUserRole(loginRole); setIsLoggedIn(true)
                              setLoginInput(""); setLoginStep("choose")
                            } else {
                              setLoginError(true)
                              setTimeout(() => { setLoginInput(""); setLoginError(false) }, 700)
                            }
                          })
                        }
                      }}
                      className="h-14 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xl transition-all active:scale-95">
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODE TEST BADGE ─────────────────────────────────────────────────────── */}
      {testMode && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-amber-500 text-black text-xs font-black rounded-full shadow-lg tracking-widest pointer-events-none">
          ⚗️ MODE TEST — ventes non comptabilisées
        </div>
      )}

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-12 bg-[#0e0e18] border-b border-white/[0.06]">
        {ticketLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ticketLogo} alt="logo" className="h-7 max-w-[120px] object-contain" />
        ) : (
          <span className="text-sm font-bold text-white">{shopName || "ATM Outillage"}</span>
        )}
        <button onClick={() => setShowMobileMenu(v => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] text-white/70">
          {showMobileMenu ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar overlay mobile */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setShowMobileMenu(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-60 flex-shrink-0 flex flex-col bg-[#0e0e18]
        transform transition-transform duration-200
        md:translate-x-0
        ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo boutique sidebar */}
        {ticketLogo && (
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.04] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ticketLogo} alt="logo" className="h-10 max-w-[140px] object-contain opacity-90" />
          </div>
        )}

        {/* Profil administrateur */}
        <div className={`px-5 py-5 border-b border-white/[0.06] relative ${!ticketLogo ? "" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#18183a] border-2 border-white/20 flex items-center justify-center text-lg">👤</div>
              <div>
                <p className="text-sm font-semibold text-white">{userRole === "Administrateur" ? adminName : partenaireName}</p>
                {shopName && <p className="text-[10px] text-white/30 truncate max-w-[90px]">{shopName}</p>}
              </div>
            </div>
            <button
              onClick={() => setShowAdminMenu(v => !v)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${showAdminMenu ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.08] hover:bg-white/15 text-white/60 hover:text-white"}`}
            >⇄</button>
          </div>

          {/* Dropdown sélecteur de rôle */}
          {showAdminMenu && (
            <div className="absolute left-3 right-3 top-full mt-1 z-30 bg-[#09090f] border border-white/[0.10] rounded-xl shadow-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.06]">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Changer de rôle</p>
              </div>
              {(["Administrateur", "Partenaire"] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => { setUserRole(role); setShowAdminMenu(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors text-left ${
                    userRole === role
                      ? "text-amber-400 bg-amber-500/10 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="text-base">
                    {role === "Administrateur" ? "👑" : "🤝"}
                  </span>
                  {role === "Administrateur" ? adminName : partenaireName}
                  {userRole === role && <span className="ml-auto text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setShowMobileMenu(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                view === item.id
                  ? "bg-white/[0.12] text-white font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black px-1">
                  {item.badge}
                </span>
              )}
              {item.warn && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-amber-400 text-amber-400 text-[9px] font-bold">!</span>
              )}
            </button>
          ))}
        </nav>

        {/* Ma boutique + fond de caisse */}
        <div className="px-4 pb-5 space-y-2">
          <button
            onClick={() => { setShowFondModal(true); setShowMobileMenu(false) }}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/50 transition-all"
          >
            <span>💰 Fond de caisse</span>
            <span className={today && fondDeCaisseDate === today && fondDeCaisse > 0 ? "text-amber-400 font-bold" : "text-white/20"}>
              {today && fondDeCaisseDate === today && fondDeCaisse > 0 ? formatPrice(fondDeCaisse) : "Non défini"}
            </span>
          </button>
          <button
            onClick={() => { setView("vitrine"); setShowMobileMenu(false) }}
            className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              view === "vitrine"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-[#18183a] hover:bg-[#20204a] text-white"
            }`}
          >
            🏪 {shopName || "Ma boutique"}
          </button>
          {/* Déconnexion */}
          <button
            onClick={() => { setIsLoggedIn(false); setLoginStep("choose"); setLoginInput(""); setLoginError(false) }}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 transition-all"
          >
            🔒 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col pt-12 md:pt-0" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        {/* ── ACTIVITÉ (dashboard + commandes) ────────────────────────────────── */}
        {view === "activite" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Onglets */}
            <div className="px-6 pt-5 pb-0 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Activité</h1>
                <p className="text-white/30 text-sm">{today ? new Date(today).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : ""}</p>
              </div>
              <div className="flex gap-1">
                {(["stats", "commandes"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiviteTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                      activiteTab === tab ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
                    }`}>
                    {tab === "stats" ? "📊 Statistiques" : `📋 Commandes${orders.filter(o => o.status === "en cours" || o.status === "prêt").length > 0 ? ` (${orders.filter(o => o.status === "en cours" || o.status === "prêt").length})` : ""}`}
                  </button>
                ))}
              </div>
            </div>
          <div className="flex-1 overflow-y-auto p-6">
            {activiteTab === "stats" && <div className="max-w-5xl mx-auto">

              {/* Filtre dates + Export */}
              <div className="flex items-center justify-between mb-6 gap-3">
                {/* Filtres scrollable sur mobile */}
                <div className="flex-1 min-w-0 overflow-x-auto">
                  <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 w-max">
                    {([
                      { id: "today", label: "Aujourd'hui" },
                      { id: "week",  label: "Semaine" },
                      { id: "month", label: "Mois" },
                      { id: "all",   label: "Tout" },
                    ] as const).map(f => (
                      <button key={f.id} onClick={() => setDateFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                          dateFilter === f.id ? "bg-amber-500 text-black" : "text-white/40 hover:text-white"
                        }`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton Export */}
                <div className="relative flex-shrink-0">
                  <button onClick={() => setShowExportMenu(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-xs font-semibold transition-all whitespace-nowrap">
                    📥 <span className="hidden sm:inline">Exporter</span> <span className="text-white/40">▾</span>
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-[#1a1a35] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
                      {[
                        { label: "🗓 Clôture du jour",          fn: exportJournalier },
                        { label: "📄 Ventes (détail)",         fn: exportVentes },
                        { label: "📦 Par article",              fn: exportParArticle },
                        { label: "🗂 Par catégorie",            fn: exportParCategorie },
                        { label: "💳 Par moyen de paiement",   fn: exportParPaiement },
                        { label: "🏷 Remises appliquées",      fn: exportRemises },
                      ].map(item => (
                        <button key={item.label} onClick={item.fn}
                          className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-white/[0.08] transition-colors border-b border-white/[0.06] last:border-0 text-white/80 hover:text-white">
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Chiffre d'affaires",  value: formatPrice(filteredRevenue),   sub: `${deliveredFiltered.length} commandes livrées`, color: "text-cyan-400", icon: "💰" },
                  { label: "Ticket moyen",         value: formatPrice(filteredAvgTicket), sub: deliveredFiltered.length > 0 ? `sur ${deliveredFiltered.length} vente(s)` : "Pas encore de ventes", color: "text-amber-400", icon: "🧾" },
                  { label: "Produits en stock",    value: products.filter(p => p.stock > 0).length.toString(), sub: `${outOfStockProducts.length} épuisé(s)`, color: "text-blue-400", icon: "📦" },
                  { label: "Alertes stock",        value: (lowStockProducts.length + outOfStockProducts.length).toString(), sub: "Nécessitent attention", color: "text-amber-400", icon: "⚠" },
                ].map(card => (
                  <div key={card.label} className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs text-white/40">{card.label}</p>
                      <span className="text-xl">{card.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-white/30 mt-1">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Répartition paiements */}
                <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4">
                  <h2 className="text-sm font-semibold mb-4 text-white/70">Paiements</h2>
                  {deliveredFiltered.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-4">Aucune vente</p>
                  ) : (
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map(pm => {
                        const rev = revenueByPayment[pm.id]
                        const total = Object.values(revenueByPayment).reduce((a, b) => a + b, 0)
                        const pct = total > 0 ? (rev / total) * 100 : 0
                        return (
                          <div key={pm.id}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-white/60">{pm.icon} {pm.label}</span>
                              <span className="font-medium">{formatPrice(rev)}</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pm.id === "espèces" ? "bg-cyan-500" :
                                  pm.id === "carte"   ? "bg-blue-500"    : "bg-violet-500"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Dernières commandes */}
                <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4 lg:col-span-2">
                  <h2 className="text-sm font-semibold mb-4 text-white/70">Dernières commandes</h2>
                  {filteredByDate.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-6">Aucune commande sur cette période</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredByDate.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                          <div>
                            <p className="text-sm font-mono font-medium">{o.id}</p>
                            <p className="text-xs text-white/30">{formatTime(o.createdAt)}{o.table ? ` · ${o.table}` : ""}{o.orderedBy ? ` · ${o.orderedBy}` : ""}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={PAYMENT_COLOR[o.paymentMethod]}>{PAYMENT_METHODS.find(p => p.id === o.paymentMethod)?.icon} {o.paymentMethod}</Badge>
                            <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                            <Badge className={STATUS_COLOR[o.status]}>{o.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ventes par heure */}
              {(() => {
                const byHour = Array(24).fill(0)
                deliveredFiltered.forEach(o => { byHour[o.createdAt.getHours()] += o.total })
                const maxVal = Math.max(...byHour, 1)
                const hasData = byHour.some(v => v > 0)
                return (
                  <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-white/70">Ventes par heure</h2>
                      {!hasData && <span className="text-xs text-white/25">Aucune donnée</span>}
                    </div>
                    <div className="flex items-end gap-0.5 h-20">
                      {byHour.map((val, h) => {
                        const pct = (val / maxVal) * 100
                        return (
                          <div key={h} className="flex-1 flex flex-col items-center justify-end gap-0.5 h-full group relative">
                            <div
                              className="w-full rounded-t-sm transition-all duration-300 bg-amber-500/60 group-hover:bg-amber-400"
                              style={{ height: val > 0 ? `${Math.max(pct, 4)}%` : "2px", opacity: val > 0 ? 1 : 0.15 }}
                            />
                            {val > 0 && (
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#09090f] border border-white/10 rounded px-1.5 py-0.5 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {h}h — {formatPrice(val)}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {[0, 6, 12, 18, 23].map(h => (
                        <span key={h} className="text-[9px] text-white/20">{h}h</span>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Top produits */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4">
                <h2 className="text-sm font-semibold mb-4 text-white/70">Produits populaires</h2>
                {filteredByDate.filter(o => o.status !== "annulé").length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-6">Pas encore de ventes sur cette période</p>
                ) : (() => {
                  const counts: Record<string, { name: string; qty: number; revenue: number }> = {}
                  filteredByDate.filter(o => o.status !== "annulé").forEach(o =>
                    o.items.forEach(item => {
                      if (!counts[item.productId]) counts[item.productId] = { name: item.name, qty: 0, revenue: 0 }
                      counts[item.productId].qty     += item.quantity
                      counts[item.productId].revenue += item.quantity * item.unitPrice
                    })
                  )
                  return (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 6).map((p, i) => (
                        <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                          <span className="text-xs font-bold text-white/20 w-4">#{i + 1}</span>
                          <span className="flex-1 text-sm truncate">{p.name}</span>
                          <div className="text-right">
                            <p className="text-xs text-white/40">{p.qty} vendus</p>
                            <p className="text-xs font-medium text-cyan-400">{formatPrice(p.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>

              {/* Statistiques par vendeur */}
              {(() => {
                const byVendeur: Record<string, { ca: number; count: number }> = {}
                deliveredFiltered.forEach(o => {
                  const who = o.orderedBy ?? "Inconnu"
                  if (!byVendeur[who]) byVendeur[who] = { ca: 0, count: 0 }
                  byVendeur[who].ca    += o.total
                  byVendeur[who].count += 1
                })
                const entries = Object.entries(byVendeur).sort((a, b) => b[1].ca - a[1].ca)
                const totalCA = entries.reduce((s, [, v]) => s + v.ca, 0)
                return (
                  <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4 mt-6">
                    <h2 className="text-sm font-semibold mb-4 text-white/70">📊 Statistiques par vendeur</h2>
                    {entries.length === 0 ? (
                      <p className="text-white/30 text-sm text-center py-4">Aucune vente sur cette période</p>
                    ) : (
                      <div className="space-y-3">
                        {entries.map(([name, { ca, count }]) => {
                          const pct = totalCA > 0 ? (ca / totalCA) * 100 : 0
                          const avg = count > 0 ? ca / count : 0
                          return (
                            <div key={name}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-medium text-white/80">👤 {name}</span>
                                <div className="flex items-center gap-3 text-white/40">
                                  <span>{count} vente{count > 1 ? "s" : ""}</span>
                                  <span className="text-white/20">·</span>
                                  <span>moy. {formatPrice(avg)}</span>
                                  <span className="text-white/20">·</span>
                                  <span className="font-bold text-cyan-400">{formatPrice(ca)}</span>
                                </div>
                              </div>
                              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-amber-500/70 transition-all" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>}

            {/* Onglet Commandes */}
            {activiteTab === "commandes" && (
              <div className="flex-1 overflow-y-auto">
                {/* CA total + filtres */}
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                  <p className="text-4xl font-black tracking-tight mb-5">{formatPrice(totalCAFiltre)}</p>
                  <div className="flex gap-2 flex-wrap">
                    {/* Filtre période */}
                    {([["7j", "📅 Les 7 derniers jours"], ["tout", "📅 Tout"]] as [typeof activitePeriod, string][]).map(([val, label]) => (
                      <button key={val} onClick={() => setActivitePeriod(val)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activitePeriod === val ? "bg-white/10 border-white/20 text-white" : "border-white/[0.08] text-white/40 hover:text-white/70"}`}>
                        {label}
                      </button>
                    ))}
                    {/* Filtre statut */}
                    {(["tout", "livré", "en cours", "prêt", "annulé"] as typeof activiteStatus[]).map(s => (
                      <button key={s} onClick={() => setActiviteStatus(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${activiteStatus === s ? "bg-white/10 border-white/20 text-white" : "border-white/[0.08] text-white/40 hover:text-white/70"}`}>
                        {s === "tout" ? "Tous statuts" : s}
                      </button>
                    ))}
                  </div>
                  {/* Barre de recherche */}
                  <div className="relative mt-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                    <input type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Rechercher par n° ou client..."
                      className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/40 transition-colors" />
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <span className="text-5xl mb-4">📋</span>
                    <p className="text-white/40">Aucune commande sur cette période</p>
                  </div>
                ) : (
                  <div className="px-4 pb-8 max-w-4xl mx-auto">
                    {Object.entries(ordersByDay).map(([day, dayOrders]) => (
                      <div key={day} className="mt-6">
                        {/* En-tête du jour */}
                        <p className="text-xs font-black tracking-widest text-white/50 mb-3 px-1">{day}</p>
                        <div className="space-y-2">
                          {dayOrders.map(order => {
                            const payIcon = order.paymentMethod === "espèces" ? "💵" : order.paymentMethod === "carte" ? "💳" : "🏦"
                            const isExpanded = false
                            return (
                              <div key={order.id} className="bg-[#12121f] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                                {/* Ligne principale */}
                                <div className="flex items-center gap-3 px-4 py-3.5">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${order.paymentMethod === "espèces" ? "bg-emerald-500/10" : "bg-cyan-500/10"}`}>
                                    {payIcon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold leading-tight">{formatPrice(order.total)}</p>
                                    <p className="text-xs text-white/40 mt-0.5">
                                      {formatTime(order.createdAt)} · {order.id}
                                      {order.table ? ` · ${order.table}` : ""}
                                      {order.orderedBy ? ` · 👤 ${order.orderedBy}` : ""}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge className={STATUS_COLOR[order.status]}>{order.status}</Badge>
                                  </div>
                                </div>
                                {/* Articles */}
                                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                  {order.items.map(item => (
                                    <span key={item.productId} className="text-[11px] bg-white/[0.04] px-2 py-0.5 rounded-md text-white/50">{item.quantity}× {item.name}</span>
                                  ))}
                                </div>
                                {order.comment && (
                                  <p className="text-xs text-white/30 italic px-4 pb-2">💬 "{order.comment}"</p>
                                )}
                                {/* Actions */}
                                {(order.status !== "annulé" && order.status !== "remboursé" && !order.isRefund) || !order.isRefund ? (
                                  <div className="px-4 pb-3 flex gap-2 flex-wrap border-t border-white/[0.04] pt-2 mt-1">
                                    {STATUS_NEXT[order.status] && !order.isRefund && (
                                      <button onClick={() => advanceOrder(order.id)} className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-all">
                                        → {STATUS_NEXT[order.status]}
                                      </button>
                                    )}
                                    {order.status === "livré" && !order.isRefund && (
                                      <button onClick={() => { setRefundModal({ orderId: order.id, total: order.total }); setRefundReason("Vente annulée") }}
                                        className="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium transition-all">
                                        ↩ Rembourser
                                      </button>
                                    )}
                                    {order.status !== "livré" && order.status !== "annulé" && order.status !== "remboursé" && !order.isRefund && (
                                      <button onClick={() => cancelOrder(order.id)} className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all">Annuler</button>
                                    )}
                                    {!order.isRefund && (
                                      <button onClick={() => { setReceiptOrder(order); setReceiptIsDuplicate(true) }}
                                        className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/30 hover:text-white/60 text-xs transition-all">
                                        🖨 Duplicata
                                      </button>
                                    )}
                                    {order.isRefund && order.refundReason && (
                                      <p className="text-xs text-purple-400/60">↩ {order.refundReason}</p>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        )}

        {/* ── VENDRE ──────────────────────────────────────────────────────────── */}
        {view === "vendre" && (
          <div className="flex-1 overflow-hidden flex">
            {/* Products grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header + filtres */}
              <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] bg-[#0e0e18]/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Vendre</h1>
                  {/* Onglets Produits / Formules */}
                  <div className="flex bg-white/[0.06] rounded-lg p-0.5">
                    <button onClick={() => setFormulaTab("produits")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formulaTab === "produits" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"}`}>
                      Produits
                    </button>
                    <button onClick={() => setFormulaTab("formules")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${formulaTab === "formules" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"}`}>
                      Formules
                      {formulas.length > 0 && <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${formulaTab === "formules" ? "bg-black/20" : "bg-amber-500/80 text-black"}`}>{formulas.length}</span>}
                    </button>
                  </div>
                </div>
                {/* Barre de recherche */}
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">✕</button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["Tout", ...categories].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        categoryFilter === cat
                          ? "bg-amber-500 text-black"
                          : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Formules */}
              {formulaTab === "formules" && (
                <div className="flex-1 overflow-y-auto p-5">
                  {formulas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <span className="text-5xl mb-3 opacity-20">📦</span>
                      <p className="text-white/40 font-medium">Aucune formule créée</p>
                      <p className="text-white/20 text-sm mt-1">Créez des packs depuis la section Catalogue</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {formulas.map(formula => {
                        const autoPrice = formula.items.reduce((s, { productId, qty }) => {
                          const p = products.find(x => x.id === productId)
                          return s + (p ? p.price * qty : 0)
                        }, 0)
                        const price = formula.customPrice ?? autoPrice
                        const available = formula.items.every(({ productId, qty }) => {
                          const p = products.find(x => x.id === productId)
                          return p && p.stock >= qty
                        })
                        return (
                          <button key={formula.id}
                            disabled={!available}
                            onClick={() => addFormulaToCart(formula)}
                            className={`relative flex flex-col overflow-hidden rounded-xl border text-left transition-all p-0 ${
                              available ? "border-white/[0.08] hover:border-amber-500/50 bg-[#12121f] hover:bg-[#141430]" : "border-white/[0.04] bg-[#0e0e1c] opacity-50 cursor-not-allowed"
                            }`}>
                            <div className="w-full h-24 bg-[#0e0e18] flex items-center justify-center text-4xl">
                              {formula.emoji}
                            </div>
                            <div className="p-3 flex-1">
                              <p className="text-sm font-bold leading-tight mb-1">{formula.name}</p>
                              {formula.description && <p className="text-[11px] text-white/40 mb-2 line-clamp-1">{formula.description}</p>}
                              <p className="text-xs text-white/30 mb-2">
                                {formula.items.length} produit{formula.items.length > 1 ? "s" : ""}
                                {formula.customPrice !== undefined && autoPrice > formula.customPrice && (
                                  <span className="ml-1 line-through text-white/20">{formatPrice(autoPrice)}</span>
                                )}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-black text-amber-400">{formatPrice(price)}</span>
                                {!available && <span className="text-[10px] text-red-400 font-semibold">Stock insuffisant</span>}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Grid Produits */}
              {formulaTab === "produits" && <div className={`flex-1 overflow-y-auto p-5 ${cartItems.length > 0 ? "pb-28 md:pb-5" : ""}`}>
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="text-5xl mb-3 opacity-30">🔍</span>
                    <p className="text-white/40">Aucun produit trouvé</p>
                    <p className="text-white/20 text-sm mt-1">Essayez un autre terme ou catégorie</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                    {filteredProducts.map(product => {
                      const inCart = cart[product.id] ?? 0
                      const isOutOfStock = product.stock === 0
                      const isLow = product.stock > 0 && product.stock <= product.alertThreshold
                      const selected = inCart > 0
                      return (
                        <div key={product.id}
                          className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                            selected ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent hover:border-white/20"
                          } ${isOutOfStock ? "opacity-40 pointer-events-none" : ""}`}
                          onClick={() => {
                            if (isOutOfStock) return
                            if (!selected) addToCart(product.id)
                            else setCart(prev => { const { [product.id]: _, ...rest } = prev; return rest })
                          }}
                        >
                          {/* Image */}
                          <div className="aspect-[4/3] bg-[#12121f]">
                            {product.image
                              ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">{product.emoji}</div>}
                            {isLow && !isOutOfStock && (
                              <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/90 text-black font-bold">Stock bas</span>
                            )}
                          </div>
                          {/* Nom + prix */}
                          <div className={`px-2 py-1.5 text-center ${selected ? "bg-amber-500/10" : "bg-[#0e0e18]"}`}>
                            <p className="text-[11px] font-semibold leading-tight line-clamp-2 text-white">{product.name}</p>
                            <p className="text-[10px] font-bold text-amber-400 mt-0.5">
                              {product.promoPercent && product.promoPercent > 0
                                ? formatPrice(product.price * (1 - product.promoPercent / 100))
                                : product.variablePrice ? "Prix libre" : formatPrice(product.price)}
                            </p>
                          </div>
                          {/* Badge sélection + qty */}
                          {selected && (
                            <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1.5"
                              onClick={e => e.stopPropagation()}>
                              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                <span className="text-[10px] font-black text-black">✓</span>
                              </div>
                              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                                <button
                                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                  onClick={() => setCart(prev => {
                                    const n = (prev[product.id] ?? 1) - 1
                                    if (n <= 0) { const { [product.id]: _, ...rest } = prev; return rest }
                                    return { ...prev, [product.id]: n }
                                  })}>−</button>
                                <span className="text-xs font-bold text-white min-w-[16px] text-center">{inCart}</span>
                                <button
                                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                  onClick={() => setCart(prev => ({ ...prev, [product.id]: Math.min((prev[product.id] ?? 1) + 1, product.stock) }))}>+</button>
                              </div>
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-xs font-bold text-red-400 bg-black/60 px-2 py-1 rounded-full">Épuisé</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              }
            </div>

            {/* Cart panel — caché sur mobile, visible sur desktop */}
            <aside className="hidden md:flex w-72 flex-shrink-0 flex-col border-l border-white/[0.06] bg-[#0e0e18]">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="font-semibold text-sm text-white/70">Panier en cours</h2>
                <button
                  onClick={() => setShowPendingPanel(v => !v)}
                  className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs text-white/50 hover:text-white transition-all"
                >
                  ⏸ En attente
                  {pendingOrders.length > 0 && (
                    <span className="min-w-[16px] h-4 flex items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black px-1">
                      {pendingOrders.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Panel tickets en attente */}
              {showPendingPanel && (
                <div className="border-b border-white/[0.06] bg-[#09090f]">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Tickets en attente</span>
                    <button onClick={() => setShowPendingPanel(false)} className="text-white/30 hover:text-white/60 text-xs">✕</button>
                  </div>
                  {pendingOrders.length === 0 ? (
                    <p className="text-xs text-white/25 text-center py-4 pb-5">Aucun ticket en attente</p>
                  ) : (
                    <div className="px-3 pb-3 space-y-1.5 max-h-52 overflow-y-auto">
                      {pendingOrders.map(p => (
                        <button
                          key={p.id}
                          onClick={() => resumePendingOrder(p)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/[0.04] transition-all text-left group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {p.tableInput || "Sans client"}
                            </p>
                            <p className="text-[10px] text-white/30 mt-0.5">
                              {Object.values(p.items).reduce((a, b) => a + b, 0)} article(s) · {p.savedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-amber-400">{formatPrice(p.subtotal)}</p>
                            <p className="text-[10px] text-amber-400/50 group-hover:text-amber-400 transition-colors">Reprendre →</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Client selector + commentaire */}
              <div className="px-4 py-3 border-b border-white/[0.06] space-y-2">
                {/* Autocomplete client */}
                <div className="relative">
                  <input
                    type="text"
                    value={cartClientSearch || (cartClientId ? (clients.find(c => c.id === cartClientId)?.name ?? "") : "")}
                    onChange={e => {
                      setCartClientSearch(e.target.value)
                      setCartClientId("")
                      setTableInput(e.target.value)
                      setShowCartClientDrop(true)
                    }}
                    onFocus={() => setShowCartClientDrop(true)}
                    onBlur={() => setTimeout(() => setShowCartClientDrop(false), 150)}
                    placeholder="Client / Chantier (optionnel)"
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors pr-7"
                  />
                  {cartClientId && (
                    <button onClick={() => { setCartClientId(""); setCartClientSearch(""); setTableInput("") }}
                      className="absolute right-2 top-2 text-white/30 hover:text-white/60 text-xs">✕</button>
                  )}
                  {showCartClientDrop && clients.length > 0 && (() => {
                    const filtered = clients.filter(c =>
                      c.name.toLowerCase().includes((cartClientSearch || tableInput).toLowerCase())
                    ).slice(0, 5)
                    if (filtered.length === 0) return null
                    return (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#0e0e18] border border-white/[0.12] rounded-xl overflow-hidden shadow-xl">
                        {filtered.map(c => (
                          <button key={c.id} onMouseDown={() => {
                            setCartClientId(c.id)
                            setCartClientSearch("")
                            setTableInput(c.name)
                            setShowCartClientDrop(false)
                          }} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/[0.06] text-left transition-colors">
                            <span className="text-lg">👤</span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{c.name}</p>
                              {c.phone && <p className="text-xs text-white/30">{c.phone}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  })()}
                </div>
                <textarea
                  value={cartComment}
                  onChange={e => setCartComment(e.target.value)}
                  placeholder="Commentaire (optionnel)"
                  rows={2}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                />
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="text-4xl mb-3">🛒</span>
                    <p className="text-white/30 text-sm">Panier vide</p>
                    <p className="text-white/20 text-xs mt-1">Cliquez sur un produit pour l'ajouter</p>
                  </div>
                ) : (
                  cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-2 bg-white/[0.04] rounded-lg p-2.5">
                      <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.05]">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-base">{product.emoji}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{product.name}</p>
                        <p className="text-xs text-white/30">
                          {formatPrice(cartPrices[product.id] ?? product.price)} / u.
                          {product.variablePrice && <span className="ml-1 text-amber-400/60">✎</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-6 h-6 rounded-md bg-white/[0.08] hover:bg-white/15 text-xs flex items-center justify-center transition-colors"
                        >−</button>
                        <span className="text-sm font-bold w-5 text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={qty >= product.stock}
                          className="w-6 h-6 rounded-md bg-white/[0.08] hover:bg-white/15 text-xs flex items-center justify-center transition-colors disabled:opacity-30"
                        >+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total + remise + action */}
              {cartItems.length > 0 && (
                <div className="px-4 py-4 border-t border-white/[0.06] space-y-3">
                  {/* Remise */}
                  <div className="bg-white/[0.03] rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-white/40">Remise</span>
                      {/* Toggle % / € */}
                      <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
                        <button
                          onClick={() => { setDiscountType("percent"); setDiscountValue(0) }}
                          className={`px-3 py-1 text-[11px] font-medium transition-all ${discountType === "percent" ? "bg-amber-500 text-black" : "text-white/40 hover:text-white/70"}`}
                        >%</button>
                        <button
                          onClick={() => { setDiscountType("fixed"); setDiscountValue(0) }}
                          className={`px-3 py-1 text-[11px] font-medium transition-all ${discountType === "fixed" ? "bg-amber-500 text-black" : "text-white/40 hover:text-white/70"}`}
                        >€</button>
                      </div>
                    </div>

                    {discountType === "percent" ? (
                      <div className="flex items-center gap-1">
                        {[0, 5, 10, 15, 20].map(p => (
                          <button
                            key={p}
                            onClick={() => setDiscountValue(p)}
                            className={`flex-1 h-6 rounded text-[10px] font-medium transition-all ${
                              discountValue === p
                                ? "bg-amber-500 text-black"
                                : "bg-white/[0.06] text-white/40 hover:bg-white/12"
                            }`}
                          >
                            {p === 0 ? "—" : `${p}%`}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={discountValue || ""}
                          onChange={e => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                          placeholder="0,00"
                          className="flex-1 bg-white/[0.06] border border-white/[0.10] rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 text-right"
                        />
                        <span className="text-white/40 text-sm font-medium">€</span>
                        {discountValue > 0 && (
                          <button onClick={() => setDiscountValue(0)} className="text-white/30 hover:text-white/60 text-xs">✕</button>
                        )}
                      </div>
                    )}

                    {discountValue > 0 && (
                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-white/30">Sous-total</span>
                        <span className="text-white/40 line-through">{formatPrice(cartSubtotal)}</span>
                      </div>
                    )}
                    {discountValue > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-cyan-400">
                          Économie {discountType === "percent" ? `(${discountValue}%)` : ""}
                        </span>
                        <span className="text-cyan-400">−{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Total HT</span>
                      <span className="text-white/60">{formatPrice(cartHT)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">TVA</span>
                      <span className="text-white/60">{formatPrice(cartTVA)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                      <span className="text-sm text-white/50">Total TTC</span>
                      <span className="text-xl font-bold text-amber-400">{formatPrice(cartTTC)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs text-white/50 hover:text-white transition-all"
                    >
                      Vider
                    </button>
                    <button
                      onClick={holdCart}
                      className="py-2 px-3 rounded-lg bg-white/[0.07] hover:bg-white/12 text-xs text-white/60 hover:text-white transition-all"
                      title="Mettre en attente"
                    >
                      ⏸
                    </button>
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-sm font-bold text-black transition-colors shadow-lg shadow-amber-500/20"
                    >
                      Encaisser
                    </button>
                  </div>
                </div>
              )}
            </aside>

            {/* ── BARRE PANIER MOBILE (cachée sur desktop) ── */}
            {cartItems.length > 0 && (
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-[#09090f] to-transparent">
                <button
                  onClick={() => setShowMobileCart(true)}
                  className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-sm font-black">
                      {cartItems.reduce((s, i) => s + i.qty, 0)}
                    </span>
                    <span className="font-bold text-sm">Voir le panier</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-base">{formatPrice(cartTTC)} TTC</div>
                    <div className="text-[11px] font-medium opacity-70">HT {formatPrice(cartHT)}</div>
                  </div>
                </button>
              </div>
            )}

            {/* ── BOTTOM SHEET PANIER MOBILE ── */}
            {showMobileCart && (
              <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileCart(false)} />
                {/* Sheet */}
                <div className="relative bg-[#0e0e18] rounded-t-3xl flex flex-col max-h-[85vh] shadow-2xl">
                  {/* Poignée */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                  </div>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                    <h2 className="font-bold text-base">Panier</h2>
                    <button onClick={() => setShowMobileCart(false)} className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white/50 text-sm">✕</button>
                  </div>
                  {/* Articles */}
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                    {cartItems.map(({ product, qty }) => (
                      <div key={product.id} className="flex items-center gap-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-white/40">{formatPrice(cartPrices[product.id] ?? product.price)} / u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { if (qty <= 1) { setCart(c => { const n = {...c}; delete n[product.id]; return n }) } else { setCart(c => ({...c, [product.id]: qty - 1})) } }} className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/15 flex items-center justify-center text-sm font-bold transition-colors">−</button>
                          <span className="w-6 text-center text-sm font-bold">{qty}</span>
                          <button onClick={() => setCart(c => ({...c, [product.id]: qty + 1}))} className="w-7 h-7 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 flex items-center justify-center text-sm font-bold transition-colors">+</button>
                        </div>
                        <span className="text-sm font-bold text-amber-400 w-20 text-right">{formatPrice((cartPrices[product.id] ?? product.price) * qty)}</span>
                      </div>
                    ))}
                  </div>
                  {/* Total + bouton valider */}
                  <div className="px-5 py-4 border-t border-white/[0.06] space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Total HT</span>
                        <span className="text-white/60">{formatPrice(cartHT)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">TVA</span>
                        <span className="text-white/60">{formatPrice(cartTVA)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                        <span className="text-white/50 text-sm">Total TTC</span>
                        <span className="text-xl font-black text-amber-400">{formatPrice(cartTTC)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { holdCart(); setShowMobileCart(false) }}
                        className="py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-sm font-semibold text-white/60 transition-colors">
                        ⏸ Mettre en attente
                      </button>
                      <button
                        onClick={() => { setShowMobileCart(false); setShowPayModal(true) }}
                        className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors">
                        ✓ Valider
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMMANDES ───────────────────────────────────────────────────────── */}
        {/* ── CLIENTS ──────────────────────────────────────────────────────────── */}
        {view === "clients" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl font-bold">Clients</h1>
                  <p className="text-white/40 text-sm">{clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => { setClientFormMode("add"); setClientFormName(""); setClientFormPhone(""); setClientFormEmail(""); setClientFormNotes(""); setSelectedClient(null) }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors">
                  + Nouveau client
                </button>
              </div>
              <input type="text" value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                placeholder="Rechercher par nom, téléphone..."
                className="w-full max-w-xs bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Form add/edit */}
              {clientFormMode && (
                <div className="mb-6 bg-[#12121f] border border-amber-500/30 rounded-xl p-5">
                  <h3 className="font-semibold mb-4 text-amber-400">{clientFormMode === "add" ? "Nouveau client" : "Modifier le client"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Nom *", value: clientFormName, set: setClientFormName, placeholder: "Jean Dupont" },
                      { label: "Téléphone", value: clientFormPhone, set: setClientFormPhone, placeholder: "+33 6 00 00 00 00" },
                      { label: "Email", value: clientFormEmail, set: setClientFormEmail, placeholder: "jean@email.com" },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs text-white/40 mb-1">{f.label}</label>
                        <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                          className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-white/40 mb-1">Notes</label>
                      <textarea value={clientFormNotes} onChange={e => setClientFormNotes(e.target.value)} rows={2} placeholder="Notes internes..."
                        className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 resize-none" />
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <button onClick={() => {
                        if (!clientFormName.trim()) return
                        if (clientFormMode === "add") {
                          const nc: Client = { id: `c${Date.now()}`, name: clientFormName.trim(), phone: clientFormPhone.trim() || undefined, email: clientFormEmail.trim() || undefined, notes: clientFormNotes.trim() || undefined, createdAt: new Date() }
                          setClients(prev => [nc, ...prev])
                        } else if (selectedClient) {
                          setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, name: clientFormName.trim(), phone: clientFormPhone.trim() || undefined, email: clientFormEmail.trim() || undefined, notes: clientFormNotes.trim() || undefined } : c))
                          setSelectedClient(prev => prev ? { ...prev, name: clientFormName.trim(), phone: clientFormPhone.trim() || undefined, email: clientFormEmail.trim() || undefined, notes: clientFormNotes.trim() || undefined } : prev)
                        }
                        setClientFormMode(null)
                      }}
                        className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors">
                        {clientFormMode === "add" ? "Ajouter" : "Enregistrer"}
                      </button>
                      <button onClick={() => setClientFormMode(null)}
                        className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/50 text-sm transition-colors">
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Detail client */}
              {selectedClient && !clientFormMode && (() => {
                const clientOrders = orders.filter(o => o.clientId === selectedClient.id)
                const ca = clientOrders.filter(o => o.status === "livré").reduce((s, o) => s + o.total, 0)
                return (
                  <div className="mb-6 bg-[#12121f] border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{selectedClient.name}</h3>
                        {selectedClient.phone && <p className="text-sm text-white/50 mt-0.5">📞 {selectedClient.phone}</p>}
                        {selectedClient.email && <p className="text-sm text-white/50">✉️ {selectedClient.email}</p>}
                        {selectedClient.notes && <p className="text-xs text-white/30 mt-2 italic">{selectedClient.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setClientFormMode("edit"); setClientFormName(selectedClient.name); setClientFormPhone(selectedClient.phone ?? ""); setClientFormEmail(selectedClient.email ?? ""); setClientFormNotes(selectedClient.notes ?? "") }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white/60 transition-colors">✏️ Modifier</button>
                        <button onClick={() => setSelectedClient(null)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white/40 transition-colors">✕</button>
                      </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                        <p className="text-2xl font-black text-amber-400">{formatPrice(ca)}</p>
                        <p className="text-xs text-white/40 mt-0.5">CA total</p>
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                        <p className="text-2xl font-black">{clientOrders.length}</p>
                        <p className="text-xs text-white/40 mt-0.5">commande{clientOrders.length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    {clientOrders.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-white/40 font-semibold">Historique des commandes ({clientOrders.length})</p>
                          {clientOrders.length > 0 && (
                            <span className="text-xs text-white/30">Ticket moyen : <span className="text-amber-400 font-medium">{formatPrice(clientOrders.filter(o => o.status === "livré").length > 0 ? ca / clientOrders.filter(o => o.status === "livré").length : 0)}</span></span>
                          )}
                        </div>
                        {clientOrders.map(o => (
                          <div key={o.id} className="rounded-lg bg-white/[0.03] border border-white/[0.04] overflow-hidden">
                            <div className="flex items-center justify-between p-2.5 text-sm">
                              <div>
                                <span className="font-medium text-xs font-mono">{o.id}</span>
                                <span className="text-white/30 text-xs ml-2">{o.createdAt.toLocaleDateString("fr-FR")} {o.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                                {o.orderedBy && <span className="text-white/20 text-xs ml-2">· 👤 {o.orderedBy}</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={STATUS_COLOR[o.status]}>{o.status}</Badge>
                                <span className="font-bold text-amber-400">{formatPrice(o.total)}</span>
                              </div>
                            </div>
                            <div className="px-2.5 pb-2.5 flex flex-wrap gap-1">
                              {o.items.map(item => (
                                <span key={item.productId} className="text-[11px] bg-white/[0.04] px-2 py-0.5 rounded-md text-white/40">{item.quantity}× {item.name} <span className="text-white/20">({formatPrice(item.unitPrice)})</span></span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-white/20 text-center py-2">Aucune commande liée à ce client</p>}
                  </div>
                )
              })()}

              {/* Liste clients */}
              {clients.filter(c => clientSearch === "" || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || (c.phone && c.phone.includes(clientSearch))).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-5xl mb-3 opacity-20">👥</span>
                  <p className="text-white/40 font-medium">Aucun client</p>
                  <p className="text-white/20 text-sm mt-1">Ajoutez votre premier client</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {clients
                    .filter(c => clientSearch === "" || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || (c.phone && c.phone.includes(clientSearch)))
                    .map(c => {
                      const cOrders = orders.filter(o => o.clientId === c.id)
                      const cCA = cOrders.filter(o => o.status === "livré").reduce((s, o) => s + o.total, 0)
                      return (
                        <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12121f] border border-white/[0.06] hover:border-amber-500/20 transition-all cursor-pointer"
                          onClick={() => setSelectedClient(c)}>
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-lg flex-shrink-0">
                            {c.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{c.name}</p>
                            <p className="text-xs text-white/40 mt-0.5">
                              {c.phone && <span>{c.phone} · </span>}{cOrders.length} commande{cOrders.length > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-amber-400 text-sm">{formatPrice(cCA)}</p>
                            <p className="text-xs text-white/30">CA total</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); if (confirm(`Supprimer ${c.name} ?`)) setClients(prev => prev.filter(x => x.id !== c.id)) }}
                            className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-xs text-red-400 transition-colors flex-shrink-0">🗑</button>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CATALOGUE ────────────────────────────────────────────────────────── */}
        {view === "catalogue" && (
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {/* Drawer latéral — slide depuis la droite */}
            <div
              className="absolute inset-y-0 right-0 z-30 flex flex-col bg-[#0e0e1a] border-l border-amber-500/30 shadow-2xl transition-transform duration-300 ease-in-out"
              style={{ width: "min(420px, 100%)", transform: (catAddMode || catEditProduct) ? "translateX(0)" : "translateX(100%)" }}
            >
              {(catAddMode || catEditProduct) && (
                <CatForm
                  products={products}
                  setProducts={setProducts}
                  editProduct={catEditProduct}
                  onClose={() => { setCatAddMode(false); setCatEditProduct(null) }}
                  taxes={taxes}
                  suppliers={suppliers}
                  categories={categories}
                />
              )}
            </div>
            {/* Backdrop semi-transparent sur mobile */}
            {(catAddMode || catEditProduct) && (
              <div
                className="absolute inset-0 z-20 bg-black/40 sm:hidden"
                onClick={() => { setCatAddMode(false); setCatEditProduct(null) }}
              />
            )}
            <div className="px-3 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-lg sm:text-xl font-bold">Catalogue</h1>
                <button onClick={() => { setCatAddMode(true); setCatEditProduct(null) }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors">
                  + Nouveau produit
                </button>
              </div>
              <input type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full max-w-xs bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-[#12121f] border border-white/[0.06] rounded-xl overflow-x-auto">
                  <table className="w-full text-sm min-w-[400px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-white/40 text-xs">
                        <th className="px-3 py-3 text-left">Produit</th>
                        <th className="px-3 py-3 text-left hidden sm:table-cell">Catégorie</th>
                        <th className="px-3 py-3 text-right">Prix HT / TTC</th>
                        <th className="px-3 py-3 text-right">Stock</th>
                        <th className="px-3 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => !catSearch || p.name.toLowerCase().includes(catSearch.toLowerCase())).map(product => (
                        <tr key={product.id} onClick={() => { setCatEditProduct(product); setCatAddMode(false) }} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] cursor-pointer transition-colors">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                                {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-base opacity-40">{product.emoji}</div>}
                              </div>
                              <span className="font-medium text-xs sm:text-sm leading-tight">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-white/40 text-xs hidden sm:table-cell">{product.category}</td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <span className="block font-medium text-amber-400 text-xs sm:text-sm">{formatPrice(product.price)} <span className="text-white/30 font-normal">HT</span></span>
                            <span className="block text-[11px] text-white/40">{formatPrice(product.price * 1.2)} TTC</span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span className={`font-bold text-xs sm:text-sm ${product.stock === 0 ? "text-red-400" : product.stock <= product.alertThreshold ? "text-amber-400" : "text-cyan-400"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setFavorites(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id])}
                                className={`text-xs px-2 py-1 rounded-md transition-all ${favorites.includes(product.id) ? "bg-yellow-500/20 text-yellow-400" : "bg-white/[0.05] text-white/30 hover:text-yellow-400"}`}
                                title={favorites.includes(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>
                                {favorites.includes(product.id) ? "⭐" : "☆"}
                              </button>
                              <button onClick={e => { e.stopPropagation(); setCatEditProduct(product); setCatAddMode(false) }}
                                className="text-xs px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/12 text-white/50 hover:text-white transition-all">
                                ✏️ Modifier
                              </button>
                              <button onClick={e => { e.stopPropagation(); setProducts(prev => prev.filter(p => p.id !== product.id)) }}
                                className="text-xs px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES INTERNES ───────────────────────────────────────────────────── */}
        {view === "notes" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
              <h1 className="text-xl font-bold">Notes internes</h1>
              <p className="text-white/40 text-sm">Visibles par tous les utilisateurs connectés</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Saisie nouvelle note */}
              <div className="mb-6 bg-[#12121f] border border-white/[0.06] rounded-xl p-4">
                <textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && noteInput.trim()) {
                      const note: InternalNote = {
                        id: `n${Date.now()}`,
                        text: noteInput.trim(),
                        author: userRole === "Administrateur" ? adminName : partenaireName,
                        createdAt: new Date(),
                      }
                      setInternalNotes(prev => [note, ...prev])
                      setNoteInput("")
                    }
                  }}
                  placeholder="Écris une note... (Ctrl+Entrée pour valider)"
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!noteInput.trim()) return
                      const note: InternalNote = {
                        id: `n${Date.now()}`,
                        text: noteInput.trim(),
                        author: userRole === "Administrateur" ? adminName : partenaireName,
                        createdAt: new Date(),
                      }
                      setInternalNotes(prev => [note, ...prev])
                      setNoteInput("")
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors">
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* Liste des notes */}
              {internalNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-5xl mb-3 opacity-20">📝</span>
                  <p className="text-white/40 font-medium">Aucune note</p>
                  <p className="text-white/20 text-sm mt-1">Laisse un message à ton partenaire</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...internalNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(note => (
                    <div key={note.id} className={`bg-[#12121f] border rounded-xl p-4 ${note.pinned ? "border-amber-500/30" : "border-white/[0.06]"}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-white/80 whitespace-pre-wrap">{note.text}</p>
                          <p className="text-xs text-white/30 mt-2">
                            👤 {note.author} · {note.createdAt.toLocaleDateString("fr-FR")} {note.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            {note.pinned && <span className="ml-2 text-amber-400">📌 épinglée</span>}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setInternalNotes(prev => prev.map(n => n.id === note.id ? { ...n, pinned: !n.pinned } : n))}
                            className={`text-xs px-2 py-1 rounded-lg transition-colors ${note.pinned ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.04] text-white/30 hover:text-amber-400"}`}
                            title={note.pinned ? "Désépingler" : "Épingler"}>
                            📌
                          </button>
                          <button
                            onClick={() => setInternalNotes(prev => prev.filter(n => n.id !== note.id))}
                            className="text-xs px-2 py-1 rounded-lg bg-white/[0.04] text-white/30 hover:text-red-400 transition-colors"
                            title="Supprimer">
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PARAMÈTRES ───────────────────────────────────────────────────────── */}
        {view === "parametres" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h1 className="text-xl font-bold mb-1">Paramètres</h1>
                <p className="text-white/40 text-sm">Configuration de votre boutique</p>
              </div>

              {/* ── Données & transfert ── */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-white/70">📲 Données & transfert</h2>
                <p className="text-xs text-white/40">Exportez toutes vos données pour les sauvegarder ou les transférer sur un autre appareil.</p>
                <div className="flex gap-3">
                  <button onClick={exportData}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors">
                    ⬇ Exporter (.json)
                  </button>
                  <button onClick={() => importRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-sm font-semibold transition-colors">
                    ⬆ Importer
                  </button>
                  <input ref={importRef} type="file" accept=".json" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { importData(f); e.target.value = "" } }} />
                </div>
                <p className="text-[11px] text-white/25">Le fichier contient produits, commandes, formules et tous les paramètres.</p>
              </div>

              {/* ── Catégories ── */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white/70">🗂 Catégories</h2>
                  <button onClick={() => {
                    const name = prompt("Nom de la nouvelle catégorie :")
                    if (name?.trim()) setCategories(prev => [...prev, name.trim()])
                  }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
                    + Ajouter
                  </button>
                </div>
                <p className="text-xs text-white/40">Renommez ou réorganisez vos catégories de produits.</p>
                <div className="space-y-2">
                  {categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={cat}
                        onFocus={e => { e.target.dataset.oldName = cat }}
                        onChange={e => {
                          const newName = e.target.value
                          setCategories(prev => prev.map((c, j) => j === i ? newName : c))
                        }}
                        onBlur={e => {
                          const oldName = e.target.dataset.oldName
                          const newName = e.target.value.trim()
                          if (newName && oldName && newName !== oldName) {
                            // Renommer la catégorie dans tous les produits existants
                            setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p))
                          }
                        }}
                        className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                      <button onClick={() => {
                        if (!confirm(`Supprimer la catégorie "${cat}" ?`)) return
                        setCategories(prev => prev.filter((_, j) => j !== i))
                      }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all text-sm">
                        ✕
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-xs text-white/30 text-center py-2">Aucune catégorie. Ajoutez-en une ci-dessus.</p>
                  )}
                </div>
              </div>

              {/* ── Formules ── */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white/70">📦 Formules & packs</h2>
                  <button onClick={() => setFormulaModal("new")}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
                    + Nouvelle formule
                  </button>
                </div>
                {formulas.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-3">Aucune formule. Créez des packs de produits vendus ensemble.</p>
                ) : (
                  <div className="space-y-2">
                    {formulas.map(f => {
                      const autoPrice = f.items.reduce((s, { productId, qty }) => {
                        const p = products.find(x => x.id === productId)
                        return s + (p ? p.price * qty : 0)
                      }, 0)
                      return (
                        <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <span className="text-xl flex-shrink-0">{f.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{f.name}</p>
                            <p className="text-xs text-white/40">{f.items.length} produit{f.items.length > 1 ? "s" : ""} — {formatPrice(f.customPrice ?? autoPrice)}</p>
                          </div>
                          <button onClick={() => setFormulaModal(f)}
                            className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-xs transition-colors">✏️</button>
                          <button onClick={() => setFormulas(prev => prev.filter(x => x.id !== f.id))}
                            className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-xs text-red-400 transition-colors">🗑</button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Infos boutique */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-white/70">🏪 Informations boutique</h2>
                {([
                  { label: "Nom de la boutique", value: shopName, set: setShopName, placeholder: "ATM Outillage" },
                  { label: "Sous-titre / activité", value: shopSubtitle, set: setShopSubtitle, placeholder: "Vente de matériel & outillage" },
                  { label: "Adresse", value: shopAddress, set: setShopAddress, placeholder: "123 Rue des Outils, 75001 Paris" },
                  { label: "Téléphone", value: shopPhone, set: setShopPhone, placeholder: "+33 6 00 00 00 00" },
                  { label: "N° SIRET", value: shopSiret, set: setShopSiret, placeholder: "123 456 789 00000" },
                  { label: "N° TVA intracommunautaire", value: shopTva, set: setShopTva, placeholder: "FR12 123456789" },
                  { label: "Code NAF / APE", value: shopNaf, set: setShopNaf, placeholder: "4752A" },
                ] as { label: string; value: string; set: (v: string) => void; placeholder: string }[]).map(field => (
                  <div key={field.label}>
                    <label className="block text-xs text-white/40 mb-1.5">{field.label}</label>
                    <input type="text" value={field.value} onChange={e => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                ))}
              </div>

              {/* Devise */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white/70">💱 Devise</h2>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { symbol: "€", label: "EUR" },
                    { symbol: "$", label: "USD" },
                    { symbol: "£", label: "GBP" },
                    { symbol: "DH", label: "MAD" },
                    { symbol: "CFA", label: "XOF" },
                    { symbol: "CHF", label: "CHF" },
                  ] as { symbol: string; label: string }[]).map(c => (
                    <button key={c.symbol} onClick={() => setCurrency(c.symbol)}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        currency === c.symbol
                          ? "bg-amber-500 text-black"
                          : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                      }`}>
                      {c.symbol} <span className="text-xs opacity-70">{c.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/30">Symbole actuel : <span className="text-amber-400 font-bold">{currency}</span> — aperçu : {formatPrice(12.5)}</p>
              </div>

              {/* Taxes */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white/70">🧾 Taxes</h2>
                  <button onClick={() => { setTaxForm(true); setTaxEditId(null); setTaxName(""); setTaxRate("") }}
                    className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors">
                    + Ajouter
                  </button>
                </div>
                {taxForm && (
                  <div className="flex gap-2 items-end p-3 bg-white/[0.03] rounded-lg">
                    <div className="flex-1">
                      <label className="block text-[10px] text-white/30 mb-1">Nom</label>
                      <input value={taxName} onChange={e => setTaxName(e.target.value)} placeholder="TVA 20%"
                        className="w-full bg-white/[0.06] border border-white/[0.10] rounded px-2.5 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-white/30 mb-1">Taux (%)</label>
                      <input type="number" min={0} max={100} step={0.5} value={taxRate} onChange={e => setTaxRate(e.target.value)} placeholder="20"
                        className="w-full bg-white/[0.06] border border-white/[0.10] rounded px-2.5 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                    </div>
                    <button onClick={() => {
                      const rate = parseFloat(taxRate)
                      if (!taxName.trim() || isNaN(rate)) return
                      if (taxEditId) {
                        setTaxes(prev => prev.map(t => t.id === taxEditId ? { ...t, name: taxName.trim(), rate } : t))
                      } else {
                        setTaxes(prev => [...prev, { id: `t${Date.now()}`, name: taxName.trim(), rate }])
                      }
                      setTaxForm(false); setTaxEditId(null); setTaxName(""); setTaxRate("")
                    }} className="px-3 py-1.5 bg-amber-500 text-black font-bold text-sm rounded hover:bg-amber-400 transition-colors">✓</button>
                    <button onClick={() => { setTaxForm(false); setTaxEditId(null) }}
                      className="px-3 py-1.5 bg-white/[0.06] text-white/40 text-sm rounded hover:bg-white/10 transition-colors">✕</button>
                  </div>
                )}
                <div className="space-y-1.5">
                  {taxes.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] text-sm">
                      <span>{t.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-semibold">{t.rate}%</span>
                        <button onClick={() => { setTaxForm(true); setTaxEditId(t.id); setTaxName(t.name); setTaxRate(String(t.rate)) }}
                          className="text-xs text-white/30 hover:text-white/70 transition-colors">✏️</button>
                        <button onClick={() => setTaxes(prev => prev.filter(x => x.id !== t.id))}
                          className="text-xs text-white/30 hover:text-red-400 transition-colors">🗑</button>
                      </div>
                    </div>
                  ))}
                  {taxes.length === 0 && <p className="text-xs text-white/20 text-center py-2">Aucune taxe configurée</p>}
                </div>
              </div>

              {/* Mode test */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white/70">⚗️ Mode test</h2>
                    <p className="text-xs text-white/30 mt-0.5">Les ventes test ne comptent pas dans vos statistiques</p>
                  </div>
                  <button onClick={() => setTestMode(v => !v)}
                    className={`w-12 h-6 rounded-full transition-all relative ${testMode ? "bg-amber-500" : "bg-white/[0.12]"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${testMode ? "left-7" : "left-1"}`} />
                  </button>
                </div>
                {testMode && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                    Mode test actif — toutes les nouvelles commandes seront marquées comme tests
                  </div>
                )}
              </div>

              {/* Ticket Z */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-3">
                <div>
                  <h2 className="text-sm font-bold text-white/70">🏁 Ticket Z — Clôture de caisse</h2>
                  <p className="text-xs text-white/30 mt-1">Rapport de fin de journée : totaux par mode de paiement, CA réalisé.</p>
                </div>
                <button onClick={() => setShowTicketZ(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-semibold text-sm transition-colors">
                  🏁 Générer le Ticket Z du jour
                </button>
              </div>

              {/* Codes PIN */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-white/70">🔐 Profils de connexion</h2>
                  <p className="text-xs text-white/30 mt-0.5">Personnalisez le prénom et le PIN de chaque profil</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Profil 1 */}
                  <div className="space-y-2">
                    <label className="block text-xs text-white/40">👑 Profil 1</label>
                    <input
                      type="text" maxLength={20} value={adminName}
                      onChange={e => setAdminName(e.target.value || "Administrateur")}
                      placeholder="Prénom ou rôle"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
                    <p className="text-[11px] text-white/30">{adminPin ? "🔒 PIN configuré" : "🔓 Sans PIN"}</p>
                    <input
                      type="password" maxLength={4}
                      placeholder="Nouveau PIN (4 chiffres)"
                      onKeyDown={e => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.replace(/\D/g,"").slice(0,4); if (v.length === 4) { hashPin(v).then(h => { setAdminPin(h); (e.target as HTMLInputElement).value = "" }) } } }}
                      onBlur={e => { const v = e.target.value.replace(/\D/g,"").slice(0,4); if (v.length === 4) { hashPin(v).then(h => { setAdminPin(h); e.target.value = "" }) } }}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-center placeholder-white/20 text-white tracking-widest focus:outline-none focus:border-amber-500/50 transition-colors" />
                    {adminPin && <button onClick={() => setAdminPin("")} className="text-[11px] text-red-400/70 hover:text-red-400 transition-colors">Supprimer le PIN</button>}
                  </div>
                  {/* Profil 2 */}
                  <div className="space-y-2">
                    <label className="block text-xs text-white/40">🤝 Profil 2</label>
                    <input
                      type="text" maxLength={20} value={partenaireName}
                      onChange={e => setPartenaireName(e.target.value || "Partenaire")}
                      placeholder="Prénom ou rôle"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
                    <p className="text-[11px] text-white/30">{partenairePin ? "🔒 PIN configuré" : "🔓 Sans PIN"}</p>
                    <input
                      type="password" maxLength={4}
                      placeholder="Nouveau PIN (4 chiffres)"
                      onKeyDown={e => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.replace(/\D/g,"").slice(0,4); if (v.length === 4) { hashPin(v).then(h => { setPartenairePin(h); (e.target as HTMLInputElement).value = "" }) } } }}
                      onBlur={e => { const v = e.target.value.replace(/\D/g,"").slice(0,4); if (v.length === 4) { hashPin(v).then(h => { setPartenairePin(h); e.target.value = "" }) } }}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-center placeholder-white/20 text-white tracking-widest focus:outline-none focus:border-amber-500/50 transition-colors" />
                    {partenairePin && <button onClick={() => setPartenairePin("")} className="text-[11px] text-red-400/70 hover:text-red-400 transition-colors">Supprimer le PIN</button>}
                  </div>
                </div>
                <p className="text-[11px] text-white/20 mt-1">Tapez 4 chiffres puis appuyez Entrée ou cliquez ailleurs pour enregistrer</p>
              </div>

              {/* Personnalisation ticket */}
              <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-white/70">🎨 Personnalisation du ticket</h2>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Logo (ticket + sidebar + écran de connexion)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium cursor-pointer transition-colors">
                      📁 Importer une image
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = ev => { const result = ev.target?.result as string; if (result?.startsWith("data:image/")) setTicketLogo(result) }
                        reader.readAsDataURL(file)
                        e.target.value = ""
                      }} />
                    </label>
                    {ticketLogo && (
                      <button onClick={() => setTicketLogo("")} className="text-xs text-red-400/70 hover:text-red-400 transition-colors">Supprimer</button>
                    )}
                  </div>
                  {ticketLogo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ticketLogo} alt="aperçu logo" className="mt-3 h-12 object-contain rounded opacity-80" />
                  )}
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Pied de page du ticket</label>
                  <textarea value={ticketFooter} onChange={e => setTicketFooter(e.target.value)} rows={2}
                    placeholder="Merci de votre confiance ! Code WiFi: 1234"
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── GESTION DE STOCK ─────────────────────────────────────────────────── */}
        {view === "stock" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold mb-0.5">Gestion de stock</h1>
                <p className="text-white/40 text-sm">Réceptionnez, ajustez, créez ou modifiez vos produits</p>
              </div>
              <button onClick={() => { setStockAddMode(true); setStockEditProduct(null) }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors flex-shrink-0">
                + Nouveau produit
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">

                {/* ─── Formulaire ajouter produit ─── */}
                {stockAddMode && (
                  <div className="bg-[#12121f] border border-amber-500/30 rounded-2xl overflow-hidden" style={{height:"min(80vh, 720px)",display:"flex",flexDirection:"column"}}>
                    <CatForm products={products} setProducts={setProducts} onClose={() => setStockAddMode(false)} taxes={taxes} suppliers={suppliers} categories={categories} />
                  </div>
                )}

                {/* ─── Formulaire modifier produit ─── */}
                {stockEditProduct && (
                  <div className="bg-[#12121f] border border-amber-500/30 rounded-2xl overflow-hidden" style={{height:"min(80vh, 720px)",display:"flex",flexDirection:"column"}}>
                    <CatForm products={products} setProducts={setProducts} editProduct={stockEditProduct} onClose={() => setStockEditProduct(null)} taxes={taxes} suppliers={suppliers} categories={categories} />
                  </div>
                )}

                {/* ─── Valeur du stock ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 bg-[#12121f] border border-amber-500/20 rounded-xl p-4 flex flex-col gap-1">
                    <p className="text-xs text-white/40 font-medium">💰 Valeur du stock (PV)</p>
                    <p className="text-2xl font-black text-amber-400">{formatPrice(valeurStock)}</p>
                    {coutStock > 0 ? (
                      <p className="text-xs text-white/30">
                        Coût : <span className="text-white/50">{formatPrice(coutStock)}</span>
                        {margeStockPct !== null && <span className="text-cyan-400 font-semibold ml-2">→ marge {margeStockPct.toFixed(1)}%</span>}
                      </p>
                    ) : (
                      <p className="text-xs text-white/30">Renseignez le PA pour voir la marge</p>
                    )}
                  </div>
                  <div className="bg-[#12121f] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-1">
                    <p className="text-xs text-white/40 font-medium">📦 Références</p>
                    <p className="text-2xl font-black text-white">{products.length}</p>
                    <p className="text-xs text-white/30">produits actifs</p>
                  </div>
                  <div className={`bg-[#12121f] border rounded-xl p-4 flex flex-col gap-1 ${outOfStockProducts.length > 0 ? "border-red-500/30" : "border-white/[0.06]"}`}>
                    <p className="text-xs text-white/40 font-medium">⚠ Alertes</p>
                    <p className={`text-2xl font-black ${outOfStockProducts.length > 0 ? "text-red-400" : lowStockProducts.length > 0 ? "text-amber-400" : "text-cyan-400"}`}>
                      {outOfStockProducts.length + lowStockProducts.length}
                    </p>
                    <p className="text-xs text-white/30">{outOfStockProducts.length} épuisés · {lowStockProducts.length} bas</p>
                  </div>
                </div>

                {/* ─── Formulaire réception marchandise ─── */}
                <div className="bg-[#12121f] border border-white/[0.08] rounded-xl p-5">
                  <h2 className="text-sm font-bold text-white/80 mb-4">📦 Réceptionner de la marchandise</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Sélecteur produit */}
                    <div className="flex-1">
                      <label className="block text-xs text-white/40 mb-1.5">Produit</label>
                      <div className="relative">
                        <input type="text" value={receptionSearch}
                          onChange={e => { setReceptionSearch(e.target.value); setReceptionProductId("") }}
                          placeholder="Rechercher un produit..."
                          className="w-full bg-white/[0.06] border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm placeholder-white/25 text-white focus:outline-none focus:border-amber-500/60 transition-colors" />
                        {receptionSearch && !receptionProductId && (
                          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0e0e18] border border-white/[0.12] rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                            {products.filter(p => p.name.toLowerCase().includes(receptionSearch.toLowerCase())).slice(0, 8).map(p => (
                              <button key={p.id} onClick={() => { setReceptionProductId(p.id); setReceptionSearch(p.name) }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.06] text-left transition-colors">
                                <span className="text-base">{p.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{p.name}</p>
                                  <p className="text-xs text-white/40">Stock actuel : <span className={p.stock === 0 ? "text-red-400" : p.stock <= p.alertThreshold ? "text-amber-400" : "text-cyan-400"}>{p.stock}</span></p>
                                </div>
                              </button>
                            ))}
                            {products.filter(p => p.name.toLowerCase().includes(receptionSearch.toLowerCase())).length === 0 && (
                              <p className="px-3 py-2 text-sm text-white/30">Aucun produit trouvé</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Quantité */}
                    <div className="w-full sm:w-36">
                      <label className="block text-xs text-white/40 mb-1.5">Quantité reçue</label>
                      <input type="number" min={1} value={receptionQty}
                        onChange={e => setReceptionQty(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white/[0.06] border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/60 transition-colors text-center font-bold" />
                    </div>
                    {/* Bouton */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          const qty = parseInt(receptionQty)
                          if (!receptionProductId || isNaN(qty) || qty <= 0) return
                          const product = products.find(p => p.id === receptionProductId)
                          if (!product) return
                          setProducts(prev => prev.map(p => p.id === receptionProductId ? { ...p, stock: p.stock + qty } : p))
                          setReceptionHistory(h => [{ productId: receptionProductId, name: product.name, qty, at: new Date() }, ...h.slice(0, 19)])
                          setReceptionProductId("")
                          setReceptionSearch("")
                          setReceptionQty("")
                        }}
                        disabled={!receptionProductId || !receptionQty || parseInt(receptionQty) <= 0}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ✓ Réceptionner
                      </button>
                    </div>
                  </div>

                  {/* Historique réceptions */}
                  {receptionHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                      <p className="text-xs text-white/30 mb-2">Dernières réceptions</p>
                      <div className="flex flex-wrap gap-2">
                        {receptionHistory.slice(0, 5).map((h, i) => (
                          <span key={i} className="text-xs bg-cyan-500/15 text-cyan-400 px-2 py-1 rounded-lg">
                            +{h.qty} {h.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ─── Historique des sorties ─── */}
                {sortiesHistory.length > 0 && (
                  <div className="bg-[#12121f] border border-white/[0.08] rounded-xl p-5">
                    <h2 className="text-sm font-bold text-white/80 mb-4">📤 Historique des sorties</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-white/30 text-xs border-b border-white/[0.06]">
                            <th className="pb-2 text-left">Produit</th>
                            <th className="pb-2 text-right">Qté sortie</th>
                            <th className="pb-2 text-right hidden sm:table-cell">Commande</th>
                            <th className="pb-2 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortiesHistory.slice(0, 30).map((s, i) => (
                            <tr key={i} className="border-b border-white/[0.04] last:border-0">
                              <td className="py-2 text-white/70 truncate max-w-[140px]">{s.name}</td>
                              <td className="py-2 text-right text-red-400 font-bold">−{s.qty}</td>
                              <td className="py-2 text-right text-white/30 text-xs hidden sm:table-cell">{s.orderId}</td>
                              <td className="py-2 text-right text-white/30 text-xs whitespace-nowrap">
                                {new Date(s.at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} {formatTime(new Date(s.at))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {sortiesHistory.length > 30 && (
                      <p className="text-xs text-white/20 mt-2">{sortiesHistory.length - 30} entrées plus anciennes non affichées</p>
                    )}
                  </div>
                )}

                {/* ─── Alertes ─── */}
                {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-semibold text-amber-400 mb-2">⚠ {lowStockProducts.length + outOfStockProducts.length} produit(s) à réapprovisionner</p>
                    <div className="flex flex-wrap gap-2">
                      {[...outOfStockProducts, ...lowStockProducts].map(p => (
                        <button key={p.id} onClick={() => { setReceptionSearch(p.name); setReceptionProductId(p.id) }}
                          className={`text-xs px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 ${p.stock === 0 ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"}`}>
                          {p.emoji} {p.name} — {p.stock} en stock
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Liste produits avec ajustement rapide ─── */}
                <div>
                  <h2 className="text-sm font-bold text-white/60 mb-3">État du stock ({products.length} produits)</h2>
                  <div className="grid gap-2">
                    {products.map(product => {
                      const isOut = product.stock === 0
                      const isLow = product.stock > 0 && product.stock <= product.alertThreshold
                      const isEditing = stockEditing === product.id
                      return (
                        <div key={product.id} className={`bg-[#12121f] border rounded-xl px-3 py-3 transition-colors ${stockEditProduct?.id === product.id ? "border-amber-500/40" : "border-white/[0.05] hover:border-white/10"}`}>
                          {/* Ligne 1 : image + nom + prix */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
                              {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-base opacity-50">{product.emoji}</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-white/30 truncate">
                                {product.category} · <span className="text-amber-400/70">{formatPrice(product.price)}</span>
                              </p>
                            </div>
                          </div>
                          {/* Ligne 2 : stock + boutons */}
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input type="number" min={0} value={stockEditVal}
                                onChange={e => setStockEditVal(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") saveStock(product.id); if (e.key === "Escape") setStockEditing(null) }}
                                autoFocus
                                className="w-20 bg-white/[0.08] border border-amber-500/50 rounded-lg px-2 py-1.5 text-right text-sm focus:outline-none font-bold" />
                              <button onClick={() => saveStock(product.id)} className="text-cyan-400 text-sm hover:text-cyan-300 px-1">✓</button>
                              <button onClick={() => setStockEditing(null)} className="text-red-400 text-sm hover:text-red-300 px-1">✕</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-cyan-400"}`}>
                                {product.stock} {product.unit}s
                              </span>
                              {[5, 10, 20].map(n => (
                                <button key={n} onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock + n } : p))}
                                  className="text-[10px] px-2 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 font-bold transition-all">
                                  +{n}
                                </button>
                              ))}
                              <button onClick={() => { setStockEditing(product.id); setStockEditVal(product.stock.toString()) }}
                                className="text-xs px-2 py-1 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                ✏️
                              </button>
                              <button onClick={() => { setStockEditProduct(product); setStockAddMode(false); window.scrollTo({ top: 0 }) }}
                                className="text-xs px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all">
                                ⚙
                              </button>
                              <button onClick={() => { if (confirm(`Supprimer "${product.name}" ?`)) setProducts(prev => prev.filter(p => p.id !== product.id)) }}
                                className="text-xs px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                                🗑
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ─── Fournisseurs ─── */}
                <div className="bg-[#12121f] border border-white/[0.08] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white/80">🏭 Fournisseurs</h2>
                    <button onClick={() => { setShowSupplierForm(true); setEditSupplier(null); setSupplierName(""); setSupplierPhone(""); setSupplierEmail(""); setSupplierNotes("") }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold transition-colors">
                      + Ajouter
                    </button>
                  </div>

                  {/* Formulaire ajouter/modifier fournisseur */}
                  {showSupplierForm && (
                    <div className="mb-4 p-4 bg-white/[0.04] rounded-xl border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-white/40 mb-1">Nom *</label>
                        <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Brico Pro SAS..."
                          className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Téléphone</label>
                        <input value={supplierPhone} onChange={e => setSupplierPhone(e.target.value)} placeholder="06 00 00 00 00"
                          className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Email</label>
                        <input value={supplierEmail} onChange={e => setSupplierEmail(e.target.value)} placeholder="contact@..."
                          className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-white/40 mb-1">Notes</label>
                        <input value={supplierNotes} onChange={e => setSupplierNotes(e.target.value)} placeholder="Délai livraison, conditions..."
                          className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                      </div>
                      <div className="sm:col-span-2 flex gap-2">
                        <button onClick={() => {
                          if (!supplierName.trim()) return
                          if (editSupplier) {
                            setSuppliers(prev => prev.map(s => s.id === editSupplier.id ? { ...s, name: supplierName.trim(), phone: supplierPhone.trim() || undefined, email: supplierEmail.trim() || undefined, notes: supplierNotes.trim() || undefined } : s))
                          } else {
                            setSuppliers(prev => [...prev, { id: `sup${Date.now()}`, name: supplierName.trim(), phone: supplierPhone.trim() || undefined, email: supplierEmail.trim() || undefined, notes: supplierNotes.trim() || undefined }])
                          }
                          setShowSupplierForm(false); setEditSupplier(null)
                        }}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors">
                          {editSupplier ? "Enregistrer" : "Ajouter"}
                        </button>
                        <button onClick={() => { setShowSupplierForm(false); setEditSupplier(null) }}
                          className="px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 text-sm transition-colors">Annuler</button>
                      </div>
                    </div>
                  )}

                  {suppliers.length === 0 && !showSupplierForm ? (
                    <p className="text-white/25 text-sm text-center py-4">Aucun fournisseur enregistré</p>
                  ) : (
                    <div className="space-y-2">
                      {suppliers.map(s => {
                        const nb = products.filter(p => p.supplierId === s.id).length
                        return (
                          <div key={s.id} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold">{s.name}</p>
                              <div className="flex flex-wrap gap-2 mt-0.5">
                                {s.phone && <a href={`tel:${s.phone}`} className="text-xs text-blue-400 hover:underline">📞 {s.phone}</a>}
                                {s.email && <a href={`mailto:${s.email}`} className="text-xs text-blue-400 hover:underline">✉ {s.email}</a>}
                                {s.notes && <span className="text-xs text-white/30">{s.notes}</span>}
                              </div>
                            </div>
                            <span className="text-xs text-white/30 flex-shrink-0">{nb} produit{nb !== 1 ? "s" : ""}</span>
                            <button onClick={() => { setEditSupplier(s); setSupplierName(s.name); setSupplierPhone(s.phone ?? ""); setSupplierEmail(s.email ?? ""); setSupplierNotes(s.notes ?? ""); setShowSupplierForm(true) }}
                              className="text-xs px-2 py-1 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all">✏️</button>
                            <button onClick={() => { if (confirm(`Supprimer "${s.name}" ?`)) setSuppliers(prev => prev.filter(x => x.id !== s.id)) }}
                              className="text-xs px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">🗑</button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── VITRINE ───────────────────────────────────────────────────────────── */}
        {view === "vitrine" && (() => {
          const vitrineItems = Object.entries(vitrineCart).filter(([, q]) => q > 0)
          const vitrineTotal = vitrineItems.reduce((s, [pid, qty]) => {
            const p = products.find(x => x.id === pid)
            return s + (p ? p.price * qty : 0)
          }, 0)
          const vitrineCount = vitrineItems.reduce((s, [, q]) => s + q, 0)

          if (vitrineStep === "paiement") return (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header compact */}
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 flex-shrink-0">
                <button onClick={() => setVitrineStep("select")}
                  className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white text-xs transition-colors">←</button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-sm font-bold leading-none">Finaliser la commande</h1>
                  <p className="text-[11px] text-white/40 mt-0.5">{vitrineCount} article{vitrineCount > 1 ? "s" : ""} — <span className="text-amber-400 font-bold">{vitrineTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span></p>
                </div>
                <button onClick={() => { setVitrineCart({}); setVitrineStep("select"); setVitrineClient("") }}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold border border-red-500/20 transition-colors flex-shrink-0">
                  ✕ Annuler
                </button>
              </div>

              {/* Contenu — layout 2 colonnes sur md+ */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="flex flex-col md:flex-row gap-3 h-full">

                  {/* Colonne gauche : récap + client */}
                  <div className="flex flex-col gap-3 md:w-1/2">
                    {/* Récap compact */}
                    <div className="bg-[#12121f] border border-white/[0.06] rounded-xl overflow-hidden">
                      <div className="px-3 py-2 border-b border-white/[0.06] flex justify-between items-center">
                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Récapitulatif</p>
                        <span className="text-[11px] font-black text-amber-400">{vitrineTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                      </div>
                      <div className="divide-y divide-white/[0.04] max-h-36 overflow-y-auto">
                        {vitrineItems.map(([pid, qty]) => {
                          const p = products.find(x => x.id === pid)
                          if (!p) return null
                          return (
                            <div key={pid} className="flex items-center gap-2 px-3 py-2">
                              <div className="w-7 h-7 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.04]">
                                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  : <span className="w-full h-full flex items-center justify-center text-xs opacity-40">{p.emoji}</span>}
                              </div>
                              <p className="flex-1 text-xs font-medium truncate">{p.name}</p>
                              <p className="text-[11px] text-white/40 flex-shrink-0">×{qty} — {(p.price * qty).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {/* Client */}
                    <div>
                      <label className="block text-[11px] text-white/40 mb-1">Client / Chantier (optionnel)</label>
                      <input type="text" value={vitrineClient} onChange={e => setVitrineClient(e.target.value)}
                        placeholder="Nom du client ou chantier"
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-colors" />
                    </div>
                  </div>

                  {/* Colonne droite : paiement */}
                  <div className="md:w-1/2 flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Mode de paiement</p>
                    {PAYMENT_METHODS.map(pm => (
                      <button key={pm.id} onClick={() => validateVitrineOrder(pm.id)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08] hover:border-amber-500/40 transition-all group">
                        <span className="text-xl">{pm.icon}</span>
                        <span className="text-sm font-semibold group-hover:text-amber-400 transition-colors">{pm.label}</span>
                        <span className="ml-auto text-white/20 group-hover:text-amber-400 text-xs">→</span>
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )

          return (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-base font-bold">Vitrine</h1>
                  {vitrineCount > 0 && (
                    <button onClick={() => setVitrineStep("paiement")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors shadow-lg shadow-amber-500/20">
                      <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">{vitrineCount}</span>
                      Commander — {vitrineTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                  <input type="text" value={vitrineSearch} onChange={e => setVitrineSearch(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-8 py-2 text-sm placeholder-white/20 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
                  {vitrineSearch && (
                    <button onClick={() => setVitrineSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">✕</button>
                  )}
                </div>
              </div>
              {/* Grille produits */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                  {products.filter(p => !vitrineSearch || p.name.toLowerCase().includes(vitrineSearch.toLowerCase())).map(p => {
                    const selected = (vitrineCart[p.id] ?? 0) > 0
                    const qty = vitrineCart[p.id] ?? 0
                    const isOut = p.stock === 0
                    return (
                      <div key={p.id}
                        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                          selected ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent hover:border-white/20"
                        } ${isOut ? "opacity-40 pointer-events-none" : ""}`}
                        onClick={() => {
                          if (isOut) return
                          setVitrineCart(prev => {
                            if ((prev[p.id] ?? 0) === 0) return { ...prev, [p.id]: 1 }
                            const { [p.id]: _, ...rest } = prev
                            return rest
                          })
                        }}
                      >
                        {/* Image */}
                        <div className="aspect-[4/3] bg-[#12121f]">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">{p.emoji}</div>}
                        </div>
                        {/* Nom */}
                        <div className={`px-2 py-1.5 text-center ${selected ? "bg-amber-500/10" : "bg-[#0e0e18]"}`}>
                          <p className="text-[11px] font-semibold leading-tight line-clamp-2 text-white">{p.name}</p>
                        </div>
                        {/* Badge sélection + qty */}
                        {selected && (
                          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5"
                            onClick={e => e.stopPropagation()}>
                            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                              <span className="text-[10px] font-black text-black">✓</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                              <button
                                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                onClick={() => setVitrineCart(prev => {
                                  const n = (prev[p.id] ?? 1) - 1
                                  if (n <= 0) { const { [p.id]: _, ...rest } = prev; return rest }
                                  return { ...prev, [p.id]: n }
                                })}>−</button>
                              <span className="text-xs font-bold text-white min-w-[16px] text-center">{qty}</span>
                              <button
                                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                onClick={() => setVitrineCart(prev => ({ ...prev, [p.id]: Math.min((prev[p.id] ?? 1) + 1, p.stock) }))}>+</button>
                            </div>
                          </div>
                        )}
                        {isOut && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="text-xs font-bold text-red-400 bg-black/60 px-2 py-1 rounded-full">Épuisé</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Barre bas si sélection */}
              {vitrineCount > 0 && (() => {
                const vitrineHT = vitrineItems.reduce((sum, [pid, qty]) => {
                  const p = products.find(x => x.id === pid)
                  if (!p) return sum
                  const tax = p.taxId ? taxes.find(t => t.id === p.taxId) : null
                  const ht = tax ? p.price / (1 + tax.rate / 100) : p.price
                  return sum + ht * qty
                }, 0)
                const vitrineTVA = vitrineTotal - vitrineHT
                const fmt2 = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
                return (
                <div className="px-4 pb-4 pt-3 border-t border-white/[0.06] flex-shrink-0">
                  <button onClick={() => setVitrineStep("paiement")}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-lg shadow-amber-500/20">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-sm font-black">{vitrineCount}</span>
                      <span className="font-bold text-sm">Passer la commande</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-base">{fmt2(vitrineTotal)} € TTC</div>
                      <div className="text-[11px] font-medium opacity-70">HT {fmt2(vitrineHT)} € · TVA {fmt2(vitrineTVA)} €</div>
                    </div>
                  </button>
                </div>
                )
              })()}
            </div>
          )
        })()}

      </div>

      {/* ── MODAL FORMULE ─────────────────────────────────────────────────────── */}
      {formulaModal && (() => {
        const isNew = formulaModal === "new"
        const initial: Formula = isNew
          ? { id: genId(), name: "", emoji: "📦", items: [], customPrice: undefined, description: "" }
          : formulaModal as Formula
        return (
          <FormulaModalContent
            key={initial.id}
            initial={initial}
            isNew={isNew}
            products={products}
            formatPrice={formatPrice}
            onSave={(f: Formula) => {
              if (isNew) setFormulas(prev => [...prev, f])
              else setFormulas(prev => prev.map(x => x.id === f.id ? f : x))
              setFormulaModal(null)
            }}
            onClose={() => setFormulaModal(null)}
          />
        )
      })()}

      {/* ── MODAL PAIEMENT ────────────────────────────────────────────────────── */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setShowPayModal(false); setCashPayStep(false); setCashGivenInput("") }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/[0.06]">
              {cashPayStep ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setCashPayStep(false); setCashGivenInput("") }}
                    className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60 text-xs">←</button>
                  <div>
                    <h2 className="text-lg font-bold">💵 Paiement espèces</h2>
                    <p className="text-sm text-white/40 mt-0.5">À encaisser : <span className="text-amber-400 font-bold">{formatPrice(cartTTC)}</span></p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Mode de paiement</h2>
                  <p className="text-sm text-white/40 mt-0.5">
                    Total à encaisser : <span className="text-amber-400 font-bold">{formatPrice(cartTTC)}</span>
                    {discountValue > 0 && (
                      <span className="text-cyan-400 ml-1">
                        (−{discountType === "percent" ? `${discountValue}%` : `${discountValue} €`})
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
            {cashPayStep ? (
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs text-white/40 mb-2">Montant remis par le client</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} step={0.01} autoFocus
                      value={cashGivenInput} onChange={e => setCashGivenInput(e.target.value)}
                      placeholder="0,00"
                      className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-xl font-bold text-white text-right placeholder-white/20 focus:outline-none focus:border-amber-500/50"
                    />
                    <span className="text-white/40 font-bold text-lg">{currency}</span>
                  </div>
                </div>
                {(() => {
                  const given = parseFloat(cashGivenInput.replace(",", "."))
                  const change = isNaN(given) ? null : given - cartTTC
                  return change !== null ? (
                    <div className={`p-4 rounded-xl border ${change >= 0 ? "bg-cyan-500/10 border-cyan-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                      <p className="text-xs text-white/50 mb-1">Monnaie à rendre</p>
                      <p className={`text-3xl font-black ${change >= 0 ? "text-cyan-400" : "text-red-400"}`}>
                        {change >= 0 ? formatPrice(change) : `−${formatPrice(Math.abs(change))}`}
                      </p>
                      {change < 0 && <p className="text-xs text-red-400 mt-1">Montant insuffisant</p>}
                    </div>
                  ) : null
                })()}
                <button
                  onClick={() => {
                    const given = parseFloat(cashGivenInput.replace(",", "."))
                    validateOrder("espèces", isNaN(given) ? undefined : given)
                  }}
                  disabled={(() => {
                    const given = parseFloat(cashGivenInput.replace(",", "."))
                    return cashGivenInput !== "" && (isNaN(given) || given < cartTTC)
                  })()}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-base transition-colors disabled:opacity-40"
                >
                  ✓ Confirmer — {cashGivenInput ? formatPrice(parseFloat(cashGivenInput.replace(",", ".")) || 0) : "Montant exact"}
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => validateOrder(pm.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-amber-500/40 transition-all group"
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="text-sm font-semibold group-hover:text-amber-400 transition-colors">{pm.label}</span>
                    <span className="ml-auto text-white/20 group-hover:text-amber-400 text-xs">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL REÇU ────────────────────────────────────────────────────────── */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setReceiptOrder(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xs overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Bouton fermer */}
            <button
              onClick={() => { setReceiptOrder(null); setReceiptIsDuplicate(false) }}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold transition-all"
            >✕</button>

            {/* Ticket papier */}
            <div className="bg-white text-gray-900 rounded-t-2xl px-6 pt-6 pb-4 font-mono">

              {/* Bandeau DUPLICATA */}
              {receiptIsDuplicate && (
                <div className="text-center mb-3 py-1 border-2 border-dashed border-gray-400 rounded">
                  <span className="text-sm font-black tracking-widest text-gray-500 uppercase">— DUPLICATA —</span>
                </div>
              )}

              {/* En-tête */}
              <div className="text-center mb-4">
                {ticketLogo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ticketLogo} alt="logo" className="h-12 object-contain mx-auto mb-2" />
                )}
                <div className="text-lg font-black tracking-widest uppercase">{shopName || "ATM Outillage"}</div>
                {shopSubtitle && <div className="text-[11px] text-gray-400 mt-0.5">{shopSubtitle}</div>}
                {shopAddress && <div className="text-[10px] text-gray-400 mt-0.5">{shopAddress}</div>}
                {shopPhone && <div className="text-[10px] text-gray-400 mt-0.5">{shopPhone}</div>}
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {/* Infos commande */}
              <div className="text-[11px] text-gray-500 space-y-0.5 mb-3">
                <div>N° <span className="font-bold text-gray-700">{receiptOrder.id}</span></div>
                <div>{receiptOrder.createdAt.toLocaleDateString("fr-FR")} — {formatTime(receiptOrder.createdAt)}</div>
                {receiptOrder.table && (
                  <div>Client : <span className="font-semibold text-gray-700">{receiptOrder.table}</span></div>
                )}
                {receiptOrder.comment && (
                  <div className="mt-1 italic text-gray-400">"{receiptOrder.comment}"</div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {/* Articles */}
              <div className="space-y-1.5 mb-3">
                {receiptOrder.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-[12px]">
                    <span className="text-gray-600 truncate max-w-[160px]">{item.quantity}× {item.name}</span>
                    <span className="font-semibold ml-2 flex-shrink-0">{formatPrice(item.quantity * item.unitPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {/* Totaux */}
              <div className="space-y-1 mb-3">
                {receiptOrder.discountValue > 0 && (
                  <>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Sous-total</span>
                      <span>{formatPrice(receiptOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-green-600">
                      <span>
                        Remise {receiptOrder.discountType === "percent" ? `${receiptOrder.discountValue}%` : `${receiptOrder.discountValue} €`}
                      </span>
                      <span>−{formatPrice(receiptOrder.subtotal - receiptOrder.total)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-base font-black pt-1">
                  <span>TOTAL</span>
                  <span className="text-amber-600">{formatPrice(receiptOrder.total)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {/* TVA breakdown */}
              {(() => {
                const tvaLines: { name: string; rate: number; amount: number }[] = []
                receiptOrder.items.forEach(item => {
                  const prod = products.find(p => p.id === item.productId)
                  if (!prod?.taxId) return
                  const tax = taxes.find(t => t.id === prod.taxId)
                  if (!tax) return
                  const ttc = item.unitPrice * item.quantity
                  const tvaAmt = ttc * tax.rate / (100 + tax.rate)
                  const existing = tvaLines.find(l => l.name === tax.name)
                  if (existing) existing.amount += tvaAmt
                  else tvaLines.push({ name: tax.name, rate: tax.rate, amount: tvaAmt })
                })
                if (tvaLines.length === 0) return null
                const totalTva = tvaLines.reduce((s, l) => s + l.amount, 0)
                const totalHt = receiptOrder.total - totalTva
                return (
                  <div className="space-y-0.5 mb-3">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Total HT</span><span>{formatPrice(totalHt)}</span>
                    </div>
                    {tvaLines.map(l => (
                      <div key={l.name} className="flex justify-between text-[10px] text-gray-400">
                        <span>dont {l.name}</span><span>{formatPrice(l.amount)}</span>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Paiement & rendu monnaie */}
              <div className="text-[11px] text-gray-500 mb-3">
                Paiement : <span className="font-semibold text-gray-700">
                  {PAYMENT_METHODS.find(p => p.id === receiptOrder.paymentMethod)?.icon}{" "}
                  {{ espèces: "Espèces", carte: "Carte bancaire", chèque: "Chèque", virement: "Virement" }[receiptOrder.paymentMethod]}
                </span>
                {receiptOrder.cashGiven !== undefined && (
                  <div className="mt-1 space-y-0.5">
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Remis</span><span className="font-semibold text-gray-700">{formatPrice(receiptOrder.cashGiven)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-green-600 font-bold">
                      <span>Rendu monnaie</span><span>{formatPrice(receiptOrder.cashGiven - receiptOrder.total)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {shopSiret && <div className="text-center text-[10px] text-gray-400 mb-1">SIRET : {shopSiret}</div>}
              <div className="text-center text-[11px] text-gray-400 pb-1">
                {ticketFooter || "Merci de votre confiance !"}
                {receiptOrder.isTestMode && <div className="mt-1 text-amber-400 font-bold">⚗️ COMMANDE TEST</div>}
              </div>
            </div>

            {/* Bord dentelé bas du ticket */}
            <div className="bg-white h-3 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 flex">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="flex-1 h-3 bg-[#0d0d10]" style={{ borderRadius: "0 0 50% 50%" }} />
                ))}
              </div>
            </div>

            {/* Boutons sous le ticket */}
            <div className="bg-[#12121f] rounded-b-2xl px-4 pt-3 pb-4 space-y-2 border border-white/[0.06] border-t-0">
              <button
                onClick={() => printReceipt(receiptOrder)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                🖨️ {receiptIsDuplicate ? "Imprimer le duplicata" : "Imprimer le ticket"}
              </button>
              <button
                onClick={() => shareReceipt(receiptOrder)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                🔗 Partager le ticket
              </button>
              <button
                onClick={() => downloadReceipt(receiptOrder)}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white/70 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                ⬇️ Télécharger PDF
              </button>
              {!receiptIsDuplicate && (
                <button
                  onClick={() => { setReceiptOrder(null); setView("activite"); setActiviteTab("commandes") }}
                  className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 text-sm transition-colors"
                >
                  Voir les commandes
                </button>
              )}
              <button
                onClick={() => { setReceiptOrder(null); setReceiptIsDuplicate(false) }}
                className="w-full py-1.5 text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DÉTAIL PRODUIT ──────────────────────────────────────────────── */}
      {detailProduct && (() => {
        const p = products.find(x => x.id === detailProduct.id) ?? detailProduct
        const isOut = p.stock === 0
        const isLow = p.stock > 0 && p.stock <= p.alertThreshold
        const inCart = cart[p.id] ?? 0
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailProduct(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-lg bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="w-full h-52 bg-white/[0.03] relative overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-6xl opacity-20">{p.emoji}</span>
                    <span className="text-xs text-white/20">Photo à venir</span>
                  </div>
                )}
                <button
                  onClick={() => setDetailProduct(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-sm flex items-center justify-center transition-colors"
                >✕</button>
                <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/60">{p.category}</span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold leading-tight pr-4">{p.name}</h2>
                  <span className="text-xl font-bold text-amber-400 whitespace-nowrap">{formatPrice(p.price)}</span>
                </div>

                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
                  isOut ? "bg-red-500/10 border border-red-500/20" :
                  isLow ? "bg-amber-500/10 border border-amber-500/20" :
                  "bg-cyan-500/10 border border-cyan-500/20"
                }`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOut ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-cyan-400"}`}></span>
                  <span className={`text-sm font-semibold ${isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-cyan-400"}`}>
                    {isOut ? "Indisponible — rupture de stock" : `Il reste ${p.stock} ${p.unit}${p.stock > 1 ? "s" : ""} disponible${p.stock > 1 ? "s" : ""}`}
                  </span>
                  {inCart > 0 && !isOut && (
                    <span className="ml-auto text-xs text-amber-400 font-medium">{inCart} dans le panier</span>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Caractéristiques techniques</p>
                  <p className="text-sm text-white/70 leading-relaxed">{p.description}</p>
                </div>

                {!isOut && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-2">
                      <button onClick={() => setDetailQty(q => Math.max(1, q - 1))} className="text-white/50 hover:text-white w-5 text-center transition-colors">−</button>
                      <span className="text-sm font-bold w-6 text-center">{detailQty}</span>
                      <button
                        onClick={() => setDetailQty(q => Math.min(p.stock - inCart, q + 1))}
                        disabled={detailQty >= p.stock - inCart}
                        className="text-white/50 hover:text-white w-5 text-center transition-colors disabled:opacity-20"
                      >+</button>
                    </div>
                    <button
                      onClick={() => {
                        if (p.variablePrice && cartPrices[p.id] === undefined) {
                          // Prix variable : ouvrir modal, fermer détail
                          setVariablePriceModal({ productId: p.id, name: p.name })
                          setVariablePriceInput("")
                          setDetailProduct(null)
                        } else {
                          for (let i = 0; i < detailQty; i++) addToCart(p.id)
                          setDetailProduct(null)
                        }
                      }}
                      disabled={detailQty > p.stock - inCart}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-30"
                    >
                      {p.variablePrice && cartPrices[p.id] === undefined
                        ? "Saisir le prix →"
                        : `Ajouter au panier — ${formatPrice((cartPrices[p.id] ?? p.price) * detailQty)}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── MODAL REMBOURSEMENT ──────────────────────────────────────────────── */}
      {refundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRefundModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-base font-bold">Rembourser la commande</h2>
              <p className="text-xs text-white/40 mt-0.5">Montant à rembourser : <span className="text-purple-400 font-bold">{formatPrice(refundModal.total)}</span></p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-white/40 mb-3">Motif du remboursement</p>
                <div className="space-y-2">
                  {["Vente annulée", "Erreur de saisie", "Article endommagé"].map(motif => (
                    <label key={motif} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      refundReason === motif ? "border-purple-500/50 bg-purple-500/10" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}>
                      <input type="radio" name="refundReason" value={motif} checked={refundReason === motif}
                        onChange={() => setRefundReason(motif)} className="accent-purple-500" />
                      <span className="text-sm text-white/80">{motif}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setRefundModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/50 text-sm transition-colors">
                  Annuler
                </button>
                <button onClick={() => processRefund(refundModal.orderId, refundReason)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm transition-colors">
                  ↩ Confirmer le remboursement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL TICKET Z ───────────────────────────────────────────────────── */}
      {showTicketZ && (() => {
        const today = new Date()
        const todayOrders = orders.filter(o =>
          !o.isTestMode &&
          o.status === "livré" &&
          o.createdAt.toDateString() === today.toDateString()
        )
        const totalCA = todayOrders.reduce((s, o) => s + o.total, 0)
        const byMethod: Record<PaymentMethod, { nb: number; total: number }> = {
          espèces:  { nb: 0, total: 0 },
          carte:    { nb: 0, total: 0 },
          virement: { nb: 0, total: 0 },
          chèque:   { nb: 0, total: 0 },
        }
        todayOrders.forEach(o => { byMethod[o.paymentMethod].nb++; byMethod[o.paymentMethod].total += o.total })
        // TVA du jour
        const tvaJour: Record<string, { name: string; amount: number }> = {}
        todayOrders.forEach(o => o.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId)
          if (!prod?.taxId) return
          const tax = taxes.find(t => t.id === prod.taxId)
          if (!tax) return
          const tva = item.unitPrice * item.quantity * tax.rate / (100 + tax.rate)
          if (tvaJour[tax.id]) tvaJour[tax.id].amount += tva
          else tvaJour[tax.id] = { name: tax.name, amount: tva }
        }))
        const tvaLines = Object.values(tvaJour)
        const totalTva = tvaLines.reduce((s, l) => s + l.amount, 0)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowTicketZ(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-sm bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">🏁 Ticket Z — Clôture</h2>
                  <p className="text-xs text-white/40 mt-0.5">{today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <button onClick={() => setShowTicketZ(false)} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60">✕</button>
              </div>
              <div className="p-6 space-y-4">
                {/* CA du jour */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <p className="text-xs text-white/50 mb-1">{todayOrders.length} vente{todayOrders.length > 1 ? "s" : ""} livrée{todayOrders.length > 1 ? "s" : ""} aujourd&apos;hui</p>
                  <p className="text-3xl font-black text-amber-400">{formatPrice(totalCA)}</p>
                  <p className="text-xs text-white/40 mt-1">CA total TTC du jour</p>
                </div>
                {/* Par mode de paiement */}
                <div className="space-y-2">
                  {(Object.entries(byMethod) as [PaymentMethod, { nb: number; total: number }][]).map(([method, data]) => {
                    const icons: Record<PaymentMethod, string> = { espèces: "💵", carte: "💳", virement: "🏦", chèque: "📝" }
                    const labels: Record<PaymentMethod, string> = { espèces: "Espèces", carte: "Carte", virement: "Virement", chèque: "Chèque" }
                    return (
                      <div key={method} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="flex items-center gap-2">
                          <span>{icons[method]}</span>
                          <span className="text-sm font-semibold">{labels[method]}</span>
                          <span className="text-xs text-white/30">({data.nb} vente{data.nb > 1 ? "s" : ""})</span>
                        </div>
                        <span className={`font-bold ${data.total > 0 ? "text-amber-400" : "text-white/20"}`}>{formatPrice(data.total)}</span>
                      </div>
                    )
                  })}
                </div>
                {/* TVA */}
                {tvaLines.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1.5">
                    <p className="text-xs font-bold text-white/50">Détail TVA</p>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Total HT</span><span className="font-semibold">{formatPrice(totalCA - totalTva)}</span>
                    </div>
                    {tvaLines.map(l => (
                      <div key={l.name} className="flex justify-between text-xs text-white/50">
                        <span>dont {l.name}</span><span className="font-semibold">{formatPrice(l.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {todayOrders.length === 0 && (
                  <p className="text-center text-sm text-white/30 py-2">Aucune vente livrée aujourd&apos;hui</p>
                )}
                {/* Fond de caisse */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white/50">💰 Fond de caisse</p>
                    <button onClick={() => { setShowTicketZ(false); setShowFondModal(true) }}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Modifier</button>
                  </div>
                  {fondDeCaisseDate === today.toDateString() ? (
                    <>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Début de journée</span><span className="font-semibold">{formatPrice(fondDeCaisse)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>+ Espèces encaissées</span><span className="font-semibold">{formatPrice(byMethod.espèces.total)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-cyan-400 border-t border-white/[0.05] pt-1 mt-1">
                        <span>= Total caisse théorique</span><span>{formatPrice(fondDeCaisse + byMethod.espèces.total)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-white/30">Non défini pour aujourd&apos;hui</p>
                  )}
                </div>
              </div>
              <div className="px-6 pb-5">
                <button onClick={() => setShowTicketZ(false)}
                  className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white/50 text-sm font-semibold transition-colors">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── MODAL FOND DE CAISSE ─────────────────────────────────────────────── */}
      {showFondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowFondModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xs bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-lg font-bold">💰 Fond de caisse</h2>
              <p className="text-sm text-white/40 mt-0.5">Montant en caisse en début de journée</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <input type="number" min={0} step={0.01} autoFocus value={fondInput} onChange={e => setFondInput(e.target.value)}
                  placeholder="0,00"
                  className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-2xl font-bold text-white text-right placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
                <span className="text-white/40 font-bold text-lg">{currency}</span>
              </div>
              {today && fondDeCaisseDate === today && fondDeCaisse > 0 && (
                <p className="text-xs text-white/30">Fond actuel aujourd&apos;hui : <span className="text-amber-400 font-semibold">{formatPrice(fondDeCaisse)}</span></p>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowFondModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/50 text-sm transition-colors">
                  Annuler
                </button>
                <button onClick={() => {
                  const val = parseFloat(fondInput.replace(",", "."))
                  if (!isNaN(val) && val >= 0) {
                    setFondDeCaisse(val)
                    setFondDeCaisseDate(new Date().toDateString())
                  }
                  setShowFondModal(false)
                  setFondInput("")
                }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors">
                  ✓ Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PRIX VARIABLE ───────────────────────────────────────────────── */}
      {variablePriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setVariablePriceModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xs bg-[#12121f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-base font-bold">Saisir le prix</h2>
              <p className="text-xs text-white/40 mt-0.5 truncate">{variablePriceModal.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">Montant (€)</label>
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="number"
                    min={0}
                    step={0.01}
                    value={variablePriceInput}
                    onChange={e => setVariablePriceInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") confirmVariablePrice() }}
                    placeholder="0,00"
                    className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 text-center"
                  />
                  <span className="text-white/40 text-xl font-bold">€</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setVariablePriceModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/50 text-sm transition-colors">
                  Annuler
                </button>
                <button
                  onClick={confirmVariablePrice}
                  disabled={!variablePriceInput || parseFloat(variablePriceInput.replace(",", ".")) < 0}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-30"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
