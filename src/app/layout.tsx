import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import TelegramInit from "./components/TelegramInit";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Uyzo — объявления, недвижимость, мастера · Ташкент",
  description: "Умный маркетплейс объявлений Узбекистана: недвижимость, товары, мастера.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  return (
    <html lang={lang}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
