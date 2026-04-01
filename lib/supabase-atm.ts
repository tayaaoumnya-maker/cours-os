import { createClient, SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null
if (url && key) {
  supabase = createClient(url, key)
}

export async function dbGetAll(): Promise<Record<string, unknown>> {
  if (!supabase) return {}
  try {
    const { data } = await supabase.from("atm_store").select("key, value")
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from("atm_store")
      .upsert({ key, value, updated_at: new Date().toISOString() })
  } catch {
    // silently fail — localStorage est le fallback
  }
}
