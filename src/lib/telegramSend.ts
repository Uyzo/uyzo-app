const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://uyzo-app.vercel.app";

// Отправка сообщения пользователю в Telegram через бота
export async function tgSend(chatId: number | string, text: string, openUrl?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: false };
  if (openUrl) {
    body.reply_markup = { inline_keyboard: [[{ text: "🏠 Открыть в Uyzo", web_app: { url: openUrl } }]] };
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    /* ignore */
  }
}

export const SITE_URL = SITE;
