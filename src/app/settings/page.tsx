import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAdmin } from "@/lib/supabaseAdmin";
import LinkPanel from "../components/LinkPanel";
import ReloginNotice from "../components/ReloginNotice";

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

  return (
    <main className="mx-auto max-w-md pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/my" className="text-2xl">←</Link>
        <b className="text-base">Аккаунт и вход</b>
      </div>
      <div className="p-4">
        <LinkPanel phone={me?.phone ?? null} hasTelegram={!!me?.telegram_id} />
      </div>
    </main>
  );
}
