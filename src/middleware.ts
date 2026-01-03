// Language detection middleware for Cloudflare Workers
// Detects language from URL, cookie, Accept-Language header, or geo-location

import { defineMiddleware } from 'astro:middleware';
import {
  detectLanguageFromGeo,
  getPreferredLanguage,
  extractLanguageFromPath,
  getLanguageFromCookie,
  createLanguageCookie,
  LANG_COOKIE_NAME,
  type CloudflareGeo
} from './i18n/geo-detection';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from './i18n/config';

export const onRequest = defineMiddleware(async ({ request, locals, redirect, url }, next) => {
  const pathname = url.pathname;

  // Skip for static assets and API routes
  if (
    pathname.startsWith('/_') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Has file extension (css, js, images, etc.)
  ) {
    return next();
  }

  // Extract language from URL path
  const urlLang = extractLanguageFromPath(pathname);

  // Get cookie preference
  const cookieHeader = request.headers.get('cookie');
  const cookieLang = getLanguageFromCookie(cookieHeader);

  // Get Cloudflare geo data from the runtime
  const runtime = (locals as any).runtime;
  const cf: CloudflareGeo = runtime?.cf || {};
  const geoLang = detectLanguageFromGeo(cf);

  // Get Accept-Language header
  const acceptLanguageHeader = request.headers.get('accept-language');

  // Determine preferred language
  const preferredLang = getPreferredLanguage(urlLang, cookieLang, geoLang, acceptLanguageHeader);

  // Store detected language and geo info in locals for components to use
  (locals as any).lang = preferredLang;
  (locals as any).geoInfo = {
    country: cf.country,
    city: cf.city,
    regionCode: cf.regionCode,
    detectedLang: geoLang
  };

  // If at root path, redirect to detected language
  if (pathname === '/') {
    return redirect(`/${preferredLang}/`, 302);
  }

  // If no valid language in URL, redirect with language prefix
  if (!urlLang) {
    return redirect(`/${preferredLang}${pathname}${url.search}`, 302);
  }

  // Continue with the request
  const response = await next();

  // If user explicitly selected a language via URL (and it's different from cookie),
  // save their preference in a cookie
  if (urlLang && urlLang !== cookieLang) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.append('Set-Cookie', createLanguageCookie(urlLang));
    return newResponse;
  }

  return response;
});
