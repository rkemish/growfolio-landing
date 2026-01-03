/// <reference types="astro/client" />

import type { SupportedLocale } from './i18n/config';

declare namespace App {
  interface Locals {
    lang: SupportedLocale;
    geoInfo: {
      country?: string;
      city?: string;
      regionCode?: string;
      detectedLang?: SupportedLocale;
    };
    runtime?: {
      cf?: {
        country?: string;
        city?: string;
        regionCode?: string;
        timezone?: string;
      };
      env?: Record<string, string>;
    };
  }
}
