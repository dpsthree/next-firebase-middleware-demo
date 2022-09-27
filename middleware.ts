// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from './functions/src/models/user';

// Must keep this simple as it is not Node based:
// https://nextjs.org/docs/api-reference/edge-runtime

const helloWorldURL =
  'http://localhost:5001/next-middleware-demo/us-central1/helloWorld';

export async function middleware(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (typeof token !== 'string') {
      return NextResponse.redirect(new URL('/404', req.url));
    } else {
      const user = await getUser(token);
      if (userCanAccess(user)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  } catch (e) {
    console.log(e);
  }
  // Find out if the user exists
  // If not, create them
  // Now that there is a user determine if they have access to the system
  // If they don't, redirect them to the subscription page
  // If so, continue
}

function userCanAccess(user: User) {
  return user.canAccess;
}

async function getUser(id: string) {
  var url = new URL(helloWorldURL);
  url.searchParams.append('token', id);
  return (await (await fetch(url)).json()) as User;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
};
