// Geo-detection logic for Cloudflare Workers
// Uses cf.country, cf.city, and cf.regionCode to detect language

import {
  COUNTRY_TO_LANGUAGE,
  REGIONAL_RULES,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale
} from './config';

export interface CloudflareGeo {
  country?: string;
  city?: string;
  regionCode?: string;
  timezone?: string;
}

/**
 * Detect language from Cloudflare geo data
 * Checks regional rules first (more specific), then falls back to country-level
 */
export function detectLanguageFromGeo(cf: CloudflareGeo): SupportedLocale {
  const { country, city, regionCode } = cf;

  if (!country) {
    return DEFAULT_LOCALE;
  }

  // Check regional rules first (more specific)
  for (const rule of REGIONAL_RULES) {
    if (rule.country !== country) continue;

    // Match by region code (e.g., ES-CT for Catalonia)
    if (rule.regions && regionCode) {
      // regionCode from Cloudflare might be with or without country prefix
      const normalizedRegion = regionCode.replace(`${country}-`, '');
      if (rule.regions.includes(normalizedRegion)) {
        return rule.language;
      }
    }

    // Match by city (case-insensitive)
    if (rule.cities && city) {
      const normalizedCity = city.toLowerCase().trim();
      if (rule.cities.some(c => c.toLowerCase() === normalizedCity)) {
        return rule.language;
      }
    }
  }

  // Fall back to country-level language
  return COUNTRY_TO_LANGUAGE[country] || DEFAULT_LOCALE;
}

/**
 * Parse Accept-Language header and return ranked language codes
 */
export function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];

  return header
    .split(',')
    .map(part => {
      const [lang, qValue] = part.trim().split(';q=');
      const q = qValue ? parseFloat(qValue) : 1;
      // Extract just the language code (e.g., "en-US" -> "en")
      const langCode = lang.split('-')[0].toLowerCase();
      return { lang: langCode, q };
    })
    .sort((a, b) => b.q - a.q)
    .map(item => item.lang);
}

/**
 * Check if a language code is a valid supported locale
 */
export function isValidLocale(lang: string): lang is SupportedLocale {
  return SUPPORTED_LOCALES.includes(lang as SupportedLocale);
}

/**
 * Get preferred language based on multiple signals
 * Priority: URL > Cookie > Accept-Language > Geo > Default
 */
export function getPreferredLanguage(
  urlLang: SupportedLocale | null,
  cookieLang: SupportedLocale | null,
  geoLang: SupportedLocale,
  acceptLanguageHeader: string | null
): SupportedLocale {
  // 1. Explicit URL choice takes priority
  if (urlLang) {
    return urlLang;
  }

  // 2. Saved cookie preference
  if (cookieLang) {
    return cookieLang;
  }

  // 3. Browser Accept-Language header
  const acceptLanguages = parseAcceptLanguage(acceptLanguageHeader);
  for (const lang of acceptLanguages) {
    if (isValidLocale(lang)) {
      return lang;
    }
  }

  // 4. Geo-detected language
  return geoLang;
}

/**
 * Extract language from URL path
 * Returns null if path doesn't start with a valid locale
 */
export function extractLanguageFromPath(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return null;
}

/**
 * Cookie name for storing language preference
 */
export const LANG_COOKIE_NAME = 'growfolio-lang';

/**
 * Parse cookie header and extract language preference
 */
export function getLanguageFromCookie(cookieHeader: string | null): SupportedLocale | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`${LANG_COOKIE_NAME}=([^;]+)`));
  if (match && isValidLocale(match[1])) {
    return match[1];
  }

  return null;
}

/**
 * Create Set-Cookie header value for language preference
 */
export function createLanguageCookie(lang: SupportedLocale): string {
  // Cookie valid for 1 year
  const maxAge = 60 * 60 * 24 * 365;
  return `${LANG_COOKIE_NAME}=${lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
