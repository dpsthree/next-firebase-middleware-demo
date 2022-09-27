// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Must keep this simple as it is not Node based:
// https://nextjs.org/docs/api-reference/edge-runtime

const helloWorldURL =
  'http://localhost:5001/next-middleware-demo/us-central1/helloWorld';



export async function middleware(request: NextRequest) {
  try {
    var url = new URL(helloWorldURL);
     url.searchParams.append('token', '12345');
    
    const results = await (await fetch(url)).json();
    console.log(results);
  } catch (e) {
    console.log(e);
  }
  // Find out if the user exists
  // If not, create them
  // Now that there is a user determine if they have access to the system
  // If they don't, redirect them to the subscription page
  // If so, continue
  return NextResponse.redirect(new URL('/login', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
};
