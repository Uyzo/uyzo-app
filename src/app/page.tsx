import Link from "next/link";
import { getSupabase, type Listing } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import ListingCard from "./components/ListingCard";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "sale", label: "🏷️ Купить", kind: "realty", deal: "sale" },
  { key: "rent", label: "🔑 Снять", kind: "realty", deal: "rent" },
  { key: "goods", label: "🛒 Объявления", kind: "goods", deal: null },
  { key: "service", label: "🛠️ Мастера", kind: "service", deal: null },
];

export default async function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const active = TABS.find((t) => t.key === searchParams.tab) ?? TABS[0];
  const session = getSession();

  let listings: Listing[] = [];
  let error: string | null = null;
  try {
    const supabase = getSupabase();
    let q = supabase
      .from("listings")
      .select("*, districts(name_ru), listing_photos(url)")
      .eq("status", "active")
      .eq("kind", active.kind)
      .order("is_vip", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60);
    if (active.deal) q = q.eq("deal_type", active.deal);
    const { data, error: e } = await q;
    if (e) error = e.message;
    listings = (data as Listing[]) ?? [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Ошибка подключения";
  }

  return (
    <main className="mx-auto max-w-4xl">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="flex items-center gap-2 px-4 pb-2 pt-3">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-brand">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-lg text-white">
              U
            </span>
            Uyzo
          </div>
          <Link
            href="/new"
            className="ml-auto rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            ＋ Разместить
          </Link>
          <Link
            href={session ? "/my" : "/login"}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            {session ? "👤 Мои" : "Войти"}
          </Link>
          <span className="hidden text-sm font-semibold text-slate-500 sm:inline">📍 Ташкент</span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/?tab=${t.key}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                t.key === active.key ? "bg-brand text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="flex items-center px-4 pb-2 pt-3">
        <h1 className="text-lg font-bold">{active.label.replace(/^\S+\s/, "")}</h1>
        <span className="ml-auto text-sm text-slate-500">{listings.length} шт.</span>
      </div>

      {error && (
        <div className="mx-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Не удалось загрузить объявления. Проверьте переменные окружения Supabase на Vercel.
          <div className="mt-1 text-xs opacity-70">{error}</div>
        </div>
      )}

      {!error && listings.length === 0 && (
        <div className="p-14 text-center text-sm text-slate-500">
          Пока пусто. Запустите <code>seed.sql</code> в Supabase, чтобы добавить примеры объявлений.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} l={l} />
        ))}
      </div>
    </main>
  );
}
