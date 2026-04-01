import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

/**
 * Lazily initialised server-side admin client (service role).
 * Only created when first called — avoids crashing during build.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Missing Supabase server env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    }
    _admin = createClient(url, key);
  }
  return _admin;
}

/**
 * Lazily initialised client-side anon client.
 * Only created when first called — safe for browser components.
 */
export function getSupabase(): SupabaseClient {
  if (!_anon) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing Supabase client env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    _anon = createClient(url, key);
  }
  return _anon;
}

// Backwards-compatible named exports (lazy)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});

export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabase() as any)[prop];
  },
});
