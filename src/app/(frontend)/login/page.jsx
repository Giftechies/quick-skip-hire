"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { loginuser } from "../controllers/loginuser";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const router = useRouter();

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginuser({ username, password });

      if (data?.success) {
    
        router.push("/admin");
      } else {
        
        alert(data?.message || "Login failed");
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
          src="/img/innerimg/skip-hire.jpg"
          alt="background"
          fill
          className="object-cover object-right"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 h-full w-full bg-black/50 z-10" />

      {/* Form container */}
      <div className="h-[300px] w-[500px] m-auto z-30 border border-white/20 p-6 rounded-md text-white bg-white/10 backdrop-blur-sm">
        <form onSubmit={handleForm} className="flex flex-col gap-6 text-white ">
          <div className="log w-24 mx-auto">
            <Image alt="logo" src={"/img/logo/nav-logo.svg"} width={200} height={200} />
          </div>

          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-transparent border"
          />

          <Button type="submit" disabled={loading} className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
