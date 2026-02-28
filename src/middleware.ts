import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { i18n } from "./lib/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { getToken } from "next-auth/jwt";

// Custom type for role
type UserRole = 'admin' | 'editor' | 'user' | null;

/**
 * Determines the locale based on cookies and headers
 */
function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locales = i18n.locales;

  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

/**
 * Checks if the request is authenticated and returns the user role
 */
async function isAuthenticated(request: NextRequest): Promise<UserRole> {
  const token = await getToken({ req: request, secret: process.env.SECRET });
  return token ? (token.role as UserRole ?? 'user') : null;
}

/**
 * --: Define protected user paths
 */
function isUserPath(pathname: string): boolean {
  const userPaths = [
    '/account',
    // '/orders'
  ];
  return userPaths.some(path => pathname.includes(path));
}

/**
 * --: Define protected admin paths
 */
function isAdminPath(pathname: string): boolean {
  const adminPaths = [
    '/admin',
  ];
  return adminPaths.some(path => pathname.includes(path));
}

/**
 * --: Define paths to exclude from locale handling
 */
const STATIC_PATHS = [
  '/assets',
  '/manifest.json',
  '/favicon.ico',
  '/opengraph-image.png',
  '/robots.txt',
  '/sitemap.xml',
  '/api',
  '/admin',
  '/.well-known',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const auth = await isAuthenticated(request);
  const user_path = isUserPath(pathname);
  const admin_path = isAdminPath(pathname);

  // Authentication logic
  const redirect_url = new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), request.nextUrl.origin);

  // Editor permissions
  if (auth === "editor") {
    // TODO: Customize editor-accessible paths
    if (pathname.includes('/dashboard/products') ||
      pathname.includes('/api/brands') ||
      pathname.includes('supplier')) {
      return NextResponse.next();
    }

    if (pathname.endsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard/products', request.nextUrl.origin));
    }
  }

  // Access control
  if (user_path && auth !== 'admin' && auth !== 'user' && auth !== 'editor') {
    return NextResponse.redirect(redirect_url);
  }
  if (admin_path && auth !== 'admin') {
    return NextResponse.redirect(redirect_url);
  }

  // Static path handling
  if (STATIC_PATHS.some(path => pathname.includes(path))) return;

  // ...existing locale handling code...
  // Fix duplicate locale in URL (e.g. /en/en/about -> /en/about)
  let locale_occurrences = 0;
  pathname.split('/').forEach((path) => {
    if (i18n.locales.includes(path)) {
      locale_occurrences++;
    }
  });

  if (locale_occurrences > 1) {
    const locale = getLocale(request);
    const new_pathname = pathname.split('/').filter((path) => !i18n.locales.includes(path)).join('/');
    return NextResponse.redirect(new URL(`/${locale}${new_pathname}`, request.nextUrl.origin));
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale: string) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.toString();

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const isHomePage = pathname === "/";

    let url = new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}?${search}`,
      request.url
    );

    if (isHomePage) {
      url = new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}?${search}`, request.url);
    }

    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|sitemap.xml|favicon.ico).*)"],
};