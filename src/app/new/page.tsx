"use client";

import { useState } from "react";
import Link from "next/link";

const CATS: Record<string, { slug: string; t: string }[]> = {
  realty: [
    { slug: "apartment", t: "Квартира" },
    { slug: "house", t: "Дом" },
    { slug: "room", t: "Комната" },
    { slug: "commercial", t: "Коммерция" },
  ],
  goods: [
    { slug: "transport", t: "Транспорт" },
    { slug: "electronics", t: "Электроника" },
    { slug: "home", t: "Для дома" },
    { slug: "fashion", t: "Мода" },
    { slug: "jobs", t: "Работа" },
  ],
};

const DISTRICTS = [
  "Юнусабадский", "Мирзо-Улугбекский", "Мирабадский", "Яккасарайский",
  "Чиланзарский", "Алмазарский", "Шайхантаурский", "Сергелийский",
  "Учтепинский", "Яшнабадский", "Бектемирский",
];

export default function NewListing() {
  const [kind, setKind] = useState<"realty" | "goods">("realty");
  const [deal, setDeal] = useState<"sale" | "rent">("sale");
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [newId, setNewId] = useState("");

  const field = "w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand";
  const label = "mb-1.5 block text-sm font-semibold";

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).slice(0, 8);
    setPhotos(list);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = new FormData(e.currentTarget);
    form.set("kind", kind);
    form.set("deal_type", deal);
    photos.forEach((p) => form.append("photos", p));
    try {
      const res = await fetch("/api/listings", { method: "POST", body: form });
      const j = await res.json();
      if (res.ok && j.ok) {
        setNewId(j.id);
        setStatus("done");
      } else {
        setStatus("error");
        setMsg(j.error || "Не удалось отправить");
      }
    } catch {
      setStatus("error");
      setMsg("Проблема с сетью");
    }
  }

  if (status === "done") {
    return (
      <main className="mx-auto max-w-2xl p-6 text-center">
        <div className="mt-10 text-5xl">🕒</div>
        <h1 className="mt-4 text-2xl font-bold">Отправлено на модерацию</h1>
        <p className="mt-2 text-slate-600">
          Мы проверим объявление и опубликуем его в ленте. Статус видно в «Моих объявлениях».
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/my" className="rounded-xl bg-brand px-5 py-3 font-semibold text-white">
            Мои объявления
          </Link>
          <Link href="/" className="rounded-xl bg-brand-light px-5 py-3 font-semibold text-brand-dark">
            На главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
        <Link href="/" className="text-2xl">←</Link>
        <b className="text-base">Новое объявление</b>
      </div>

      <form onSubmit={submit} className="space-y-4 p-4">
        <div>
          <span className={label}>Раздел</span>
          <div className="flex gap-2">
            {(["realty", "goods"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`flex-1 rounded-xl border p-3 font-semibold ${
                  kind === k ? "border-brand bg-brand-light text-brand-dark" : "border-slate-200"
                }`}
              >
                {k === "realty" ? "Недвижимость" : "Товар / услуга"}
              </button>
            ))}
          </div>
        </div>

        {kind === "realty" && (
          <div>
            <span className={label}>Тип сделки</span>
            <div className="flex gap-2">
              {(["sale", "rent"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeal(d)}
                  className={`flex-1 rounded-xl border p-3 font-semibold ${
                    deal === d ? "border-brand bg-brand-light text-brand-dark" : "border-slate-200"
                  }`}
                >
                  {d === "sale" ? "Продажа" : "Аренда"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className={label}>Категория</label>
          <select name="category" className={field} defaultValue={CATS[kind][0].slug} key={kind}>
            {CATS[kind].map((c) => (
              <option key={c.slug} value={c.slug}>{c.t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Заголовок</label>
          <input name="title" required placeholder="Напр. 2-комн. квартира, Юнусабад" className={field} />
        </div>

        <div>
          <label className={label}>Цена</label>
          <div className="flex gap-2">
            <input name="price" type="number" placeholder="Сумма" className={field} />
            <select name="currency" className="rounded-xl border border-slate-200 p-3" defaultValue="UZS">
              <option value="UZS">сум</option>
              <option value="USD">$</option>
            </select>
          </div>
        </div>

        {kind === "realty" && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={label}>Комнат</label>
              <input name="rooms" type="number" placeholder="2" className={field} />
            </div>
            <div className="flex-1">
              <label className={label}>Площадь, м²</label>
              <input name="area" type="number" placeholder="58" className={field} />
            </div>
            <div className="flex-1">
              <label className={label}>Этаж</label>
              <input name="floor" placeholder="5/9" className={field} />
            </div>
          </div>
        )}

        <div>
          <label className={label}>Район</label>
          <select name="district" className={field} defaultValue={DISTRICTS[0]}>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        {kind === "realty" && (
          <div>
            <label className={label}>Кто размещает</label>
            <select name="owner_type" className={field} defaultValue="owner">
              <option value="owner">Собственник</option>
              <option value="agent">Агентство</option>
            </select>
          </div>
        )}

        <div>
          <label className={label}>Описание</label>
          <textarea name="description" rows={3} placeholder="Опишите объект/товар подробно…" className={field} />
        </div>

        <div>
          <label className={label}>Телефон</label>
          <input name="phone" placeholder="+998 __ ___-__-__" className={field} />
        </div>

        <div>
          <label className={label}>Фотографии (до 8)</label>
          <input type="file" accept="image/*" multiple onChange={onFiles} className="block w-full text-sm" />
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={URL.createObjectURL(p)}
                  alt=""
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {status === "error" && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{msg}</div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-brand p-4 text-base font-semibold text-white disabled:opacity-60"
        >
          {status === "sending" ? "Отправляем…" : "Опубликовать"}
        </button>

        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          На этом этапе объявление публикуется сразу. Модерацию перед публикацией включим вместе с админ-панелью и входом по SMS.
        </p>
      </form>
    </main>
  );
}
