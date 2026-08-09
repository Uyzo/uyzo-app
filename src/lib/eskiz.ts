// Отправка SMS через Eskiz.uz. Если ключи не заданы — вернёт false (тест-режим).
export async function sendSms(phone998: string, message: string): Promise<boolean> {
  const email = process.env.ESKIZ_EMAIL;
  const password = process.env.ESKIZ_PASSWORD;
  if (!email || !password) return false;
  try {
    const login = await fetch("https://notify.eskiz.uz/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const lj = await login.json();
    const token = lj?.data?.token;
    if (!token) return false;

    const fd = new FormData();
    fd.append("mobile_phone", phone998.replace(/\D/g, ""));
    fd.append("message", message);
    fd.append("from", process.env.ESKIZ_FROM || "4546");

    const res = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    return res.ok;
  } catch {
    return false;
  }
}
