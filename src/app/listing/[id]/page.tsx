import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase, type Listing } from "@/lib/supabase";
import { priceStr, INDEX_LABEL, KIND_EMOJI } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: { id: string } }) {
  let l: Listing | null = null;
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("listings")
      .select("*, districts(name_ru), listing_photos(url)")
      .eq("id", params.id)
      .eq("status", "active")
      .single();
    l = data as Listing | null;
  } catch {
    l = null;
  }
  if (!l) notFound();

  const photo = l.listing_photos?.[0]?.url;
  const idx = l.price_index ? INDEX_LABEL[l.price_index] : null;
  const params2 =
    l.kind === "realty"
      ? [
          ["Тип сделки", l.deal_type === "sale" ? "Продажа" : "Аренда"],
          ["Комнаты", l.rooms ?? "—"],
          ["Площадь", l.area ? `${l.area} м²` : "—"],
          ["Этаж", l.floor ?? "—"],
        ]
      : [];

  return (
    <main className="mx-auto max-w-2xl pb-10">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
        <Link href="/" className="text-2xl">
          ←
        </Link>
        <b className="text-sm">Объявление</b>
      </div>

      <div className="flex h-64 items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 text-7xl">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span>{KIND_EMOJI[l.kind]}</span>
        )}
      </div>

      <div className="p-4">
        <div className="text-3xl font-extrabold">{priceStr(l)}</div>
        <div className="mb-3 mt-1 text-lg">{l.title}</div>

        {idx && (
          <div className={`mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${idx.cls}`}>
            {idx.emoji} {idx.text}
            {l.price_market ? ` · оценка Uyzo AI ≈ ${priceStr({ price: l.price_market, currency: l.currency })}` : ""}
          </div>
        )}

        {params2.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {params2.map(([k, v]) => (
              <div key={k} className="rounded-xl border bg-white px-3 py-2 text-xs text-slate-500">
                {k}
                <b className="mt-0.5 block text-sm text-slate-900">{v}</b>
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
          <h4 className="mb-2 text-sm font-semibold">Описание</h4>
          <p className="text-sm text-slate-700">{l.description || "—"}</p>
        </div>

        <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
          <h4 className="mb-1 text-sm font-semibold">📍 Примерное расположение</h4>
          <p className="text-sm text-slate-600">
            {l.districts?.name_ru ?? "Ташкент"} район · примерная зона. Точный адрес — после связи с продавцом.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          ⚠️ Совет Uyzo: осматривайте товар/жильё лично, не вносите предоплату незнакомцам.
        </div>
      </div>
    </main>
  );
}
