"use client";

import { t, type Lang } from "@/lib/i18n";

export default function ReloginNotice({ lang = "ru" }: { lang?: Lang }) {
  async function relogin() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <div className="mt-10 text-5xl">🔄</div>
      <h1 className="mt-4 text-2xl font-bold">{t(lang, "relogin.title")}</h1>
      <p className="mt-2 text-slate-600">{t(lang, "relogin.sub")}</p>
      <button onClick={relogin} className="mt-6 rounded-xl bg-brand px-6 py-3 font-semibold text-white">
        {t(lang, "relogin.btn")}
      </button>
    </main>
  );
}
