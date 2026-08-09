import crypto from "node:crypto";

export type TgUser = { id: number; first_name?: string; username?: string };

// Проверка подлинности данных Telegram Mini App (initData) ботом
export function verifyInitData(initData: string, botToken: string): TgUser | null {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const pairs = Array.from(params.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${v}`);
  const dataCheckString = pairs.join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  if (computed !== hash) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    const u = JSON.parse(userRaw);
    return { id: u.id, first_name: u.first_name, username: u.username };
  } catch {
    return null;
  }
}
