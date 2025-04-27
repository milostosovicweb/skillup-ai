// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

export function middleware() {
//   const isLoggedIn = request.cookies.get('sb-access-token')?.value;
//   const path = request.nextUrl.pathname;

//   // Allow unauthenticated access to root (/) and signin pages
//   if (path === '/' || path.startsWith('/signin')) {
//     return NextResponse.next();
//   }

//   // Redirect to signin if not logged in and trying to access any other page
//   if (!isLoggedIn) {
//     return NextResponse.redirect(new URL('/signin', request.url));
//   }

//   return NextResponse.next();
}

// Apply middleware on all paths except root (/) and signin
export const config = {
//   matcher: ['/:path*'],
};
