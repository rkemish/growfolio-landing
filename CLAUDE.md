# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Growfolio landing page - a static marketing site for a European family investment platform. Built with Astro, Tailwind CSS, and deployed to Cloudflare Pages.

## Deployment

**Auto-deploy enabled**: The `main` branch is connected to Cloudflare Pages. Always commit and push changes to see them live.

```bash
git add . && git commit -m "Your message" && git push
```

Live site: https://growfolio.pages.dev

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

**Astro component-based structure:**
- `src/pages/[lang]/index.astro` - Dynamic route for localized pages
- `src/pages/index.astro` - Root redirect to detected language
- `src/layouts/Layout.astro` - Root HTML layout with head tags and global scripts
- `src/components/` - Landing page sections (Navbar, Hero, Problem, Solution, HowItWorks, SocialProof, Pricing, CTA, Footer, LanguageSwitcher)
- `src/styles/global.css` - Theme variables, custom animations, utility classes

**i18n (31 languages):**
- `src/locales/*.json` - Translation files for each language
- `src/i18n/config.ts` - Language configuration, country groupings
- `src/i18n/utils.ts` - Translation utilities (getTranslations, createT)
- `src/i18n/geo-detection.ts` - Geo-based language detection
- `src/middleware.ts` - Language detection and routing middleware

**Key patterns:**
- Each landing section is a standalone `.astro` component using `{t('key')}` for translations
- Design tokens defined as CSS variables in global.css (@theme block)
- Scroll reveal animations use IntersectionObserver in Layout.astro
- Waitlist form submits to Google Apps Script via hidden iframe (CORS workaround)
- Language detection: URL path > cookie > geo-location > Accept-Language header

## Design System

**Colors** (CSS variables):
- `--color-forest` (#1a3a32) - Primary dark green
- `--color-teal` (#3d8b7a) - Accent
- `--color-gold` (#c9a962) - Highlight
- `--color-coral` (#d4847c) - Stats/alerts
- `--color-cream` (#faf8f5) - Light background

**Typography**: Playfair Display (headings), DM Sans (body) - loaded from Google Fonts

## Configuration

- `astro.config.mjs` - Tailwind via Vite plugin, Cloudflare adapter
- `wrangler.jsonc` - Cloudflare Workers deployment config
- TypeScript strict mode enabled
