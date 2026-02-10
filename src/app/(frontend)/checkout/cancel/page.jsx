'use client'
import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// app/checkout/cancel/page.js
export default function CheckoutCancel() {

  const route = useRouter();

  return (
    <div className="relative py-20 min-h-screen  " >
      <Image src={'/bgPic.webp'} width={250} height={250} alt="banner-pic" className="w-full h-full inset-0 absolute -z-20 object-center object-cover " />
      <div className="bg-[#0b1d54]/80 w-full absolute inset-0 -z-10" />
      <form
        className="container relative  z-30  py-8    flex flex-col items-center gap-8 rounded-lg  bg-white  shadow-md"
      >
        <div className=" z-30  top-3 container  mx-auto  bg-whit  flex justify-between items-center " >
          <Image src={'/logo.png'} width={150} height={10} className="h-24" alt="brand-logo" />

          <Button onClick={() => route.push("/profile")} className={'w-fit h-full cursor-pointer '} >
            <UserCircleIcon className={'w-8 h-8 size-8 '} />
          </Button>
        </div>
        <h1 className="h2 title-animation text-center  font-oswald     ">
          Your Skip, Ready to Hire
        </h1>
        <div className="container py-10 text-center" >
          Payment was canceled.<div onClick={() => route.push("/")} style={{ cursor: "pointer", textDecoration: "underline" }} >You can retry your order.</div>
        </div>
      </form>
    </div >
  );
}
