"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const route = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if(!email ){
      toast.error("Please fill email field");
      return;
    }
    if(!password ){
      toast.error("Please fill password field");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Login successful!");
      route.push("/quick-skip/admin");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-500/50">
      <Image
        src="/bgPic.webp"
        alt="Admin Login"
        width={600}
        height={400}
        className="-z-20 absolute inset-0 w-full h-full object-cover"
      />
      <div className="z-10 bg-white/10 p-4 rounded-lg shadow-lg max-w-md w-full border border-white/50 backdrop-blur-md">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />

        <form onSubmit={loginHandler}>
          <label className="text-white mb-2 block">Email Address</label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="placeholder:text-white/80"
          />

          <label className="text-white mb-2 block mt-4">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="placeholder:text-white/80"
          />

          <Button
            type="submit"
            className="w-full mt-6 bg-primaryblue/90 hover:bg-primaryblue text-white"
          >
            Login
          </Button>
        </form>
      </div>
    </section>
  );
}
