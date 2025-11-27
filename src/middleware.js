
import { NextResponse }  from "next/server";
import { jwtVerify } from "jose";


export async function middleware(req){
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const admin_only_paths = ["/admin", "/quick-skip/admin"];
  const admin_only_api = ['/api/form'];
  const authorized_user_paths = [ "/profile", "/profile/edit" ];
  const authorized_user_api = [  "/api/order" ];
  const public_paths = ["/login", "/verify-otp", ];
  const url = req.nextUrl.clone();
  
  let token = req.cookies.get("auth_token")?.value;
  // console.log("midk>>",token);
  
  if(!token){
    token = req.headers.get('Authorization')?.startsWith('Bearer ') ? req.headers.get('Authorization').split(' ')[1] : null;
    if(!token){
      if(authorized_user_paths.includes(req.nextUrl.pathname) || admin_only_paths.includes(req.nextUrl.pathname)){
        console.log("mi12>>",token);
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      if(authorized_user_api.includes(req.nextUrl.pathname) || admin_only_api.includes(req.nextUrl.pathname)){
        return NextResponse.json({success:false, message:"Unauthorized"}, {status:401});
      }
      return NextResponse.next();
  }
}

const {payload} = await jwtVerify(token,secret);
const userRole = payload?.role?.toLowerCase().trim( );

if(userRole !== 'admin'){
  if(admin_only_paths.includes(req.nextUrl.pathname)){
    if(userRole==='customer'){
      url.pathname = '/profile';
      return NextResponse.redirect(url);
    }
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if(admin_only_api.includes(req.nextUrl.pathname)){
    return NextResponse.json({success:false, message:"Unauthorized"}, {status:401});
  }
}

if(userRole === 'admin'){
  if(authorized_user_paths.includes(req.nextUrl.pathname)){
    url.pathname = '/quick-skip/admin';
    return NextResponse.redirect(url);
  }
}

if(userRole === 'admin' || userRole === 'customer'){
  if(public_paths.includes(req.nextUrl.pathname)){
    url.pathname = userRole === 'admin' ? '/quick-skip/admin' : '/profile';
    return NextResponse.redirect(url);
  }
}

  return NextResponse.next();


}

export const config = {
  mathcher: ["/admin/:path*", "/quick-skip/admin/:path*", "/profile/:path*", "/profile", "/login", "/verify-otp", "/api/form/:path*", "/api/order/:path*"]  
}