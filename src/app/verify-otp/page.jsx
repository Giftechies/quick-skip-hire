import { Suspense } from "react";
import VerifyOtpPage from "./VerifyComponent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      
      <VerifyOtpPage />
    </Suspense>
  );
}
