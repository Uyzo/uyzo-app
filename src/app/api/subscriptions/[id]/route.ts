import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  const admin = getAdmin();
  const { data: me } = await admin.from("profiles").select("telegram_id").eq("id", session.pid).maybeSingle();
  const tg = me?.telegram_id as number | null;
  // удаляем только свою подписку (по своему telegram_id)
  const { error } = await admin.from("subscriptions").delete().eq("id", params.id).eq("telegram_id", tg ?? -1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
