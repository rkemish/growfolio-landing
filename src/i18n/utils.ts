// Translation utilities for loading and using translations

import { LANGUAGE_FALLBACKS, DEFAULT_LOCALE, type SupportedLocale } from './config';

// Type for nested translation object
export type TranslationValue = string | { [key: string]: TranslationValue };
export type Translations = Record<string, TranslationValue>;

// Cache for loaded translations
const translationCache = new Map<SupportedLocale, Translations>();

/**
 * Load translations for a locale
 * Uses dynamic imports for code splitting
 */
export async function getTranslations(locale: SupportedLocale): Promise<Translations> {
  // Check cache first
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }

  try {
    // Dynamic import of locale file
    const module = await import(`../locales/${locale}.json`);
    const translations = module.default || module;
    translationCache.set(locale, translations);
    return translations;
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, trying fallback`);

    // Try fallback language
    const fallback = LANGUAGE_FALLBACKS[locale];
    if (fallback) {
      try {
        const module = await import(`../locales/${fallback}.json`);
        const translations = module.default || module;
        translationCache.set(locale, translations); // Cache under original locale too
        return translations;
      } catch {
        // Continue to default
      }
    }

    // Ultimate fallback to English
    if (locale !== DEFAULT_LOCALE) {
      try {
        const module = await import(`../locales/${DEFAULT_LOCALE}.json`);
        const translations = module.default || module;
        return translations;
      } catch {
        console.error('Failed to load default English translations');
      }
    }

    return {};
  }
}

/**
 * Get a nested value from an object using dot notation
 * e.g., getValue({ a: { b: 'c' } }, 'a.b') => 'c'
 */
function getValue(obj: Translations, path: string): string | undefined {
  const keys = path.split('.');
  let value: TranslationValue = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * Create a translation function with parameter interpolation
 * Usage: const t = createT(translations); t('hero.headline', { name: 'John' })
 */
export function createT(translations: Translations) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const value = getValue(translations, key);

    if (value === undefined) {
      console.warn(`Missing translation: ${key}`);
      return key; // Return key as fallback
    }

    // Replace {param} placeholders with values
    if (params) {
      return value.replace(/{(\w+)}/g, (match, param) => {
        const replacement = params[param];
        return replacement !== undefined ? String(replacement) : match;
      });
    }

    return value;
  };
}

/**
 * Get localized URL by replacing or adding language prefix
 */
export function getLocalizedUrl(currentUrl: URL, newLocale: SupportedLocale): string {
  const pathSegments = currentUrl.pathname.split('/').filter(Boolean);

  // Import at runtime to avoid circular dependency
  const validLocales = [
    'en', 'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de',
    'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro',
    'sk', 'sl', 'es', 'sv', 'ca', 'eu', 'gl', 'cy', 'fy', 'se', 'co'
  ];

  // Check if first segment is a locale
  if (pathSegments.length > 0 && validLocales.includes(pathSegments[0])) {
    // Replace existing locale
    pathSegments[0] = newLocale;
  } else {
    // Add locale prefix
    pathSegments.unshift(newLocale);
  }

  return '/' + pathSegments.join('/') + currentUrl.search;
}

/**
 * Remove language prefix from path
 */
export function getPathWithoutLocale(pathname: string): string {
  const validLocales = [
    'en', 'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de',
    'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro',
    'sk', 'sl', 'es', 'sv', 'ca', 'eu', 'gl', 'cy', 'fy', 'se', 'co'
  ];

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && validLocales.includes(segments[0])) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  return pathname;
}
