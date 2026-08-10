import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const token = crypto.randomUUID().replace(/-/g, "");
  const admin = getAdmin();
  const { error } = await admin.from("login_tokens").insert({ token });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const bot = process.env.NEXT_PUBLIC_TG_BOT || "UyzoAppBot";
  return NextResponse.json({ token, botUrl: `https://t.me/${bot}?start=uyzo_${token}` });
}
