"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export default function DeleteButton({ id, lang = "ru" }: { id: string; lang?: Lang }) {
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!confirm(t(lang, "del.confirm"))) return;
    setBusy(true);
    const r = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (r.ok) location.reload();
    else { alert(t(lang, "del.fail")); setBusy(false); }
  }
  return (
    <button onClick={del} disabled={busy}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
      {t(lang, "btn.delete")}
    </button>
  );
}
