"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

const MAP: Record<string, { kind: string; deal: string | null; tkey: string }> = {
  sale: { kind: "realty", deal: "sale", tkey: "d.sale" },
  rent: { kind: "realty", deal: "rent", tkey: "d.rent" },
  goods: { kind: "goods", deal: null, tkey: "tab.goods" },
  service: { kind: "service", deal: null, tkey: "tab.service" },
};

export default function SubscribeButton({ lang = "ru" }: { lang?: Lang }) {
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
    const parts = [t(lang, m.tkey)];
    if (district) parts.push(district);
    if (rooms) parts.push(rooms + " " + t(lang, "u.rooms"));
    if (pmax) parts.push(t(lang, "f.to") + " " + pmax + (cur === "USD" ? " $" : " " + t(lang, "u.sum")));
    if (owner === "owner") parts.push(t(lang, "f.owners").toLowerCase());
    if (owner === "agent") parts.push(t(lang, "f.agencies").toLowerCase());
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

  if (state === "done") return <span className="text-sm font-semibold text-emerald-600">{t(lang, "sub.done")}</span>;

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={subscribe}
        disabled={state === "busy"}
        className="rounded-xl border border-brand px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand-light disabled:opacity-60"
      >
        {t(lang, "sub.btn")}
      </button>
      {state === "err" && <span className="mt-1 max-w-[240px] text-right text-xs text-red-600">{msg}</span>}
    </div>
  );
}
