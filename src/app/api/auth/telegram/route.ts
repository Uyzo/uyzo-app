import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { sign, COOKIE } from "@/lib/session";
import { verifyInitData } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const u = verifyInitData(initData || "", botToken || "");
    if (!u) {
      return NextResponse.json({ error: "Не удалось проверить Telegram-данные" }, { status: 400 });
    }

    const admin = getAdmin();
    let { data: prof } = await admin.from("profiles").select("id").eq("telegram_id", u.id).maybeSingle();
    if (!prof) {
      const { data: created, error } = await admin
        .from("profiles")
        .insert({ telegram_id: u.id, full_name: u.first_name || u.username || "Telegram", is_verified: true })
        .select("id")
        .single();
      if (error || !created) {
        return NextResponse.json({ error: error?.message || "Не удалось создать профиль" }, { status: 400 });
      }
      prof = created;
    }

    const display = u.username ? "@" + u.username : (u.first_name || "Telegram");
    const token = sign({ pid: prof.id, phone: display, iat: Date.now() });
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
