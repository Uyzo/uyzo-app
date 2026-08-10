import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { sign, COOKIE } from "@/lib/session";
import { verifyLoginWidget } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Callback Telegram Login Widget: перенаправляет сюда с параметрами id/hash/...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => (query[k] = v));

  const u = verifyLoginWidget(query, process.env.TELEGRAM_BOT_TOKEN || "");
  if (!u) return NextResponse.redirect(new URL("/login?e=tg", url.origin));

  const admin = getAdmin();
  let { data: prof } = await admin.from("profiles").select("id").eq("telegram_id", u.id).maybeSingle();
  if (!prof) {
    const { data: created } = await admin
      .from("profiles")
      .insert({ telegram_id: u.id, full_name: u.first_name || u.username || "Telegram", is_verified: true })
      .select("id")
      .single();
    prof = created ?? null;
  }
  if (!prof) return NextResponse.redirect(new URL("/login?e=tg", url.origin));

  const display = u.username ? "@" + u.username : u.first_name || "Telegram";
  const token = sign({ pid: prof.id, phone: display, iat: Date.now() });
  const res = NextResponse.redirect(new URL("/my", url.origin));
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
