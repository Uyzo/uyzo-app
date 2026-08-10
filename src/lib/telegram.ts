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

// Проверка данных Telegram Login Widget (вход на сайте в браузере)
export function verifyLoginWidget(query: Record<string, string>, botToken: string): TgUser | null {
  if (!botToken || !query.hash) return null;
  const { hash, ...rest } = query;
  const dcs = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const secret = crypto.createHash("sha256").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secret).update(dcs).digest("hex");
  if (computed !== hash) return null;
  return { id: Number(rest.id), first_name: rest.first_name, username: rest.username };
}
