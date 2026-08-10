"use client";

import { t, type Lang } from "@/lib/i18n";

export default function LogoutButton({ lang = "ru" }: { lang?: Lang }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button onClick={logout} className="text-sm font-semibold text-slate-500">
      {t(lang, "btn.logout")}
    </button>
  );
}
