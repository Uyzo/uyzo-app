import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE = 12700;
const PERM2: Record<string, number> = {
  "Мирзо-Улугбекский": 1300, "Яккасарайский": 1300, "Мирабадский": 1250,
  "Юнусабадский": 1100, "Шайхантаурский": 1050, "Алмазарский": 1000,
  "Чиланзарский": 1000, "Яшнабадский": 900, "Учтепинский": 850,
  "Сергелийский": 800, "Бектемирский": 750,
};

async function ownerCheck(id: string, pid: string) {
  const admin = getAdmin();
  const { data: l } = await admin.from("listings").select("owner_id").eq("id", id).maybeSingle();
  if (!l) return { ok: false, code: 404, msg: "Не найдено" };
  const { data: me } = await admin.from("profiles").select("role").eq("id", pid).maybeSingle();
  if (l.owner_id !== pid && me?.role !== "admin") return { ok: false, code: 403, msg: "Нет прав" };
  return { ok: true };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  const check = await ownerCheck(params.id, session.pid);
  if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.code });
  const admin = getAdmin();
  const { data } = await admin
    .from("listings")
    .select("*, districts(name_ru)")
    .eq("id", params.id)
    .maybeSingle();
  return NextResponse.json({ listing: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  const check = await ownerCheck(params.id, session.pid);
  if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.code });
  const admin = getAdmin();
  const { error } = await admin.from("listings").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  const check = await ownerCheck(params.id, session.pid);
  if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.code });

  const form = await req.formData();
  const s = (k: string) => String(form.get(k) ?? "").trim();
  const n = (k: string) => {
    const v = Number(form.get(k));
    return Number.isFinite(v) && v > 0 ? v : null;
  };
  const admin = getAdmin();

  const districtName = s("district");
  const { data: dist } = districtName
    ? await admin.from("districts").select("id").eq("name_ru", districtName).maybeSingle()
    : { data: null as { id: number } | null };

  const price = Number(form.get("price")) || 0;
  const currency = s("currency") || "UZS";
  const area = n("area");
  const kind = s("kind") || "realty";
  const deal = s("deal_type");
  let priceMarket: number | null = null;
  if (kind === "realty" && deal === "sale" && area) {
    const estUsd = area * (PERM2[districtName] ?? 1000);
    priceMarket = currency === "USD" ? estUsd : estUsd * RATE;
  }

  const update: Record<string, unknown> = {
    title: s("title"),
    description: s("description"),
    price,
    currency,
    rooms: n("rooms"),
    area,
    floor: s("floor") || null,
    owner_type: s("owner_type") || "owner",
    price_market: priceMarket,
  };
  if (deal) update.deal_type = deal;
  if (dist?.id) update.district_id = dist.id;

  const { error } = await admin.from("listings").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: params.id });
}
