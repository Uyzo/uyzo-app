"use client";

import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!confirm("Удалить это объявление? Действие необратимо.")) return;
    setBusy(true);
    const r = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (r.ok) location.reload();
    else { alert("Не удалось удалить"); setBusy(false); }
  }
  return (
    <button onClick={del} disabled={busy}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
      Удалить
    </button>
  );
}
