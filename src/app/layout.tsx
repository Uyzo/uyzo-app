import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import TelegramInit from "./components/TelegramInit";

export const metadata: Metadata = {
  title: "Uyzo — объявления, недвижимость, мастера · Ташкент",
  description: "Умный маркетплейс объявлений Узбекистана: недвижимость, товары, мастера.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
