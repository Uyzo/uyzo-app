"use client";

import { t, type Lang } from "@/lib/i18n";

export default function SubDelete({ id, lang = "ru" }: { id: string; lang?: Lang }) {
  async function del() {
    const r = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (r.ok) location.reload();
  }
  return (
    <button onClick={del} className="text-xs font-semibold text-red-600 hover:underline">
      {t(lang, "btn.delete")}
    </button>
  );
}
