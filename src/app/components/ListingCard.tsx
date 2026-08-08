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
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 text-4xl">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span>{KIND_EMOJI[l.kind]}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-extrabold">{priceStr(l)}</span>
          {idx && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${idx.cls}`}>
              {idx.emoji} {idx.text}
            </span>
          )}
        </div>
        <div className="line-clamp-2 text-sm">{l.title}</div>
        {l.kind === "realty" && (
          <span
            className={`w-fit rounded px-2 py-0.5 text-[10px] font-bold ${
              l.owner_type === "owner" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {l.owner_type === "owner" ? "Собственник ✓" : "Агентство"}
          </span>
        )}
        {meta && <div className="mt-auto text-xs text-slate-500">{meta}</div>}
        <div className="text-xs text-slate-500">📍 {l.districts?.name_ru ?? "Ташкент"}</div>
      </div>
    </Link>
  );
}
