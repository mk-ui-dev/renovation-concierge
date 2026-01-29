import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/login') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token.value, secret);
        const user = payload as any;
        
        // Redirect authenticated users away from login
        if (user.role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/client', request.url));
        }
      } catch (error) {
        // Invalid token, allow access to login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/client')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token.value, secret);
      const user = payload as any;

      // Role-based access control
      if (pathname.startsWith('/dashboard') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/client', request.url));
      }

      if (pathname.startsWith('/client') && user.role !== 'client') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/client/:path*'],
};
