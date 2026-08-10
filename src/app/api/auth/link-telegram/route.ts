import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { verifyInitData } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { initData } = await req.json();
    const u = verifyInitData(initData || "", process.env.TELEGRAM_BOT_TOKEN || "");
    if (!u) return NextResponse.json({ error: "Не удалось проверить Telegram" }, { status: 400 });

    const admin = getAdmin();
    const { data: other } = await admin.from("profiles").select("id").eq("telegram_id", u.id).maybeSingle();

    if (other && other.id === session.pid) {
      return NextResponse.json({ ok: true, already: true });
    }
    if (other && other.id !== session.pid) {
      // перенести объявления и удалить второй профиль, освободив telegram_id
      await admin.from("listings").update({ owner_id: session.pid }).eq("owner_id", other.id);
      await admin.from("profiles").delete().eq("id", other.id);
    }
    await admin.from("profiles").update({ telegram_id: u.id, is_verified: true }).eq("id", session.pid);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
