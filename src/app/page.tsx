import Link from "next/link";
import { getSupabase, type Listing } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n-server";
import ListingCard from "./components/ListingCard";
import FilterBar from "./components/FilterBar";
import Mascot from "./components/Mascot";
import SubscribeButton from "./components/SubscribeButton";
import LangSwitcher from "./components/LangSwitcher";

export const dynamic = "force-dynamic";

const RATE = 12700;
const BOT = process.env.NEXT_PUBLIC_TG_BOT || "UyzoAppBot";

const TABS = [
  { key: "sale", tkey: "tab.sale", kind: "realty", deal: "sale" },
  { key: "rent", tkey: "tab.rent", kind: "realty", deal: "rent" },
  { key: "goods", tkey: "tab.goods", kind: "goods", deal: null },
  { key: "service", tkey: "tab.service", kind: "service", deal: null },
];

type SP = {
  tab?: string; q?: string; cur?: string; pmin?: string; pmax?: string;
  district?: string; rooms?: string; owner?: string;
};

export default async function Home({ searchParams }: { searchParams: SP }) {
  const active = TABS.find((tb) => tb.key === searchParams.tab) ?? TABS[0];
  const realty = active.kind === "realty";
  const session = getSession();
  const { lang, t } = getT();
  const cur = searchParams.cur === "USD" ? "USD" : "UZS";
  const q = (searchParams.q ?? "").replace(/[(),]/g, " ").trim();

  let listings: Listing[] = [];
  let error: string | null = null;
  try {
    const supabase = getSupabase();
    const selectStr = searchParams.district
      ? "*, districts!inner(name_ru), listing_photos(url)"
      : "*, districts(name_ru), listing_photos(url)";
    let query = supabase.from("listings").select(selectStr).eq("status", "active").eq("kind", active.kind);
    if (active.deal) query = query.eq("deal_type", active.deal);
    if (searchParams.district) query = query.eq("districts.name_ru", searchParams.district);
    if (realty && searchParams.rooms) {
      query = searchParams.rooms === "5+" ? query.gte("rooms", 5) : query.eq("rooms", Number(searchParams.rooms));
    }
    if (realty && (searchParams.owner === "owner" || searchParams.owner === "agent")) {
      query = query.eq("owner_type", searchParams.owner);
    }
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    query = query.order("is_vip", { ascending: false }).order("created_at", { ascending: false }).limit(100);

    const { data, error: e } = await query;
    if (e) error = e.message;
    listings = (data as unknown as Listing[]) ?? [];

    // фильтр по цене (с учётом валюты) — на стороне сервера в JS
    const mn = searchParams.pmin ? Number(searchParams.pmin) : 0;
    const mx = searchParams.pmax ? Number(searchParams.pmax) : Infinity;
    if (mn > 0 || mx < Infinity) {
      listings = listings.filter((l) => {
        const usd = l.currency === "USD" ? l.price : l.price / RATE;
        const v = cur === "USD" ? usd : usd * RATE;
        return v >= mn && v <= mx;
      });
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Ошибка подключения";
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="px-4">
          <div className="flex items-center gap-3 py-3">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-base text-white">U</span>
              Uyzo
            </Link>
            <span className="hidden text-sm text-slate-400 sm:inline">· {t("city.tashkent")}</span>
            <Link href="/help" className="ml-1 hidden rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:inline-block">
              {t("nav.howto")}
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <LangSwitcher lang={lang} />
              <Link href="/new" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark">
                {t("nav.post")}
              </Link>
              <Link
                href={session ? "/my" : "/login"}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {session ? t("nav.cabinet") : t("nav.login")}
              </Link>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-2">
            {TABS.map((tb) => (
              <Link
                key={tb.key}
                href={`/?tab=${tb.key}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tb.key === active.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t(tb.tkey)}
              </Link>
            ))}
          </nav>

          {active.kind !== "service" && <FilterBar realty={realty} lang={lang} />}
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-violet-600 p-5 text-white">
          <div className="hidden shrink-0 rounded-2xl bg-white/15 p-2 sm:block">
            <Mascot size={72} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:hidden">
              <div className="rounded-xl bg-white/15 p-1"><Mascot size={40} /></div>
              <h2 className="text-lg font-extrabold">{t("hero.welcome")}</h2>
            </div>
            <h2 className="hidden text-xl font-extrabold sm:block">{t("hero.title")}</h2>
            <p className="mt-1 text-sm text-white/85">
              {t("hero.sub")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/new" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-dark">
                {t("hero.postFree")}
              </Link>
              <a
                href={`https://t.me/${BOT}`}
                className="rounded-xl bg-[#229ED9] px-4 py-2 text-sm font-semibold text-white"
              >
                {t("hero.openTg")}
              </a>
            </div>
            <Link href="/help" className="mt-3 inline-block text-xs font-semibold text-white/85 underline underline-offset-2">
              {t("hero.howto")}
            </Link>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 px-4 py-4">
        <h1 className="text-lg font-bold text-slate-900">
          {active.kind === "service" ? t("sect.services") : t(active.tkey)}
        </h1>
        <span className="text-sm text-slate-400">· {listings.length}</span>
        <div className="ml-auto">
          <SubscribeButton lang={lang} />
        </div>
      </div>

      {error && (
        <div className="mx-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {t("error.load")}
        </div>
      )}

      {!error && listings.length === 0 && (
        <div className="px-4 py-16 text-center text-slate-400">
          {active.kind === "service" ? t("empty.service") : t("empty.feed")}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 pb-16 sm:grid-cols-3 lg:grid-cols-4">
        {listings.map((l) => (
          <ListingCard key={l.id} l={l} lang={lang} />
        ))}
      </div>
    </div>
  );
}
