"use client";

import { useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export default function TgLoginButton({ lang = "ru" }: { lang?: Lang }) {
  const [state, setState] = useState<"idle" | "wait" | "err">("idle");
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function start() {
    setState("wait");
    setMsg("");
    try {
      const r = await fetch("/api/auth/tg-start", { method: "POST" });
      const j = await r.json();
      if (!j.token) throw new Error("Не удалось начать вход");
      window.open(j.botUrl, "_blank");

      const t0 = Date.now();
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(async () => {
        if (Date.now() - t0 > 180000) {
          if (timer.current) clearInterval(timer.current);
          setState("err");
          setMsg("Время ожидания вышло. Попробуйте снова.");
          return;
        }
        try {
          const pr = await fetch("/api/auth/tg-poll?token=" + j.token);
          const pj = await pr.json();
          if (pj.ok) {
            if (timer.current) clearInterval(timer.current);
            window.location.href = "/my";
          }
        } catch {
          /* keep polling */
        }
      }, 2000);
    } catch (e) {
      setState("err");
      setMsg(e instanceof Error ? e.message : "Ошибка");
    }
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={state === "wait"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] p-4 text-base font-semibold text-white disabled:opacity-70"
      >
        {t(lang, "login.tg")}
      </button>
      {state === "wait" && (
        <p className="mt-2 text-center text-xs text-slate-500">{t(lang, "login.wait")}</p>
      )}
      {state !== "wait" && (
        <p className="mt-2 text-center text-xs text-slate-400">{t(lang, "login.note")}</p>
      )}
      {state === "err" && <p className="mt-1 text-center text-xs text-red-600">{msg}</p>}
    </div>
  );
}
