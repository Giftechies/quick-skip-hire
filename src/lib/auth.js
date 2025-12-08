import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getuserDetails(){
    const key = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = (await cookies()).get("auth_token")?.value

    if(!token){
        return null
    }

   try {
     const {payload} = await jwtVerify(token,key)
     return payload
   } catch (error) {
    return null;
    
    
   }

   
}