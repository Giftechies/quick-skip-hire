// import { NextResponse } from 'next/server';

// /**
//  * This API route is protected by middleware.js.
//  * If the request reaches this function, the session has been validated,
//  * and the user's details (ID and Role) are available in the request headers.
//  */
// export async function GET(request) {
//   try {
//     // 1. Extract User Information from Headers set by middleware.js
//     const userId = request.headers.get('x-user-id');
//     const userRole = request.headers.get('x-user-role');

//     // SECURITY CHECK: This should never happen if middleware is working,
//     // but it's good practice to ensure the necessary headers are present.
//     if (!userId || !userRole) {
//       // If headers are missing, the user wasn't properly authenticated by middleware
//       return NextResponse.json({ success: false, message: 'Authentication failed (missing headers).' }, { status: 401 });
//     }

//     // 2. Authorization Check (Role-Based Access Control - RBAC)
//     // Example: Only 'admin' and 'premium' roles can access this data.
//     if (!['admin', 'premium'].includes(userRole)) {
//       return NextResponse.json({ success: false, message: 'Access denied: Insufficient privileges.' }, { status: 403 });
//     }

//     // 3. Core Business Logic (Only runs for authorized users)
//     const privateData = {
//       message: `Welcome to the secure area, User ID: ${userId}.`,
//       role: userRole,
//       data: {
//         analytics: [100, 150, 120, 200],
//         secretKey: "k_218204" // Fictitious secure data
//       }
//     };

//     // 4. Send the data
//     return NextResponse.json({ success: true, data: privateData });

//   } catch (error) {
//     console.error('Private Data API Error:', error);
//     return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
//   }
// }