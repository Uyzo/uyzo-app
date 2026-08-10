import Link from "next/link";
import { notFound } from "next/navigation";
import { type Listing } from "@/lib/supabase";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { priceStr, INDEX_LABEL, KIND_EMOJI } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_NOTE: Record<string, string> = {
  pending: "На модерации — видно только вам, пока админ не одобрит.",
  rejected: "Объявление отклонено модератором.",
  draft: "Черновик.",
  archived: "В архиве.",
};

export default async function ListingPage({ params }: { params: { id: string } }) {
  const admin = getAdmin();
  let l: Listing | null = null;
  try {
    const { data } = await admin
      .from("listings")
      .select("*, districts(name_ru), listing_photos(url)")
      .eq("id", params.id)
      .maybeSingle();
    l = data as Listing | null;
  } catch {
    l = null;
  }
  if (!l) notFound();

  // Неактивные объявления видит только владелец или админ
  if (l.status !== "active") {
    const session = getSession();
    let allowed = false;
    if (session) {
      const isOwner = (l as unknown as { owner_id: string }).owner_id === session.pid;
      const { data: me } = await admin.from("profiles").select("role").eq("id", session.pid).maybeSingle();
      allowed = isOwner || me?.role === "admin";
    }
    if (!allowed) notFound();
  }

  const photo = l.listing_photos?.[0]?.url;
  const idx = l.price_index ? INDEX_LABEL[l.price_index] : null;
  const statusNote = l.status && l.status !== "active" ? STATUS_NOTE[l.status] : null;
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
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-sm">Объявление</b>
      </div>

      {statusNote && (
        <div className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          🕒 {statusNote}
        </div>
      )}

      <div className="mt-4 flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 text-7xl">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="opacity-70">{KIND_EMOJI[l.kind]}</span>
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
              <div key={k} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                {k}
                <b className="mt-0.5 block text-sm text-slate-900">{v}</b>
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-semibold">Описание</h4>
          <p className="text-sm text-slate-700">{l.description || "—"}</p>
        </div>

        <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
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
