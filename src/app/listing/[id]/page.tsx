import Link from "next/link";
import { notFound } from "next/navigation";
import { type Listing } from "@/lib/supabase";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { priceStr, INDEX_STYLE, indexText, KIND_EMOJI } from "@/lib/format";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

const STATUS_KEY: Record<string, string> = {
  pending: "st.pending",
  rejected: "st.rejected",
};

export default async function ListingPage({ params }: { params: { id: string } }) {
  const admin = getAdmin();
  const { lang, t } = getT();
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
  const idx = l.price_index ? INDEX_STYLE[l.price_index] : null;
  const statusNote = l.status && STATUS_KEY[l.status] ? t(STATUS_KEY[l.status]) : null;
  const params2 =
    l.kind === "realty"
      ? [
          [t("d.deal"), l.deal_type === "sale" ? t("d.sale") : t("d.rent")],
          [t("d.rooms"), l.rooms ?? "—"],
          [t("d.area"), l.area ? `${l.area} м²` : "—"],
          [t("d.floor"), l.floor ?? "—"],
        ]
      : [];

  return (
    <main className="mx-auto max-w-2xl pb-10">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-sm">{t("d.title")}</b>
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
        <div className="text-3xl font-extrabold">{priceStr(l, lang)}</div>
        <div className="mb-3 mt-1 text-lg">{l.title}</div>

        {idx && l.price_index && (
          <div className={`mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${idx.cls}`}>
            {idx.emoji} {indexText(l.price_index, lang)}
            {l.price_market ? ` · ${t("d.aiEst")} ${priceStr({ price: l.price_market, currency: l.currency }, lang)}` : ""}
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
          <h4 className="mb-2 text-sm font-semibold">{t("d.desc")}</h4>
          <p className="text-sm text-slate-700">{l.description || "—"}</p>
        </div>

        <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="mb-1 text-sm font-semibold">📍 {t("d.loc")}</h4>
          <p className="text-sm text-slate-600">
            {l.districts?.name_ru ?? t("city.tashkent")} {t("d.locNote")}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {t("d.safe")}
        </div>
      </div>
    </main>
  );
}
