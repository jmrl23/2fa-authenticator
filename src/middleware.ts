import { type MiddlewareConfig, type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Unauthorized } from 'http-errors';
import { handler, isAuthorized } from './lib/server/utils';

export const config: MiddlewareConfig = {
  matcher: ['/api/:path*'],
};

export default handler(async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!isAuthorized(request)) throw Unauthorized();
  }
  return NextResponse.next();
});
