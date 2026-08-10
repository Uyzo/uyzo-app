"use client";

export default function SubDelete({ id }: { id: string }) {
  async function del() {
    const r = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (r.ok) location.reload();
  }
  return (
    <button onClick={del} className="text-xs font-semibold text-red-600 hover:underline">
      Удалить
    </button>
  );
}
