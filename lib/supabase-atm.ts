import { createClient, SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null
if (url && key) {
  supabase = createClient(url, key)
}

// Retourne null si erreur réseau/Supabase indisponible
// Retourne {} si Supabase est vide (première utilisation)
// Retourne les données si tout va bien
export async function dbGetAll(): Promise<Record<string, unknown> | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from("atm_store").select("key, value")
    if (error) return null
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  } catch {
    return null
  }
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  if (!supabase) return
  try {
    if (value === null || value === undefined) {
      // Supprimer la clé si la valeur est null
      await supabase.from("atm_store").delete().eq("key", key)
    } else {
      await supabase
        .from("atm_store")
        .upsert({ key, value, updated_at: new Date().toISOString() })
    }
  } catch {
    // silently fail — localStorage est le fallback
  }
}
