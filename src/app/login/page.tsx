import LoginClient from "../components/LoginClient";
import { getLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default function Login() {
  const lang = getLang();
  return <LoginClient lang={lang} />;
}
