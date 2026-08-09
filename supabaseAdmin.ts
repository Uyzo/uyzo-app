import { createClient } from "@supabase/supabase-js";

// СЕРВЕРНЫЙ клиент. Использует секретный ключ — только на сервере, никогда во фронте.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const secret = process.env.SUPABASE_SECRET_KEY || "placeholder-secret";

export function getAdmin() {
  return createClient(url, secret, { auth: { persistSession: false } });
}
