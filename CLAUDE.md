# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Growfolio landing page - a static marketing site for a European family investment platform. Built with Astro, Tailwind CSS, and deployed to Cloudflare Workers.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

**Astro component-based structure:**
- `src/pages/index.astro` - Main entry point, composes all section components
- `src/layouts/Layout.astro` - Root HTML layout with head tags and global scripts (scroll effects, reveal animations)
- `src/components/` - Landing page sections (Navbar, Hero, Problem, Solution, HowItWorks, SocialProof, Pricing, CTA, Footer)
- `src/styles/global.css` - Theme variables, custom animations, utility classes

**Key patterns:**
- Each landing section is a standalone `.astro` component
- Design tokens defined as CSS variables in global.css (@theme block)
- Scroll reveal animations use IntersectionObserver in Layout.astro
- Waitlist form submits to Google Apps Script via hidden iframe (CORS workaround)

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
