import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone, sign, COOKIE } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();
    const p = normalizePhone(phone || "");
    const admin = getAdmin();

    const { data: otp } = await admin.from("otp_codes").select("*").eq("phone", p).maybeSingle();
    if (!otp || otp.code !== String(code || "").trim()) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }
    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Код истёк, запросите новый" }, { status: 400 });
    }

    // Найти или создать профиль по телефону
    let { data: prof } = await admin.from("profiles").select("id, phone").eq("phone", p).maybeSingle();
    if (!prof) {
      const { data: created, error: e } = await admin
        .from("profiles")
        .insert({ phone: p, is_verified: true })
        .select("id, phone")
        .single();
      if (e || !created) {
        return NextResponse.json({ error: e?.message || "Не удалось создать профиль" }, { status: 400 });
      }
      prof = created;
    }

    await admin.from("otp_codes").delete().eq("phone", p);

    const token = sign({ pid: prof.id, phone: p, iat: Date.now() });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
