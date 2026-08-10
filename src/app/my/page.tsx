import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAdmin } from "@/lib/supabaseAdmin";
import { type Listing } from "@/lib/supabase";
import { priceStr } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import LogoutButton from "../components/LogoutButton";
import DeleteButton from "../components/DeleteButton";
import ReloginNotice from "../components/ReloginNotice";

export const dynamic = "force-dynamic";

const STATUS_CLS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-slate-100 text-slate-600",
};

export default async function MyListings() {
  const session = getSession();
  const { lang, t } = getT();

  if (!session) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <div className="mt-10 text-5xl">👤</div>
        <h1 className="mt-4 text-2xl font-bold">{t("my.title")}</h1>
        <p className="mt-2 text-slate-600">{t("my.needLogin")}</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white">
          {t("nav.login")}
        </Link>
      </main>
    );
  }

  const admin = getAdmin();
  const { data: me } = await admin.from("profiles").select("role").eq("id", session.pid).maybeSingle();
  if (!me) return <ReloginNotice lang={lang} />;
  const isAdmin = me.role === "admin";

  let items: Listing[] = [];
  try {
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
        <b className="text-base">{t("my.title")}</b>
        {isAdmin && (
          <Link href="/admin" className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            {t("my.moderation")}
          </Link>
        )}
        <Link href="/settings" className={`${isAdmin ? "" : "ml-auto"} text-sm font-semibold text-slate-500 hover:text-brand`}>
          {t("my.account")}
        </Link>
        <LogoutButton lang={lang} />
      </div>

      <div className="p-4">
        <Link href="/new" className="mb-4 block rounded-xl bg-brand p-3 text-center font-semibold text-white">
          {t("my.postCta")}
        </Link>

        {items.length === 0 ? (
          <div className="py-14 text-center text-slate-500">{t("my.empty")}</div>
        ) : (
          <div className="space-y-3">
            {items.map((l) => {
              const stKey = (l.status as string) || "active";
              const stCls = STATUS_CLS[stKey] ?? STATUS_CLS.active;
              const photo = l.listing_photos?.[0]?.url;
              return (
                <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/listing/${l.id}`} className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-2xl">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        "🏠"
                      )}
                    </Link>
                    <Link href={`/listing/${l.id}`} className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{l.title}</div>
                      <div className="text-xs text-slate-500">
                        {priceStr(l, lang)} · {l.districts?.name_ru ?? t("city.tashkent")}
                      </div>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${stCls}`}>
                        {t("s." + stKey)}
                      </span>
                    </Link>
                  </div>
                  <div className="mt-2 flex justify-end gap-1 border-t border-slate-100 pt-2">
                    <Link href={`/new?id=${l.id}`} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-light">
                      {t("btn.edit")}
                    </Link>
                    <DeleteButton id={l.id} lang={lang} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
