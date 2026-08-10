"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { t as tr, type Lang } from "@/lib/i18n";

const CATS: Record<string, { slug: string; label: Record<Lang, string> }[]> = {
  realty: [
    { slug: "apartment", label: { ru: "Квартира", uz: "Kvartira", en: "Apartment" } },
    { slug: "house", label: { ru: "Дом", uz: "Uy", en: "House" } },
    { slug: "room", label: { ru: "Комната", uz: "Xona", en: "Room" } },
    { slug: "commercial", label: { ru: "Коммерция", uz: "Tijorat", en: "Commercial" } },
  ],
  goods: [
    { slug: "transport", label: { ru: "Транспорт", uz: "Transport", en: "Transport" } },
    { slug: "electronics", label: { ru: "Электроника", uz: "Elektronika", en: "Electronics" } },
    { slug: "home", label: { ru: "Для дома", uz: "Uy uchun", en: "Home" } },
    { slug: "fashion", label: { ru: "Мода", uz: "Moda", en: "Fashion" } },
    { slug: "jobs", label: { ru: "Работа", uz: "Ish", en: "Jobs" } },
  ],
};
const DISTRICTS = [
  "Юнусабадский", "Мирзо-Улугбекский", "Мирабадский", "Яккасарайский",
  "Чиланзарский", "Алмазарский", "Шайхантаурский", "Сергелийский",
  "Учтепинский", "Яшнабадский", "Бектемирский",
];

type Init = {
  id: string; kind: string; deal_type: string | null; title: string; description: string | null;
  price: number; currency: string; rooms: number | null; area: number | null; floor: string | null;
  owner_type: string; districts: { name_ru: string } | null;
};

export default function NewListingForm({ lang = "ru" }: { lang?: Lang }) {
  const sp = useSearchParams();
  const editId = sp.get("id");
  const t = (k: string) => tr(lang, k);

  const [kind, setKind] = useState<"realty" | "goods">("realty");
  const [deal, setDeal] = useState<"sale" | "rent">("sale");
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(!editId);
  const [init, setInit] = useState<Init | null>(null);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await fetch(`/api/listings/${editId}`);
        const j = await res.json();
        if (j.listing) {
          setInit(j.listing);
          setKind(j.listing.kind === "goods" ? "goods" : "realty");
          setDeal(j.listing.deal_type === "rent" ? "rent" : "sale");
        }
      } finally {
        setReady(true);
      }
    })();
  }, [editId]);

  const field = "w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand";
  const label = "mb-1.5 block text-sm font-semibold text-slate-700";

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(e.target.files ?? []).slice(0, 8));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = new FormData(e.currentTarget);
    form.set("kind", kind);
    form.set("deal_type", deal);
    try {
      let res: Response;
      if (editId) {
        res = await fetch(`/api/listings/${editId}`, { method: "PATCH", body: form });
      } else {
        photos.forEach((p) => form.append("photos", p));
        res = await fetch("/api/listings", { method: "POST", body: form });
      }
      const j = await res.json();
      if (res.ok && j.ok) setStatus("done");
      else { setStatus("error"); setMsg(j.error || "Не удалось сохранить"); }
    } catch {
      setStatus("error");
      setMsg("Проблема с сетью");
    }
  }

  if (!ready) return <div className="p-10 text-center text-slate-400">{t("loading")}</div>;

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <div className="mt-10 text-5xl">{editId ? "✅" : "🕒"}</div>
        <h1 className="mt-4 text-2xl font-bold">{editId ? t("form.doneEdit") : t("form.doneNew")}</h1>
        <p className="mt-2 text-slate-600">
          {editId ? t("form.doneEditSub") : t("form.doneNewSub")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/my" className="rounded-xl bg-brand px-5 py-3 font-semibold text-white">{t("form.toMy")}</Link>
          <Link href="/" className="rounded-xl bg-brand-light px-5 py-3 font-semibold text-brand-dark">{t("form.toHome")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Link href={editId ? "/my" : "/"} className="text-2xl">←</Link>
        <b className="text-base">{editId ? t("form.editTitle") : t("form.newTitle")}</b>
      </div>

      <form key={init?.id ?? "new"} onSubmit={submit} className="space-y-4 p-4">
        {!editId && (
          <div className="rounded-2xl bg-gradient-to-br from-brand to-violet-600 p-4 text-white">
            <h3 className="text-sm font-bold">{t("form.aiTitle")}</h3>
            <p className="mb-3 mt-1 text-xs opacity-90">{t("form.aiSub")}</p>
            <button type="button" onClick={aiFill} className="w-full rounded-xl bg-white p-2.5 text-sm font-bold text-brand-dark">
              {t("form.aiBtn")}
            </button>
          </div>
        )}

        {!editId && (
          <div>
            <span className={label}>{t("form.section")}</span>
            <div className="flex gap-2">
              {(["realty", "goods"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setKind(k)}
                  className={`flex-1 rounded-xl border p-3 font-semibold ${kind === k ? "border-brand bg-brand-light text-brand-dark" : "border-slate-200"}`}>
                  {k === "realty" ? t("form.realty") : t("form.goods")}
                </button>
              ))}
            </div>
          </div>
        )}

        {kind === "realty" && (
          <div>
            <span className={label}>{t("form.dealType")}</span>
            <div className="flex gap-2">
              {(["sale", "rent"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDeal(d)}
                  className={`flex-1 rounded-xl border p-3 font-semibold ${deal === d ? "border-brand bg-brand-light text-brand-dark" : "border-slate-200"}`}>
                  {d === "sale" ? t("form.sale") : t("form.rent")}
                </button>
              ))}
            </div>
          </div>
        )}

        {!editId && (
          <div>
            <label className={label}>{t("form.category")}</label>
            <select name="category" className={field} defaultValue={CATS[kind][0].slug} key={kind}>
              {CATS[kind].map((c) => <option key={c.slug} value={c.slug}>{c.label[lang]}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className={label}>{t("form.title")}</label>
          <input name="title" required defaultValue={init?.title ?? ""} placeholder={t("form.titlePh")} className={field} />
        </div>

        <div>
          <label className={label}>{t("form.price")}</label>
          <div className="flex gap-2">
            <input name="price" type="number" defaultValue={init?.price || ""} placeholder={t("form.priceSum")} className={field} onInput={fairHint} />
            <select name="currency" defaultValue={init?.currency ?? "UZS"} className="rounded-xl border border-slate-200 p-3" onChange={fairHint}>
              <option value="UZS">{tr(lang, "u.sum")}</option>
              <option value="USD">$</option>
            </select>
          </div>
          <div className="fairhint mt-2 hidden rounded-xl p-2 text-sm font-semibold" id="fairHint"></div>
        </div>

        {kind === "realty" && (
          <div className="flex gap-2">
            <div className="flex-1"><label className={label}>{t("form.rooms")}</label>
              <input name="rooms" type="number" defaultValue={init?.rooms || ""} placeholder="2" className={field} onInput={fairHint} /></div>
            <div className="flex-1"><label className={label}>{t("form.area")}</label>
              <input name="area" type="number" defaultValue={init?.area || ""} placeholder="58" className={field} onInput={fairHint} /></div>
            <div className="flex-1"><label className={label}>{t("form.floor")}</label>
              <input name="floor" defaultValue={init?.floor ?? ""} placeholder="5/9" className={field} /></div>
          </div>
        )}

        <div>
          <label className={label}>{t("form.district")}</label>
          <select name="district" defaultValue={init?.districts?.name_ru ?? DISTRICTS[0]} className={field} onChange={fairHint}>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        {kind === "realty" && (
          <div>
            <label className={label}>{t("form.who")}</label>
            <select name="owner_type" defaultValue={init?.owner_type ?? "owner"} className={field}>
              <option value="owner">{t("form.owner")}</option>
              <option value="agent">{t("form.agent")}</option>
            </select>
          </div>
        )}

        <div>
          <label className={label}>{t("form.desc")}</label>
          <textarea name="description" rows={3} defaultValue={init?.description ?? ""} placeholder={t("form.descPh")} className={field} />
        </div>

        <div>
          <label className={label}>{t("form.phone")}</label>
          <input name="phone" placeholder="+998 __ ___-__-__" className={field} />
        </div>

        {!editId && (
          <div>
            <label className={label}>{t("form.photos")}</label>
            <input type="file" accept="image/*" multiple onChange={onFiles} className="block w-full text-sm" />
            {photos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={URL.createObjectURL(p)} alt="" className="h-20 w-20 rounded-xl object-cover" />
                ))}
              </div>
            )}
          </div>
        )}

        {status === "error" && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{msg}</div>}

        <button type="submit" disabled={status === "sending"}
          className="w-full rounded-xl bg-brand p-4 text-base font-semibold text-white disabled:opacity-60">
          {status === "sending" ? t("form.saving") : editId ? t("form.save") : t("form.publish")}
        </button>

        {!editId && (
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            {t("form.moderNote")}
          </p>
        )}
      </form>
    </div>
  );

  // — helpers (объявлены через function hoisting) —
  function estMarketUSD() {
    const area = Number((document.getElementById("__area") as HTMLInputElement)?.value) || 0;
    return area;
  }
  function fairHint() {
    const h = document.getElementById("fairHint");
    if (!h) return;
    const priceEl = document.querySelector('input[name="price"]') as HTMLInputElement | null;
    const curEl = document.querySelector('select[name="currency"]') as HTMLSelectElement | null;
    const areaEl = document.querySelector('input[name="area"]') as HTMLInputElement | null;
    const distEl = document.querySelector('select[name="district"]') as HTMLSelectElement | null;
    const price = Number(priceEl?.value) || 0;
    const pc = curEl?.value || "UZS";
    const area = Number(areaEl?.value) || 0;
    const RATE = 12700;
    const PERM2: Record<string, number> = {
      "Мирзо-Улугбекский": 1300, "Яккасарайский": 1300, "Мирабадский": 1250, "Юнусабадский": 1100,
      "Шайхантаурский": 1050, "Алмазарский": 1000, "Чиланзарский": 1000, "Яшнабадский": 900,
      "Учтепинский": 850, "Сергелийский": 800, "Бектемирский": 750,
    };
    if (kind !== "realty" || deal !== "sale" || !price || !area) { h.className = "fairhint mt-2 hidden"; return; }
    const estUsd = area * (PERM2[distEl?.value || ""] ?? 1000);
    const priceUsd = pc === "USD" ? price : price / RATE;
    const r = priceUsd / estUsd;
    const est = pc === "USD" ? "$" + Math.round(estUsd).toLocaleString("ru-RU") : Math.round(estUsd * RATE).toLocaleString("ru-RU") + " " + tr(lang, "u.sum");
    const base = "fairhint mt-2 block rounded-xl p-2 text-sm font-semibold ";
    const aiEst = tr(lang, "d.aiEst");
    if (r < 0.95) { h.className = base + "bg-green-100 text-green-700"; h.textContent = `🟢 ${tr(lang, "idx.low")}. ${aiEst} ${est}`; }
    else if (r > 1.08) { h.className = base + "bg-red-100 text-red-700"; h.textContent = `🔴 ${tr(lang, "idx.high")}. ${aiEst} ${est}`; }
    else { h.className = base + "bg-amber-100 text-amber-700"; h.textContent = `🟡 ${tr(lang, "idx.fair")}. ${aiEst} ${est}`; }
  }
  function aiFill() {
    const setVal = (name: string, v: string) => {
      const el = document.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el) el.value = v;
    };
    const catEl = document.querySelector('select[name="category"]') as HTMLSelectElement | null;
    const distEl = document.querySelector('select[name="district"]') as HTMLSelectElement | null;
    const dist = distEl?.value || "Юнусабадский";
    if (kind === "realty") {
      const rooms = Number((document.querySelector('input[name="rooms"]') as HTMLInputElement)?.value) || 2;
      const area = Number((document.querySelector('input[name="area"]') as HTMLInputElement)?.value) || rooms * 28;
      setVal("rooms", String(rooms)); setVal("area", String(area));
      setVal("title", `${rooms}-комн. ${(catEl?.selectedOptions[0]?.text || "квартира").toLowerCase()}, ${dist.replace(/ский|ый$/, "")}`);
      setVal("description", `Светлая квартира ${area} м² в ${dist.replace(/ский|ый$/, "")} районе. Хорошее состояние, развитая инфраструктура, документы в порядке.`);
      const est = area * 1000;
      setVal("currency", "USD"); setVal("price", String(Math.round(est / 500) * 500));
    } else {
      setVal("title", `${catEl?.selectedOptions[0]?.text || "Товар"} — отличное состояние`);
      setVal("description", "Б/у в отличном состоянии, полностью рабочее, все аксессуары. Возможен небольшой торг при осмотре.");
    }
    fairHint();
  }
}
