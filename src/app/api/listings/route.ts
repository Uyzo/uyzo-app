import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE = 12700;
// оценка стоимости за м² (USD) по району — для «честной цены» realty sale
const PERM2: Record<string, number> = {
  "Мирзо-Улугбекский": 1300, "Яккасарайский": 1300, "Мирабадский": 1250,
  "Юнусабадский": 1100, "Шайхантаурский": 1050, "Алмазарский": 1000,
  "Чиланзарский": 1000, "Яшнабадский": 900, "Учтепинский": 850,
  "Сергелийский": 800, "Бектемирский": 750,
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const s = (k: string) => String(form.get(k) ?? "").trim();
    const n = (k: string) => {
      const v = Number(form.get(k));
      return Number.isFinite(v) && v > 0 ? v : null;
    };

    const kind = s("kind") || "realty";
    const deal = s("deal_type");
    const categorySlug = s("category");
    const title = s("title");
    const price = Number(form.get("price")) || 0;
    const currency = s("currency") || "UZS";
    const rooms = n("rooms");
    const area = n("area");
    const floor = s("floor") || null;
    const districtName = s("district");
    const description = s("description");
    const phone = s("phone");
    const ownerType = s("owner_type") || "owner";

    if (!title) return NextResponse.json({ error: "Введите заголовок" }, { status: 400 });

    const admin = getAdmin();

    // Владелец: вошедший пользователь; если не вошёл — первый профиль (демо)
    const session = getSession();
    let ownerId = session?.pid;
    if (!ownerId) {
      const { data: prof } = await admin.from("profiles").select("id").limit(1).single();
      if (!prof) {
        return NextResponse.json(
          { error: "В базе нет ни одного профиля. Запустите seed.sql в Supabase." },
          { status: 400 }
        );
      }
      ownerId = prof.id;
    }

    const { data: cat } = categorySlug
      ? await admin.from("categories").select("id").eq("slug", categorySlug).maybeSingle()
      : { data: null as { id: number } | null };
    const { data: dist } = districtName
      ? await admin.from("districts").select("id").eq("name_ru", districtName).maybeSingle()
      : { data: null as { id: number } | null };

    let priceMarket: number | null = null;
    if (kind === "realty" && deal === "sale" && area) {
      const estUsd = area * (PERM2[districtName] ?? 1000);
      priceMarket = currency === "USD" ? estUsd : estUsd * RATE;
    }

    const { data: inserted, error: insErr } = await admin
      .from("listings")
      .insert({
        owner_id: ownerId,
        kind,
        deal_type: kind === "realty" ? deal || "sale" : null,
        category_id: cat?.id ?? null,
        title,
        description,
        price,
        currency,
        price_market: priceMarket,
        rooms,
        area,
        floor,
        district_id: dist?.id ?? null,
        owner_type: ownerType,
        status: "active", // временно публикуем сразу; модерацию включим вместе с админ-панелью
      })
      .select("id")
      .single();

    if (insErr || !inserted) {
      return NextResponse.json({ error: insErr?.message || "Не удалось создать объявление" }, { status: 400 });
    }

    // Фото → Supabase Storage (bucket listing-photos)
    const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    let sort = 0;
    for (const file of files.slice(0, 8)) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${inserted.id}/${sort}.${ext}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { error: upErr } = await admin.storage
        .from("listing-photos")
        .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: true });
      if (!upErr) {
        const { data: pub } = admin.storage.from("listing-photos").getPublicUrl(path);
        await admin.from("listing_photos").insert({ listing_id: inserted.id, url: pub.publicUrl, sort_order: sort });
      }
      sort++;
    }

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ошибка сервера" }, { status: 500 });
  }
}
