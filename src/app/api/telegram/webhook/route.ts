import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://uyzo-app.vercel.app";

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return NextResponse.json({ ok: true });

    const update = await req.json();
    const msg = update?.message;
    const text: string = msg?.text || "";
    const chatId = msg?.chat?.id;
    const fromId = msg?.from?.id;
    const name = msg?.from?.first_name || "";

    // Подтверждение входа на сайте: /start uyzo_<token>
    const loginMatch = text.match(/^\/start\s+uyzo_(\S+)/);
    if (chatId && fromId && loginMatch) {
      const loginToken = loginMatch[1];
      const admin = getAdmin();
      await admin.from("login_tokens").update({ telegram_id: fromId }).eq("token", loginToken);
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "✅ Вход подтверждён! Вернитесь на сайт — вы уже вошли." }),
      });
      return NextResponse.json({ ok: true });
    }

    if (chatId && text.startsWith("/start")) {
      const welcome =
        `Салом${name ? ", " + name : ""}! 👋\n\n` +
        `Добро пожаловать в *Uyzo* — маркетплейс недвижимости, товаров и мастеров в Ташкенте.\n\n` +
        `🏠 Найдите квартиру, дом или нужную вещь\n` +
        `✅ Честная пометка: собственник или агентство\n` +
        `📸 Разместите своё объявление за минуту — бесплатно\n\n` +
        `Нажмите кнопку ниже, чтобы открыть Uyzo 👇`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcome,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "🏠 Открыть Uyzo", web_app: { url: SITE } }]],
          },
        }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
