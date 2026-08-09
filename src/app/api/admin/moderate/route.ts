import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
