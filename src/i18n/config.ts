// Language configuration and mappings for 31 supported languages
// 24 EU Official + 7 Regional (Catalan, Basque, Galician, Welsh, Frisian, Sami, Corsican)

export const LANGUAGES = {
  // EU Official Languages (24)
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  bg: { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  cs: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  da: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  et: { name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  fi: { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  hu: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  ga: { name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  lv: { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  lt: { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  mt: { name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ro: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  sl: { name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  // Regional Languages (7)
  ca: { name: 'Catalan', nativeName: 'Català', flag: '🏴' },
  eu: { name: 'Basque', nativeName: 'Euskara', flag: '🏴' },
  gl: { name: 'Galician', nativeName: 'Galego', flag: '🏴' },
  cy: { name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  fy: { name: 'Frisian', nativeName: 'Frysk', flag: '🏴' },
  se: { name: 'Sami', nativeName: 'Sámegiella', flag: '🏳️' },
  co: { name: 'Corsican', nativeName: 'Corsu', flag: '🏴' }
} as const;

export type SupportedLocale = keyof typeof LANGUAGES;

export const SUPPORTED_LOCALES = Object.keys(LANGUAGES) as SupportedLocale[];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Country code (ISO 3166-1 Alpha-2) to primary language mapping
export const COUNTRY_TO_LANGUAGE: Record<string, SupportedLocale> = {
  // EU Countries
  AT: 'de', // Austria
  BE: 'nl', // Belgium (Dutch-speaking majority, also French)
  BG: 'bg', // Bulgaria
  HR: 'hr', // Croatia
  CY: 'el', // Cyprus
  CZ: 'cs', // Czech Republic
  DK: 'da', // Denmark
  EE: 'et', // Estonia
  FI: 'fi', // Finland
  FR: 'fr', // France
  DE: 'de', // Germany
  GR: 'el', // Greece
  HU: 'hu', // Hungary
  IE: 'en', // Ireland (English primary, Irish secondary)
  IT: 'it', // Italy
  LV: 'lv', // Latvia
  LT: 'lt', // Lithuania
  LU: 'fr', // Luxembourg (French/German/Luxembourgish)
  MT: 'mt', // Malta
  NL: 'nl', // Netherlands
  PL: 'pl', // Poland
  PT: 'pt', // Portugal
  RO: 'ro', // Romania
  SK: 'sk', // Slovakia
  SI: 'sl', // Slovenia
  ES: 'es', // Spain
  SE: 'sv', // Sweden
  // Non-EU European countries
  GB: 'en', // United Kingdom
  CH: 'de', // Switzerland (German majority)
  NO: 'en', // Norway (Norwegian not supported, fallback to English)
  IS: 'en', // Iceland (Icelandic not supported)
  LI: 'de', // Liechtenstein
  AD: 'ca', // Andorra (Catalan is official)
  MC: 'fr', // Monaco
  SM: 'it', // San Marino
  VA: 'it', // Vatican
};

// Regional language detection rules
// Priority: More specific rules (city/region) override country-level defaults
export interface RegionalRule {
  country: string;
  regions?: string[];  // ISO 3166-2 region codes (without country prefix)
  cities?: string[];   // City names (case-insensitive matching)
  language: SupportedLocale;
}

export const REGIONAL_RULES: RegionalRule[] = [
  // SPAIN - Catalan (Catalonia, Valencia, Balearic Islands)
  {
    country: 'ES',
    regions: ['CT', 'VC', 'IB'], // Catalonia, Valencia, Balearic Islands
    language: 'ca'
  },
  {
    country: 'ES',
    cities: ['Barcelona', 'Tarragona', 'Girona', 'Lleida', 'Valencia', 'Alicante', 'Castellón', 'Palma', 'Ibiza'],
    language: 'ca'
  },

  // SPAIN - Basque (Basque Country, Navarra)
  {
    country: 'ES',
    regions: ['PV', 'NC'], // País Vasco, Navarra
    language: 'eu'
  },
  {
    country: 'ES',
    cities: ['Bilbao', 'San Sebastián', 'Vitoria-Gasteiz', 'Pamplona', 'Donostia'],
    language: 'eu'
  },

  // SPAIN - Galician (Galicia)
  {
    country: 'ES',
    regions: ['GA'], // Galicia
    language: 'gl'
  },
  {
    country: 'ES',
    cities: ['A Coruña', 'Vigo', 'Santiago de Compostela', 'Ourense', 'Lugo', 'Pontevedra', 'Ferrol'],
    language: 'gl'
  },

  // UNITED KINGDOM - Welsh (Wales)
  {
    country: 'GB',
    regions: ['WLS'], // Wales
    language: 'cy'
  },
  {
    country: 'GB',
    cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Bangor', 'Aberystwyth', 'Carmarthen', 'Llandudno'],
    language: 'cy'
  },

  // NETHERLANDS - Frisian (Friesland)
  {
    country: 'NL',
    regions: ['FR'], // Friesland
    language: 'fy'
  },
  {
    country: 'NL',
    cities: ['Leeuwarden', 'Ljouwert', 'Drachten', 'Heerenveen', 'Sneek', 'Harlingen'],
    language: 'fy'
  },

  // FINLAND - Sami (Lapland)
  {
    country: 'FI',
    regions: ['19'], // Lappi (Lapland)
    language: 'se'
  },
  {
    country: 'FI',
    cities: ['Rovaniemi', 'Inari', 'Utsjoki', 'Enontekiö', 'Sodankylä'],
    language: 'se'
  },

  // SWEDEN - Sami (Northern regions)
  {
    country: 'SE',
    regions: ['BD', 'AC', 'Z'], // Norrbotten, Västerbotten, Jämtland
    language: 'se'
  },
  {
    country: 'SE',
    cities: ['Kiruna', 'Gällivare', 'Jokkmokk', 'Arvidsjaur'],
    language: 'se'
  },

  // NORWAY - Sami (Northern regions)
  {
    country: 'NO',
    regions: ['54', '55', '18'], // Troms og Finnmark, Nordland
    language: 'se'
  },
  {
    country: 'NO',
    cities: ['Tromsø', 'Alta', 'Hammerfest', 'Kautokeino', 'Karasjok'],
    language: 'se'
  },

  // FRANCE - Corsican (Corsica)
  {
    country: 'FR',
    regions: ['94', '2A', '2B'], // Corse, Corse-du-Sud, Haute-Corse
    language: 'co'
  },
  {
    country: 'FR',
    cities: ['Ajaccio', 'Bastia', 'Corte', 'Porto-Vecchio', 'Calvi', 'Bonifacio'],
    language: 'co'
  },
];

// Language fallbacks - when a translation is missing, fall back to these
export const LANGUAGE_FALLBACKS: Partial<Record<SupportedLocale, SupportedLocale>> = {
  ca: 'es', // Catalan -> Spanish
  eu: 'es', // Basque -> Spanish
  gl: 'es', // Galician -> Spanish (very similar)
  cy: 'en', // Welsh -> English
  fy: 'nl', // Frisian -> Dutch (very similar)
  se: 'fi', // Sami -> Finnish (or Swedish based on location)
  co: 'fr', // Corsican -> French
  ga: 'en', // Irish -> English
  mt: 'en', // Maltese -> English
};

// Group languages for UI display (legacy)
export const LANGUAGE_GROUPS = {
  official: ['en', 'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro', 'sk', 'sl', 'es', 'sv'] as SupportedLocale[],
  regional: ['ca', 'eu', 'gl', 'cy', 'fy', 'se', 'co'] as SupportedLocale[],
};

// Languages grouped by country for UI display
export const LANGUAGES_BY_COUNTRY: { country: string; flag: string; languages: SupportedLocale[] }[] = [
  { country: 'Ireland', flag: '🇮🇪', languages: ['en', 'ga'] },
  { country: 'Spain', flag: '🇪🇸', languages: ['es', 'ca', 'eu', 'gl'] },
  { country: 'France', flag: '🇫🇷', languages: ['fr', 'co'] },
  { country: 'Germany', flag: '🇩🇪', languages: ['de'] },
  { country: 'Italy', flag: '🇮🇹', languages: ['it'] },
  { country: 'Netherlands', flag: '🇳🇱', languages: ['nl', 'fy'] },
  { country: 'Portugal', flag: '🇵🇹', languages: ['pt'] },
  { country: 'Poland', flag: '🇵🇱', languages: ['pl'] },
  { country: 'Greece', flag: '🇬🇷', languages: ['el'] },
  { country: 'Romania', flag: '🇷🇴', languages: ['ro'] },
  { country: 'Hungary', flag: '🇭🇺', languages: ['hu'] },
  { country: 'Czech Republic', flag: '🇨🇿', languages: ['cs'] },
  { country: 'Slovakia', flag: '🇸🇰', languages: ['sk'] },
  { country: 'Bulgaria', flag: '🇧🇬', languages: ['bg'] },
  { country: 'Croatia', flag: '🇭🇷', languages: ['hr'] },
  { country: 'Slovenia', flag: '🇸🇮', languages: ['sl'] },
  { country: 'Finland', flag: '🇫🇮', languages: ['fi', 'se'] },
  { country: 'Sweden', flag: '🇸🇪', languages: ['sv'] },
  { country: 'Denmark', flag: '🇩🇰', languages: ['da'] },
  { country: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', languages: ['cy'] },
  { country: 'Estonia', flag: '🇪🇪', languages: ['et'] },
  { country: 'Latvia', flag: '🇱🇻', languages: ['lv'] },
  { country: 'Lithuania', flag: '🇱🇹', languages: ['lt'] },
  { country: 'Malta', flag: '🇲🇹', languages: ['mt'] },
];
