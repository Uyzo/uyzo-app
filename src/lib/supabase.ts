import { createClient } from "@supabase/supabase-js";

// Публичный (publishable/anon) ключ — только чтение активных объявлений по RLS.
// Значения-заглушки нужны, чтобы сборка проходила без .env; на Vercel задаём реальные.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || "placeholder-key";

export function getSupabase() {
  return createClient(url, key, {
    auth: { persistSession: false },
    // не кэшировать чтение — чтобы новые объявления сразу появлялись в ленте
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

// Типы под наши таблицы (упрощённо)
export type Listing = {
  id: string;
  kind: "realty" | "goods" | "service";
  deal_type: "sale" | "rent" | null;
  title: string;
  description: string | null;
  price: number;
  currency: "UZS" | "USD";
  price_market: number | null;
  price_index: "low" | "fair" | "high" | null;
  rooms: number | null;
  area: number | null;
  floor: string | null;
  owner_type: "owner" | "agent";
  status?: string;
  seller_verified?: boolean;
  created_at: string;
  districts: { name_ru: string } | null;
  listing_photos: { url: string }[] | null;
};
