import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './app/lib/auth'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  // Check if the user is authenticated
  const response = await authMiddleware(request)
  return response
}

// Configure which routes should be protected
export const config = {
  matcher: [
    // Only protect these specific routes
    '/dashboard/:path*',
    '/tasks/:path*',
    '/invoices/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ],
}


