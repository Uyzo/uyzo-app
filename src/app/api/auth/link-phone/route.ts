import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession, normalizePhone } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { phone, code } = await req.json();
    const p = normalizePhone(phone || "");
    const admin = getAdmin();

    const { data: otp } = await admin.from("otp_codes").select("*").eq("phone", p).maybeSingle();
    if (!otp || otp.code !== String(code || "").trim()) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }
    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Код истёк" }, { status: 400 });
    }
    await admin.from("otp_codes").delete().eq("phone", p);

    const { data: other } = await admin.from("profiles").select("id").eq("phone", p).maybeSingle();
    if (other && other.id === session.pid) {
      return NextResponse.json({ ok: true, already: true });
    }
    if (other && other.id !== session.pid) {
      await admin.from("listings").update({ owner_id: session.pid }).eq("owner_id", other.id);
      await admin.from("profiles").delete().eq("id", other.id);
    }
    await admin.from("profiles").update({ phone: p, is_verified: true }).eq("id", session.pid);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка" }, { status: 500 });
  }
}
