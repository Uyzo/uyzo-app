"use client";

import { useEffect, useState } from "react";

export default function LinkPanel({ phone, hasTelegram }: { phone: string | null; hasTelegram: boolean }) {
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
      setMsg("Telegram привязан ✓"); setTimeout(() => location.reload(), 800);
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
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
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }

  async function linkPhone() {
    setBusy(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/auth/link-phone", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: ph, code }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setMsg("Телефон привязан ✓"); setTimeout(() => location.reload(), 800);
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }

  const card = "rounded-2xl border border-slate-200 bg-white p-4";
  const field = "w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand";

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Привяжите оба способа входа к одному аккаунту, чтобы заходить и по телефону, и через Telegram — и видеть все свои объявления в одном месте.
      </p>

      {/* Телефон */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">📱 Телефон</div>
            <div className="text-sm text-slate-500">{phone ? phone.replace(/^998/, "+998 ") : "не привязан"}</div>
          </div>
          {phone && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">Привязан</span>}
        </div>
        {!phone && step === "idle" && (
          <div className="mt-3 flex gap-2">
            <input className={field} value={ph} onChange={(e) => setPh(e.target.value)} placeholder="+998 90 123-45-67" />
            <button onClick={sendCode} disabled={busy} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">Код</button>
          </div>
        )}
        {!phone && step === "code" && (
          <div className="mt-3">
            {dev && <div className="mb-2 rounded-xl bg-amber-50 p-2 text-sm text-amber-800">Тест-режим: код <b>{dev}</b></div>}
            <div className="flex gap-2">
              <input className={field} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Код" inputMode="numeric" />
              <button onClick={linkPhone} disabled={busy} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">Привязать</button>
            </div>
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">✈️ Telegram</div>
            <div className="text-sm text-slate-500">{hasTelegram ? "привязан" : "не привязан"}</div>
          </div>
          {hasTelegram && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">Привязан</span>}
        </div>
        {!hasTelegram && (
          tgInit ? (
            <button onClick={linkTelegram} disabled={busy} className="mt-3 w-full rounded-xl bg-[#229ED9] p-3 text-sm font-semibold text-white disabled:opacity-60">
              Привязать Telegram
            </button>
          ) : (
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Чтобы привязать Telegram, откройте Uyzo внутри Telegram (через бота) и зайдите сюда снова.
            </p>
          )
        )}
      </div>

      {msg && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{msg}</div>}
      {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    </div>
  );
}
