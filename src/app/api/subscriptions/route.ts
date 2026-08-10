import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { tgSend } from "@/lib/telegramSend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tgId(pid: string): Promise<number | null> {
  const admin = getAdmin();
  const { data } = await admin.from("profiles").select("telegram_id").eq("id", pid).maybeSingle();
  return (data?.telegram_id as number | null) ?? null;
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ subs: [] });
  const tg = await tgId(session.pid);
  if (!tg) return NextResponse.json({ subs: [] });
  const admin = getAdmin();
  const { data } = await admin.from("subscriptions").select("*").eq("telegram_id", tg).order("created_at", { ascending: false });
  return NextResponse.json({ subs: data ?? [] });
}

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Войдите, чтобы подписаться" }, { status: 401 });
  const tg = await tgId(session.pid);
  if (!tg) {
    return NextResponse.json(
      { error: "Уведомления приходят в Telegram. Войдите через Telegram (или привяжите его в «Аккаунте»)." },
      { status: 400 }
    );
  }

  const b = await req.json();
  const sub = {
    telegram_id: tg,
    kind: b.kind || null,
    deal_type: b.deal || null,
    district: b.district || null,
    rooms: b.rooms || null,
    price_max: b.pmax ? Number(b.pmax) : null,
    currency: b.cur === "USD" ? "USD" : "UZS",
    owner_type: b.owner || null,
    label: b.label || "Новые объявления",
  };
  const admin = getAdmin();
  const { error } = await admin.from("subscriptions").insert(sub);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await tgSend(tg, `🔔 Подписка оформлена!\nБудем присылать новые объявления: <b>${sub.label}</b>`);
  return NextResponse.json({ ok: true });
}
