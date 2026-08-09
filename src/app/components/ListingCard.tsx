import Link from "next/link";
import type { Listing } from "@/lib/supabase";
import { priceStr, INDEX_LABEL, KIND_EMOJI } from "@/lib/format";

export default function ListingCard({ l }: { l: Listing }) {
  const photo = l.listing_photos?.[0]?.url;
  const idx = l.price_index ? INDEX_LABEL[l.price_index] : null;
  const meta =
    l.kind === "realty"
      ? [l.rooms ? `${l.rooms} комн.` : null, l.area ? `${l.area} м²` : null, l.floor].filter(Boolean).join(" · ")
      : "";

  return (
    <Link
      href={`/listing/${l.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-4xl opacity-70">
            {KIND_EMOJI[l.kind]}
          </div>
        )}
        {l.is_vip && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-950 shadow">
            VIP
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-extrabold tracking-tight text-slate-900">{priceStr(l)}</span>
          {idx && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${idx.cls}`}
              title={`Оценка Uyzo AI`}
            >
              {idx.emoji}
            </span>
          )}
        </div>
        <div className="mt-1 line-clamp-2 min-h-[2.4em] text-[13px] leading-snug text-slate-700">{l.title}</div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          {l.kind === "realty" && (
            <span
              className={`rounded px-1.5 py-0.5 font-semibold ${
                l.owner_type === "owner" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              }`}
            >
              {l.owner_type === "owner" ? "Собственник" : "Агентство"}
            </span>
          )}
          {meta && <span>{meta}</span>}
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
          <span>📍 {l.districts?.name_ru ?? "Ташкент"}</span>
        </div>
      </div>
    </Link>
  );
}
