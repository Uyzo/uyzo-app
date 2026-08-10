import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { tgSend, SITE_URL } from "@/lib/telegramSend";
import { priceStr } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE = 12700;

// Разослать подписчикам подходящие новые объявления
async function notifySubscribers(id: string) {
  const admin = getAdmin();
  const { data: l } = await admin
    .from("listings")
    .select("*, districts(name_ru)")
    .eq("id", id)
    .maybeSingle();
  if (!l) return;
  const { data: subs } = await admin.from("subscriptions").select("*");
  const districtName = (l.districts as { name_ru: string } | null)?.name_ru ?? null;

  const matches = (subs ?? []).filter((s) => {
    if (s.kind && s.kind !== l.kind) return false;
    if (s.deal_type && s.deal_type !== l.deal_type) return false;
    if (s.district && s.district !== districtName) return false;
    if (s.rooms) {
      if (s.rooms === "5+") { if (!(l.rooms >= 5)) return false; }
      else if (String(l.rooms) !== s.rooms) return false;
    }
    if (s.owner_type && s.owner_type !== l.owner_type) return false;
    if (s.price_max) {
      const usd = l.currency === "USD" ? l.price : l.price / RATE;
      const v = s.currency === "USD" ? usd : usd * RATE;
      if (v > Number(s.price_max)) return false;
    }
    return true;
  });

  const text =
    `🆕 Новое объявление по вашей подписке\n` +
    `<b>${l.title}</b>\n` +
    `${priceStr({ price: l.price, currency: l.currency })}` +
    `${districtName ? ` · 📍 ${districtName}` : ""}`;
  const url = `${SITE_URL}/listing/${l.id}`;
  for (const s of matches) {
    await tgSend(s.telegram_id, text, url);
  }
}

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const admin = getAdmin();
    const { data: me } = await admin.from("profiles").select("role").eq("id", session.pid).maybeSingle();
    if (me?.role !== "admin") return NextResponse.json({ error: "Нет прав" }, { status: 403 });

    const { id, action } = await req.json();
    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }
    const status = action === "approve" ? "active" : "rejected";
    const { error } = await admin.from("listings").update({ status }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await admin.from("moderation_log").insert({ listing_id: id, admin_id: session.pid, action });

    if (action === "approve") {
      try { await notifySubscribers(id); } catch { /* уведомления не критичны */ }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
