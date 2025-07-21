import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Agar user login nahi hai aur dashboard access karne ki koshish kar raha hai,
  // to use sign-in page par bhej do.
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Agar user login hai aur sign-in, sign-up, verify, ya home page par jaane
  // ki koshish kar raha hai, to use dashboard par bhej do.
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Baaki sab cases mein, request ko aage badhne do.
  return NextResponse.next();
}

// Middleware ko in paths par chalao.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',

    
  ],
};