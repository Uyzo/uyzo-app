import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAdmin } from "@/lib/supabaseAdmin";
import LinkPanel from "../components/LinkPanel";
import ReloginNotice from "../components/ReloginNotice";
import SubDelete from "../components/SubDelete";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const session = getSession();
  if (!session) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <div className="mt-10 text-5xl">👤</div>
        <h1 className="mt-4 text-2xl font-bold">Аккаунт</h1>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">Войти</Link>
      </main>
    );
  }

  const admin = getAdmin();
  const { data: me } = await admin.from("profiles").select("phone, telegram_id, full_name").eq("id", session.pid).maybeSingle();
  if (!me) return <ReloginNotice />;

  let subs: { id: string; label: string }[] = [];
  if (me.telegram_id) {
    const { data } = await admin.from("subscriptions").select("id, label").eq("telegram_id", me.telegram_id).order("created_at", { ascending: false });
    subs = (data as { id: string; label: string }[]) ?? [];
  }

  return (
    <main className="mx-auto max-w-md pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/my" className="text-2xl">←</Link>
        <b className="text-base">Аккаунт и вход</b>
      </div>
      <div className="space-y-6 p-4">
        <LinkPanel phone={me?.phone ?? null} hasTelegram={!!me?.telegram_id} />

        <div>
          <h2 className="mb-2 text-sm font-bold text-slate-700">🔔 Подписки на новые объявления</h2>
          {!me.telegram_id ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              Уведомления приходят в Telegram. Привяжите Telegram выше — и подписки станут доступны.
            </p>
          ) : subs.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              Подписок пока нет. На главной задайте фильтры и нажмите «🔔 Уведомлять о новых».
            </p>
          ) : (
            <div className="space-y-2">
              {subs.map((s) => (
                <div key={s.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                  <span className="flex-1 text-sm">{s.label}</span>
                  <SubDelete id={s.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
