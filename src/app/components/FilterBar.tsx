"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const DISTRICTS = [
  "Юнусабадский", "Мирзо-Улугбекский", "Мирабадский", "Яккасарайский",
  "Чиланзарский", "Алмазарский", "Шайхантаурский", "Сергелийский",
  "Учтепинский", "Яшнабадский", "Бектемирский",
];

export default function FilterBar({ realty }: { realty: boolean }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cur, setCur] = useState(sp.get("cur") ?? "UZS");
  const [pmin, setPmin] = useState(sp.get("pmin") ?? "");
  const [pmax, setPmax] = useState(sp.get("pmax") ?? "");
  const [district, setDistrict] = useState(sp.get("district") ?? "");
  const [rooms, setRooms] = useState(sp.get("rooms") ?? "");
  const [owner, setOwner] = useState(sp.get("owner") ?? "");

  function apply(e?: React.FormEvent) {
    e?.preventDefault();
    const p = new URLSearchParams();
    const tab = sp.get("tab");
    if (tab) p.set("tab", tab);
    if (q.trim()) p.set("q", q.trim());
    if (cur !== "UZS") p.set("cur", cur);
    if (pmin) p.set("pmin", pmin);
    if (pmax) p.set("pmax", pmax);
    if (district) p.set("district", district);
    if (realty && rooms) p.set("rooms", rooms);
    if (realty && owner) p.set("owner", owner);
    router.push(`/?${p.toString()}`);
  }

  function reset() {
    const tab = sp.get("tab");
    router.push(tab ? `/?tab=${tab}` : "/");
    setQ(""); setPmin(""); setPmax(""); setDistrict(""); setRooms(""); setOwner(""); setCur("UZS");
  }

  // мгновенное применение при выборе типа продавца
  function applyOwner(v: string) {
    setOwner(v);
    const p = new URLSearchParams(sp.toString());
    if (v) p.set("owner", v); else p.delete("owner");
    router.push(`/?${p.toString()}`);
  }

  const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand";
  const hasFilters = q || pmin || pmax || district || rooms || owner || cur !== "UZS";

  return (
    <form onSubmit={apply} className="space-y-2 pb-3">
      {realty && (
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
          {[["", "Все"], ["owner", "Собственники"], ["agent", "Агентства"]].map(([v, t]) => (
            <button
              key={v}
              type="button"
              onClick={() => applyOwner(v)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition ${owner === v ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <span className="text-slate-400">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по объявлениям…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <button type="submit" className="rounded-xl bg-brand px-5 text-sm font-semibold text-white">
          Найти
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-xl border border-slate-200">
          {["UZS", "USD"].map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCur(c)}
              className={`px-3 py-2 text-sm font-semibold ${cur === c ? "bg-brand text-white" : "bg-white text-slate-500"}`}
            >
              {c === "UZS" ? "сум" : "$"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1">
          <input value={pmin} onChange={(e) => setPmin(e.target.value)} type="number" placeholder="от" className="w-20 bg-transparent px-1 py-1 text-sm outline-none" />
          <span className="text-slate-300">–</span>
          <input value={pmax} onChange={(e) => setPmax(e.target.value)} type="number" placeholder="до" className="w-20 bg-transparent px-1 py-1 text-sm outline-none" />
        </div>

        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={sel}>
          <option value="">Все районы</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {realty && (
          <select value={rooms} onChange={(e) => setRooms(e.target.value)} className={sel}>
            <option value="">Комнаты</option>
            {["1", "2", "3", "4", "5+"].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        )}

        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Применить</button>
        {hasFilters && (
          <button type="button" onClick={reset} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500">
            Сбросить
          </button>
        )}
      </div>
    </form>
  );
}
