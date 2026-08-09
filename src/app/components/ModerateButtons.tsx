"use client";

import { useState } from "react";

export default function ModerateButtons({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const j = await res.json();
        alert(j.error || "Ошибка");
        setBusy(false);
      }
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => act("approve")}
        disabled={busy}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        ✓ Одобрить
      </button>
      <button
        onClick={() => act("reject")}
        disabled={busy}
        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
      >
        ✕ Отклонить
      </button>
    </div>
  );
}
