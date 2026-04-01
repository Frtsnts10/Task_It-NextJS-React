import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side admin client (service role) — use ONLY in API routes.
 * Bypasses RLS so we can filter by userId ourselves.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Client-side anon client — safe to use in browser components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
