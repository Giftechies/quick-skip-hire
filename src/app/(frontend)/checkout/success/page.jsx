// app/checkout/success/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [status, setStatus] = useState("Verifying payment...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Simulate API call to verify payment
      // Replace with your actual fetch call to /api/checkout/verify
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus("Payment successful! Your order has been placed and confirmed.");
            setIsSuccess(true);
          } else {
            setStatus("Payment verification failed. Please contact support immediately with your session ID.");
            setIsSuccess(false);
          }
        })
        .catch(error => {
            console.error("Verification error:", error);
            setStatus("An unexpected error occurred. Please check your email for confirmation or contact support.");
            setIsSuccess(false);
        })
        .finally(() => {
            setIsLoading(false);
        });
    } else {
      setStatus("Error: No payment session was found.");
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <>
      {/* ⚠️ IMPORTANT: These styles are for the checkmark animation. 
          Move them to your global CSS file (globals.css) for best practice. */}
      <style jsx global>{`
        @keyframes checkmark {
          0% { stroke-dashoffset: 50px; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes checkmark-circle {
          0% { stroke-dashoffset: 157px; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .checkmark {
          display: block;
          stroke-width: 2;
          stroke: #4CAF50; /* Success green */
          stroke-miterlimit: 10;
        }
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4CAF50;
          fill: none;
          animation: checkmark-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmark 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        .animate-spin-fast {
            animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transition-all duration-500 hover:shadow-xl">
          
          <div className="text-center">
            
            {/* Loading/Animation Area */}
            {isLoading && (
              <div className="flex justify-center mb-6">
                <div className="animate-spin-fast rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
              </div>
            )}

            {!isLoading && isSuccess && (
              <div className="flex justify-center mb-6">
                {/* Animated checkmark SVG */}
                <svg className="checkmark w-24 h-24" viewBox="0 0 52 52">
                  <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            )}

            {!isLoading && !isSuccess && (
              <div className="flex justify-center mb-6">
                {/* Error icon */}
                <svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            )}

            {/* Title and Status */}
            <h2 className={`mt-6 text-3xl font-extrabold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isLoading ? "Processing Payment..." : (isSuccess ? "Success! " : "Action Required")}
            </h2>
            <p className="mt-2 text-md text-gray-700">
              {status}
            </p>
          </div>

          {/* Action Buttons */}
          {!isLoading && (
            <div className="mt-8 flex flex-col gap-4">
              {isSuccess ? (
                <>
                  <Link href="/profile">
                    <button
                      type="button"
                      className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition duration-150"
                    >
                      View My Order
                    </button>
                  </Link>
                  <Link href="/">
                    <button
                      type="button"
                      className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition duration-150"
                    >
                      Go to Home Page
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/contact">
                  <button
                    type="button"
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-md transition duration-150"
                  >
                    Get Support Now
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}