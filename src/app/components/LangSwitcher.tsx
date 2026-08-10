"use client";

import { LANGS, COOKIE_LANG, type Lang } from "@/lib/i18n";

export default function LangSwitcher({ lang }: { lang: Lang }) {
  function set(l: Lang) {
    if (l === lang) return;
    document.cookie = `${COOKIE_LANG}=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }
  return (
    <div className="flex overflow-hidden rounded-lg border border-slate-200">
      {LANGS.map((x) => (
        <button
          key={x.code}
          type="button"
          onClick={() => set(x.code)}
          className={`px-2 py-1 text-xs font-bold transition ${
            x.code === lang ? "bg-brand text-white" : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          {x.label}
        </button>
      ))}
    </div>
  );
}
