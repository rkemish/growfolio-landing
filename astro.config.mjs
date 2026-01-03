// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// All supported locales (24 EU official + 7 regional)
const locales = [
  'en', 'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de',
  'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro',
  'sk', 'sl', 'es', 'sv', 'ca', 'eu', 'gl', 'cy', 'fy', 'se', 'co'
];

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(),

  // Required for middleware (language detection)
  output: 'server',

  i18n: {
    defaultLocale: 'en',
    locales: locales,
    routing: {
      prefixDefaultLocale: true,  // All URLs have language prefix for consistency
      redirectToDefaultLocale: false  // Middleware handles detection/redirect
    },
    fallback: {
      // Regional languages fall back to their national language
      ca: 'es',  // Catalan -> Spanish
      eu: 'es',  // Basque -> Spanish
      gl: 'es',  // Galician -> Spanish
      cy: 'en',  // Welsh -> English
      fy: 'nl',  // Frisian -> Dutch
      se: 'fi',  // Sami -> Finnish
      co: 'fr',  // Corsican -> French
      ga: 'en',  // Irish -> English
      mt: 'en',  // Maltese -> English
    }
  }
});
