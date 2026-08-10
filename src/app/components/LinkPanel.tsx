"use client";

import { useEffect, useState } from "react";
import { t as tr, type Lang } from "@/lib/i18n";

export default function LinkPanel({ phone, hasTelegram, lang = "ru" }: { phone: string | null; hasTelegram: boolean; lang?: Lang }) {
  const t = (k: string) => tr(lang, k);
  const [tgInit, setTgInit] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // телефонная привязка
  const [step, setStep] = useState<"idle" | "code">("idle");
  const [ph, setPh] = useState("+998 ");
  const [code, setCode] = useState("");
  const [dev, setDev] = useState("");

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp;
    if (tg?.initData) setTgInit(tg.initData);
  }, []);

  async function linkTelegram() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/auth/link-telegram", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: tgInit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setMsg(t("link.tgDone")); setTimeout(() => location.reload(), 800);
    } catch (e) { setErr(e instanceof Error ? e.message : t("err.generic")); } finally { setBusy(false); }
  }

  async function sendCode() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: ph }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setDev(j.devCode || ""); if (j.devCode) setCode(j.devCode); setStep("code");
    } catch (e) { setErr(e instanceof Error ? e.message : t("err.generic")); } finally { setBusy(false); }
  }

  async function linkPhone() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/auth/link-phone", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: ph, code }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setMsg(t("link.phoneDone")); setTimeout(() => location.reload(), 800);
    } catch (e) { setErr(e instanceof Error ? e.message : t("err.generic")); } finally { setBusy(false); }
  }

  const card = "rounded-2xl border border-slate-200 bg-white p-4";
  const field = "w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand";

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {t("link.intro")}
      </p>

      {/* Телефон */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{t("link.phone")}</div>
            <div className="text-sm text-slate-500">{phone ? phone.replace(/^998/, "+998 ") : t("link.notLinked")}</div>
          </div>
          {phone && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">{t("link.linked")}</span>}
        </div>
        {!phone && step === "idle" && (
          <div className="mt-3 flex gap-2">
            <input className={field} value={ph} onChange={(e) => setPh(e.target.value)} placeholder="+998 90 123-45-67" />
            <button onClick={sendCode} disabled={busy} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">{t("link.getCode")}</button>
          </div>
        )}
        {!phone && step === "code" && (
          <div className="mt-3">
            {dev && <div className="mb-2 rounded-xl bg-amber-50 p-2 text-sm text-amber-800">{t("link.testMode")} <b>{dev}</b></div>}
            <div className="flex gap-2">
              <input className={field} value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("link.codePh")} inputMode="numeric" />
              <button onClick={linkPhone} disabled={busy} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">{t("link.bind")}</button>
            </div>
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{t("link.tg")}</div>
            <div className="text-sm text-slate-500">{hasTelegram ? t("link.linked").toLowerCase() : t("link.notLinked")}</div>
          </div>
          {hasTelegram && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">{t("link.linked")}</span>}
        </div>
        {!hasTelegram && (
          tgInit ? (
            <button onClick={linkTelegram} disabled={busy} className="mt-3 w-full rounded-xl bg-[#229ED9] p-3 text-sm font-semibold text-white disabled:opacity-60">
              {t("link.bindTg")}
            </button>
          ) : (
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              {t("link.tgHint")}
            </p>
          )
        )}
      </div>

      {msg && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{msg}</div>}
      {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    </div>
  );
}
