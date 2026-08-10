"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TgLoginButton from "./TgLoginButton";
import { t, type Lang } from "@/lib/i18n";

const BOT = process.env.NEXT_PUBLIC_TG_BOT || "UyzoAppBot";
const TG_URL = `https://t.me/${BOT}`;

export default function LoginClient({ lang = "ru" }: { lang?: Lang }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [tgInit, setTgInit] = useState("");

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp;
    if (tg?.initData) setTgInit(tg.initData);
  }, []);

  async function loginTelegram() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: tgInit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      window.location.href = "/my";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/" className="text-2xl">←</Link>
        <div className="flex items-center gap-2 text-2xl font-extrabold text-brand">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-lg text-white">U</span>
          Uyzo
        </div>
      </div>

      <h1 className="mb-1 text-2xl font-bold">{t(lang, "login.title")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t(lang, "login.sub")}</p>

      <div className="mb-5">
        {tgInit ? (
          <>
            <button
              onClick={loginTelegram}
              disabled={busy}
              className="w-full rounded-xl bg-[#229ED9] p-4 text-base font-semibold text-white disabled:opacity-60"
            >
              {t(lang, "login.tg")}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">{t(lang, "login.note")}</p>
          </>
        ) : (
          <>
            <TgLoginButton lang={lang} />
            <a href={TG_URL} className="mt-3 block text-center text-xs font-semibold text-[#229ED9]">
              {t(lang, "login.openApp")}
            </a>
          </>
        )}
      </div>

      {err && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    </main>
  );
}
