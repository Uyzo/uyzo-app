import crypto from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
export const COOKIE = "uyzo_session";

export type Session = { pid: string; phone: string; iat: number };

export function sign(payload: Session): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verify(token?: string | null): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expect = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

// Читать сессию в серверных компонентах
export function getSession(): Session | null {
  return verify(cookies().get(COOKIE)?.value);
}

// Нормализация узбекского номера в формат 998XXXXXXXXX
export function normalizePhone(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (d.length === 9) d = "998" + d; // 9XXXXXXXX
  if (d.length === 12 && d.startsWith("998")) return d;
  return d;
}
