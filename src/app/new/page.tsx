import { Suspense } from "react";
import NewListingForm from "../components/NewListingForm";

export const dynamic = "force-dynamic";

export default function NewListingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Загрузка…</div>}>
      <NewListingForm />
    </Suspense>
  );
}
