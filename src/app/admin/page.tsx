import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAdmin } from "@/lib/supabaseAdmin";
import { type Listing } from "@/lib/supabase";
import { priceStr } from "@/lib/format";
import ModerateButtons from "../components/ModerateButtons";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const session = getSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <div className="mt-10 text-5xl">🔒</div>
        <h1 className="mt-4 text-2xl font-bold">Админ-панель</h1>
        <p className="mt-2 text-slate-600">Войдите, чтобы продолжить.</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">
          Войти
        </Link>
      </main>
    );
  }

  const admin = getAdmin();
  const { data: me } = await admin.from("profiles").select("role").eq("id", session.pid).maybeSingle();

  if (me?.role !== "admin") {
    return (
      <main className="mx-auto max-w-lg p-6">
        <div className="mb-4 text-center text-5xl">🔒</div>
        <h1 className="mb-2 text-center text-2xl font-bold">Нет доступа</h1>
        <p className="mb-4 text-center text-slate-600">
          Чтобы стать администратором, выполните этот запрос в Supabase → SQL Editor:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-green-300">
{`update profiles set role='admin'
where id='${session.pid}';`}
        </pre>
        <p className="mt-3 text-center text-xs text-slate-400">Затем обновите эту страницу.</p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-brand">← На главную</Link>
        </div>
      </main>
    );
  }

  let items: Listing[] = [];
  try {
    const { data } = await admin
      .from("listings")
      .select("*, districts(name_ru), listing_photos(url)")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    items = (data as Listing[]) ?? [];
  } catch {
    items = [];
  }

  return (
    <main className="mx-auto max-w-3xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-base">Модерация</b>
        <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
          {items.length} на проверке
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-slate-500">✅ Очередь пуста. Новых объявлений на проверке нет.</div>
      ) : (
        <div className="space-y-3 p-4">
          {items.map((l) => {
            const photo = l.listing_photos?.[0]?.url;
            return (
              <div key={l.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-3xl">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "🏠"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{l.title}</div>
                  <div className="text-sm text-slate-600">
                    {priceStr(l)} · {l.districts?.name_ru ?? "Ташкент"}
                    {l.kind === "realty" && l.owner_type ? (l.owner_type === "owner" ? " · Собственник" : " · Агентство") : ""}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-slate-500">{l.description}</div>
                </div>
                <ModerateButtons id={l.id} />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
