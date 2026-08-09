"use client";

import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } }).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
      } catch {
        /* not in Telegram */
      }
    }
  }, []);
  return null;
}
