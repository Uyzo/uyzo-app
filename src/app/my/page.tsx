import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAdmin } from "@/lib/supabaseAdmin";
import { type Listing } from "@/lib/supabase";
import { priceStr } from "@/lib/format";
import LogoutButton from "../components/LogoutButton";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { t: string; cls: string }> = {
  active: { t: "Активно", cls: "bg-green-100 text-green-700" },
  pending: { t: "На модерации", cls: "bg-amber-100 text-amber-700" },
  rejected: { t: "Отклонено", cls: "bg-red-100 text-red-700" },
  draft: { t: "Черновик", cls: "bg-slate-100 text-slate-600" },
  archived: { t: "В архиве", cls: "bg-slate-100 text-slate-600" },
};

export default async function MyListings() {
  const session = getSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <div className="mt-10 text-5xl">👤</div>
        <h1 className="mt-4 text-2xl font-bold">Мои объявления</h1>
        <p className="mt-2 text-slate-600">Войдите по номеру телефона, чтобы видеть свои объявления.</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">
          Войти
        </Link>
      </main>
    );
  }

  let items: Listing[] = [];
  let isAdmin = false;
  try {
    const admin = getAdmin();
    const { data: me } = await admin.from("profiles").select("role").eq("id", session.pid).maybeSingle();
    isAdmin = me?.role === "admin";
    const { data } = await admin
      .from("listings")
      .select("*, districts(name_ru), listing_photos(url)")
      .eq("owner_id", session.pid)
      .order("created_at", { ascending: false });
    items = (data as Listing[]) ?? [];
  } catch {
    items = [];
  }

  return (
    <main className="mx-auto max-w-2xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-base">Мои объявления</b>
        {isAdmin && (
          <Link href="/admin" className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            Модерация
          </Link>
        )}
        <span className={`${isAdmin ? "" : "ml-auto"} text-sm text-slate-500`}>
          {session.phone.replace(/^998/, "+998 ")}
        </span>
        <LogoutButton />
      </div>

      <div className="p-4">
        <Link href="/new" className="mb-4 block rounded-xl bg-brand p-3 text-center font-semibold text-white">
          ＋ Разместить объявление
        </Link>

        {items.length === 0 ? (
          <div className="py-14 text-center text-slate-500">У вас пока нет объявлений.</div>
        ) : (
          <div className="space-y-3">
            {items.map((l) => {
              const st = STATUS[l.status as string] ?? STATUS.active;
              const photo = l.listing_photos?.[0]?.url;
              return (
                <Link
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-2xl">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "🏠"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{l.title}</div>
                    <div className="text-xs text-slate-500">
                      {priceStr(l)} · {l.districts?.name_ru ?? "Ташкент"}
                    </div>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${st.cls}`}>
                      {st.t}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
