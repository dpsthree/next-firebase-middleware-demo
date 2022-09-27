// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Must keep this simple as it is not Node based:
// https://nextjs.org/docs/api-reference/edge-runtime
export function middleware(request: NextRequest) {
  // Find out if the user exists
  // If not, create them
  // Now that there is a user determine if they have access to the system
  // If they don't, redirect them to the subscription page
  // If so, continue
  return NextResponse.redirect(new URL('/login', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}