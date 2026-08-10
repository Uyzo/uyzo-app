"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BOT = process.env.NEXT_PUBLIC_TG_BOT || "UyzoAppBot";
const TG_URL = `https://t.me/${BOT}`;

export default function Login() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("+998 ");
  const [code, setCode] = useState("");
  const [dev, setDev] = useState("");
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

  const field = "w-full rounded-xl border border-slate-200 p-3 text-lg outline-none focus:border-brand";

  async function request() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setDev(j.devCode || "");
      if (j.devCode) setCode(j.devCode);
      setStep("code");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
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

      <h1 className="mb-1 text-2xl font-bold">Вход</h1>
      <p className="mb-6 text-sm text-slate-500">
        {step === "phone" ? "Введите номер телефона — пришлём код." : `Код отправлен на ${phone}`}
      </p>

      <div className="mb-5">
        {tgInit ? (
          <button
            onClick={loginTelegram}
            disabled={busy}
            className="w-full rounded-xl bg-[#229ED9] p-4 text-base font-semibold text-white disabled:opacity-60"
          >
            ✈️ Войти через Telegram
          </button>
        ) : (
          <a
            href={TG_URL}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] p-4 text-base font-semibold text-white"
          >
            ✈️ Открыть в Telegram
          </a>
        )}
        <p className="mt-2 text-center text-xs text-slate-400">
          {tgInit ? "Быстрый вход в один тап" : "Рекомендуем: вход в один тап, без SMS"}
        </p>
        <div className="my-4 flex items-center gap-3 text-xs text-slate-300">
          <div className="h-px flex-1 bg-slate-200" /> или по телефону <div className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      {step === "phone" ? (
        <>
          <input
            className={field}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="+998 90 123-45-67"
          />
          <button
            onClick={request}
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-brand p-4 text-base font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Отправляем…" : "Получить код"}
          </button>
        </>
      ) : (
        <>
          {dev && (
            <div className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              Тест-режим (SMS ещё не подключён): ваш код <b>{dev}</b>
            </div>
          )}
          <input
            className={field}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="6-значный код"
            maxLength={6}
          />
          <button
            onClick={verify}
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-brand p-4 text-base font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Проверяем…" : "Войти"}
          </button>
          <button onClick={() => setStep("phone")} className="mt-3 w-full text-sm text-slate-500">
            Изменить номер
          </button>
        </>
      )}

      {err && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    </main>
  );
}
