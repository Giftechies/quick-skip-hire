import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import Image from "next/image";

export default function layout ({children}){
    return(
        <html>
            <body className="relative" >
                {/* nav */}
                {/* <div className="fixed z-30 left-1/2  -translate-x-1/2 top-3 container p-6 mx-auto  bg-whit  flex justify-between items-center " >
                <Image src={'/logo.png'} width={150}  height={10} className="h-24" alt="brand-logo" />

              <Button className={'w-fit h-full '} >
                  <UserCircleIcon className={'w-8 h-8 size-8 '} />
              </Button>
                </div>   */}
             <div className="mt-" >
                   {children}
             </div>
            </body>
        </html>
    )
}