import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { sendSms } from "@/lib/eskiz";
import { normalizePhone } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const p = normalizePhone(phone || "");
    if (p.length !== 12) {
      return NextResponse.json({ error: "Введите номер в формате +998 XX XXX-XX-XX" }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const admin = getAdmin();
    await admin.from("otp_codes").upsert({ phone: p, code, expires_at: expires, attempts: 0 });

    const sent = await sendSms(p, `Uyzo: ваш код входа ${code}`);

    // Если SMS не настроен (нет ключей Eskiz) — тест-режим: показываем код на экране
    return NextResponse.json(sent ? { ok: true } : { ok: true, devCode: code });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
