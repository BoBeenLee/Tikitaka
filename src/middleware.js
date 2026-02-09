import { NextResponse } from 'next/server';

const locales = ['en', 'ja'];
const defaultLocale = 'en';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the pathname is missing a locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        // Redirect to default locale
        // In a real app, you might check Accept-Language header here
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        // Skip all API routes
        // Skip static files (favicon.ico, robots.txt, images, etc)
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|opengraph-image|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ],
};
