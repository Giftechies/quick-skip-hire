"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RequestOtp } from "@/app/apiCalls/form";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const router = useRouter();

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await RequestOtp(email);

      if (data?.success) {
   
  router.push(`/verify-otp?email=${email}`);

      } else {
        
       toast.error(data.message);
      }
    } catch (err) {
    
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid h-screen">
      {/* Background image */}
      <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
        <Image
          src="https://images.unsplash.com/photo-1599995903128-531fc7fb694b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3RydWN0aW9uJTIwc2l0ZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="background"
          fill
          className="object-cover object-right"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 h-full w-full bg-black/50 z-10" />

      {/* Form container */}
      <div className="h-[250px] w-[500px] m-auto z-30 border border-white/20 p-6 rounded-md text-white bg-white/10 backdrop-blur-sm">
        <form onSubmit={handleForm} className="flex flex-col gap-2 text-white ">
          <div className="log w-FULL mx-auto">
            {/* <Image alt="logo" src={"/img/logo/nav-logo.svg"} width={200} height={200} /> */}
            QUICK SKIP HIRE

          </div>
           <label htmlFor="Email" className="text-sm font-medium">Email</label>  
          <input
            type="email"
            name="Email"
            id="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border"
          />

          

          <Button type="submit" disabled={loading} className=" mt-6 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
