import { Suspense } from "react";
import NewListingForm from "../components/NewListingForm";
import { getLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default function NewListingPage() {
  const lang = getLang();
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">{t(lang, "loading")}</div>}>
      <NewListingForm lang={lang} />
    </Suspense>
  );
}
