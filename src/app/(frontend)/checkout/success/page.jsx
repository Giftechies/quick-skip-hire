export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CheckoutSuccess from "./SuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading…</p>}>
      <CheckoutSuccess />
    </Suspense>
  );
}
