"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button onClick={logout} className="text-sm font-semibold text-slate-500">
      Выйти
    </button>
  );
}
