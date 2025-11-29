"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid h-screen place-content-center text-white">
      {/* Background Image */}
      <div className="absolute inset-0 h-full w-full overflow-hidden -z-20">
        <Image
          src={
            "https://images.unsplash.com/photo-1599995903128-531fc7fb694b?w=600&auto=format&fit=crop&q=60"
          }
          fill
          alt="login-bg"
          className="object-cover object-right"
        />
      </div>
      <div className="absolute inset-0 h-full w-full bg-black/50 -z-10" />

      {/* OTP Container */}
      <div className="p-8 bg-white/10 border rounded-md w-[400px] backdrop-blur">
        <h2 className="text-xl mb-4 font-semibold">Verify OTP</h2>

        <p className="text-sm mb-6">
          OTP sent to <strong>{email}</strong>
        </p>

        {/* ShadCN OTP Input */}
        <InputOTP
          value={otp}
          onChange={setOtp}
          maxLength={6}
          className="w-full justify-center"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

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
