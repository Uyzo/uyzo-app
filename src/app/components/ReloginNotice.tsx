"use client";

export default function ReloginNotice() {
  async function relogin() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <div className="mt-10 text-5xl">🔄</div>
      <h1 className="mt-4 text-2xl font-bold">Аккаунты объединены</h1>
      <p className="mt-2 text-slate-600">
        Ваши входы теперь ведут в один аккаунт. Войдите заново, чтобы продолжить с объединённым профилем.
      </p>
      <button onClick={relogin} className="mt-6 rounded-xl bg-brand px-6 py-3 font-semibold text-white">
        Войти заново
      </button>
    </main>
  );
}
