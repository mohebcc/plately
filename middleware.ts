import { NextRequest, NextResponse } from 'next/server';

// Public routes that should bypass tenant resolution
const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/how-it-works',
  '/about',
  '/contact',
  '/api',
  '/auth',
  '/_next',
  '/favicon.ico',
];

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') ?? '';
  const pathname = url.pathname;

  // Skip system routes and static assets
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Ensure we have a configured app domain
  if (!APP_DOMAIN) return NextResponse.next();

  // Remove port from host in development
  const normalizedHost = host.replace(/:\d+$/, '');

  // Main domain – don't rewrite
  if (normalizedHost === APP_DOMAIN || normalizedHost === `www.${APP_DOMAIN}`) {
    return NextResponse.next();
  }

  // Subdomain pattern (e.g. slug.plately.us)
  if (normalizedHost.endsWith(`.${APP_DOMAIN}`)) {
    const subdomain = normalizedHost.replace(`.${APP_DOMAIN}`, '');
    // Skip reserved subdomains
    if (['www', 'app', 'admin', 'api'].includes(subdomain)) {
      return NextResponse.next();
    }
    // Rewrite to internal tenant route (/r/[slug])
    url.pathname = `/r/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Custom domain mapping. In a production build this would look up the mapping
  // via a KV store or database. For now, just pass through.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};