"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  const verifyOtp = async () => {
    if (!otp || !email) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, otpCode: otp }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
        router.push("/profile");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" relative grid h-screen place-content-center  text-white">
        {/* bg img */}
        <div className="absolute inset-0 h-full w-full overflow-hidden -z-20 ">
            <Image
            src={'https://images.unsplash.com/photo-1599995903128-531fc7fb694b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3RydWN0aW9uJTIwc2l0ZXxlbnwwfHwwfHx8MA%3D%3D'}
            fill
            alt="login-pic"
            className="object-cover object-right"
            />
        </div>
        <div className="  absolute inset-0 h-full w-ful bg-black/50 -z-10 " />
      <div className="p-8 bg-white/10 border rounded-md w-[400px] backdrop-blur">
        <h2 className="text-xl mb-4">Verify OTP</h2>
        <p className="text-sm mb-6">
          OTP sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          className="w-full p-2 text-black border border-white rounded placeholder:text-white/50  "
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
