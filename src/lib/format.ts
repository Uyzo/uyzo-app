import type { Listing } from "./supabase";
import { t, type Lang } from "./i18n";

const SUM: Record<Lang, string> = { ru: "сум", uz: "so'm", en: "sum" };

export function priceStr(l: Pick<Listing, "price" | "currency">, lang: Lang = "ru"): string {
  if (!l.price || l.price <= 0) return t(lang, "price.negotiable");
  const n = Math.round(l.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return l.currency === "USD" ? `$${n}` : `${n} ${SUM[lang]}`;
}

// Только визуальная часть (цвет + эмодзи). Текст берём через t(lang, "idx.<key>").
export const INDEX_STYLE: Record<string, { cls: string; emoji: string }> = {
  low: { cls: "bg-green-100 text-green-700", emoji: "🟢" },
  fair: { cls: "bg-amber-100 text-amber-700", emoji: "🟡" },
  high: { cls: "bg-red-100 text-red-700", emoji: "🔴" },
};

export function indexText(key: string, lang: Lang): string {
  const map: Record<string, string> = { low: "idx.low", fair: "idx.fair", high: "idx.high" };
  return t(lang, map[key] ?? "idx.fair");
}

export const KIND_EMOJI: Record<string, string> = {
  realty: "🏠",
  goods: "📦",
  service: "🛠️",
};
