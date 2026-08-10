"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const MAP: Record<string, { kind: string; deal: string | null; label: string }> = {
  sale: { kind: "realty", deal: "sale", label: "Продажа" },
  rent: { kind: "realty", deal: "rent", label: "Аренда" },
  goods: { kind: "goods", deal: null, label: "Объявления" },
  service: { kind: "service", deal: null, label: "Мастера" },
};

export default function SubscribeButton() {
  const sp = useSearchParams();
  const [state, setState] = useState<"idle" | "busy" | "done" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function subscribe() {
    const tab = sp.get("tab") || "sale";
    const m = MAP[tab] || MAP.sale;
    const district = sp.get("district") || "";
    const rooms = sp.get("rooms") || "";
    const pmax = sp.get("pmax") || "";
    const cur = sp.get("cur") || "UZS";
    const owner = sp.get("owner") || "";
    const parts = [m.label];
    if (district) parts.push(district);
    if (rooms) parts.push(rooms + " комн.");
    if (pmax) parts.push("до " + pmax + (cur === "USD" ? " $" : " сум"));
    if (owner === "owner") parts.push("собственники");
    if (owner === "agent") parts.push("агентства");
    const label = parts.join(" · ");

    setState("busy");
    setMsg("");
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: m.kind, deal: m.deal, district, rooms, pmax, cur, owner, label }),
      });
      const j = await res.json();
      if (res.ok && j.ok) setState("done");
      else { setState("err"); setMsg(j.error || "Ошибка"); }
    } catch {
      setState("err");
      setMsg("Ошибка сети");
    }
  }

  if (state === "done") return <span className="text-sm font-semibold text-emerald-600">🔔 Подписка оформлена</span>;

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={subscribe}
        disabled={state === "busy"}
        className="rounded-xl border border-brand px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand-light disabled:opacity-60"
      >
        🔔 Уведомлять о новых
      </button>
      {state === "err" && <span className="mt-1 max-w-[240px] text-right text-xs text-red-600">{msg}</span>}
    </div>
  );
}
