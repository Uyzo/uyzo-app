import type { Listing } from "./supabase";

export function priceStr(l: Pick<Listing, "price" | "currency">): string {
  const n = Math.round(l.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return l.currency === "USD" ? `$${n}` : `${n} сум`;
}

export const INDEX_LABEL: Record<string, { text: string; cls: string; emoji: string }> = {
  low: { text: "Ниже рынка", cls: "bg-green-100 text-green-700", emoji: "🟢" },
  fair: { text: "В рынке", cls: "bg-amber-100 text-amber-700", emoji: "🟡" },
  high: { text: "Выше рынка", cls: "bg-red-100 text-red-700", emoji: "🔴" },
};

export const KIND_EMOJI: Record<string, string> = {
  realty: "🏠",
  goods: "📦",
  service: "🛠️",
};
