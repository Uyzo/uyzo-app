"use client";

import { useEffect, useRef } from "react";

export default function TelegramLoginWidget({ bot }: { bot: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.async = true;
    s.setAttribute("data-telegram-login", bot);
    s.setAttribute("data-size", "large");
    s.setAttribute("data-radius", "12");
    s.setAttribute("data-request-access", "write");
    s.setAttribute("data-auth-url", window.location.origin + "/api/auth/telegram-widget");
    ref.current.appendChild(s);
  }, [bot]);
  return <div ref={ref} className="flex justify-center" />;
}
