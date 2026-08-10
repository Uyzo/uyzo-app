import { cookies } from "next/headers";
import { COOKIE_LANG, type Lang, t } from "./i18n";

export function getLang(): Lang {
  const v = cookies().get(COOKIE_LANG)?.value;
  return v === "uz" || v === "en" ? v : "ru";
}

// Удобный серверный переводчик, привязанный к текущему языку
export function getT(): { lang: Lang; t: (key: string) => string } {
  const lang = getLang();
  return { lang, t: (key: string) => t(lang, key) };
}
