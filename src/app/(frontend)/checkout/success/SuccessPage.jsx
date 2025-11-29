"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState("Verifying payment…");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setStatus("Error: No session found.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success) {
          setIsSuccess(true);
          setStatus("Payment successful! Your order is now confirmed.");
        } else {
          setIsSuccess(false);
          setStatus("Verification failed. Contact support with your session ID.");
        }
      } catch (err) {
        setIsSuccess(false);
        setStatus("Unexpected error. Contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">

          {isLoading && (
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          )}

          {!isLoading && isSuccess && (
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-green-600" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M14 27l7 7 16-16"
                />
              </svg>
            </div>
          )}

          {!isLoading && !isSuccess && (
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 
                     9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          <h2 className={`mt-6 text-3xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {isLoading ? "Processing…" : isSuccess ? "Success!" : "Action Required"}
          </h2>

          <p className="mt-2 text-md text-gray-700">{status}</p>
        </div>

        {!isLoading && (
          <div className="mt-8 flex flex-col gap-4">
            {isSuccess ? (
              <>
                <Link href="/profile">
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    View My Order
                  </button>
                </Link>
                <Link href="/">
                  <button className="w-full py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                    Go Home
                  </button>
                </Link>
              </>
            ) : (
              <Link href="/contact">
                <button className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Contact Support
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
