// app/checkout/success/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (sessionId) {
      // call your API to confirm payment & update order
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus("Payment successful! Your order is confirmed.");
          } else {
            setStatus("Payment verification failed. Please contact support.");
          }
        });
    }
  }, [sessionId]);

  return <div className="container py-10 text-center">{status}</div>;
}
