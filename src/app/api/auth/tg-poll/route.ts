import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { sign, COOKIE } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false });

  const admin = getAdmin();
  const { data: row } = await admin.from("login_tokens").select("*").eq("token", token).maybeSingle();
  if (!row) return NextResponse.json({ ok: false });

  // истечение 10 минут
  if (Date.now() - new Date(row.created_at).getTime() > 10 * 60 * 1000) {
    await admin.from("login_tokens").delete().eq("token", token);
    return NextResponse.json({ ok: false, expired: true });
  }
  if (!row.telegram_id) return NextResponse.json({ ok: false, pending: true });

  // подтверждено ботом → находим/создаём профиль и логиним
  let { data: prof } = await admin.from("profiles").select("id").eq("telegram_id", row.telegram_id).maybeSingle();
  if (!prof) {
    const { data: created } = await admin
      .from("profiles")
      .insert({ telegram_id: row.telegram_id, is_verified: true })
      .select("id")
      .single();
    prof = created ?? null;
  }
  await admin.from("login_tokens").delete().eq("token", token);
  if (!prof) return NextResponse.json({ ok: false });

  const tokenStr = sign({ pid: prof.id, phone: "tg:" + row.telegram_id, iat: Date.now() });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, tokenStr, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
