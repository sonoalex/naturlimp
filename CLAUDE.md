# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server at http://localhost:4321
- `npm run build` — Production build to `/dist`
- `npm run preview` — Preview production build locally
- Docker dev: `docker compose up` (hot-reload, same port)

No test runner is configured. TypeScript checking: `npx astro check`.

## Architecture

**NaturLimp** is an Astro 6 static site for a professional cleaning company serving Tarragona and the Costa Daurada region.

### i18n Routing

The site is bilingual (Spanish/Catalan) using Astro's built-in i18n with file-based routing:
- `/es/` pages → Spanish locale
- `/ca/` pages → Catalan locale
- Root `/` redirects to Spanish (default locale)

Translations live in `src/i18n/es.json` and `src/i18n/ca.json`. Use the `flattenI18n` utility in `src/utils/i18n.ts` to load them in components.

### Component Model

Components split by interactivity:
- **`.astro` files** — static structure (Header, Footer, ServiceCard, FAQSection). Server-rendered, zero JS by default.
- **`.tsx` files** — interactive components only (HeroAnimation, BeforeAfterSlider, ContactForm, TestimonialsScroll). React 19, loaded client-side.

The layout entry point is `src/layouts/BaseLayout.astro`. All pages extend it.

### Styling

- **Tailwind CSS v4** with `@theme` blocks in `src/styles/global.css` — all design tokens (colors, typography, spacing) defined there as CSS custom properties.
- Primary brand green: `#15803d`; accent: `#059669`; secondary cyan: `#0891b2`
- Fonts: Barlow (headings/body), Open Sans (labels)
- All Framer Motion animations must respect `prefers-reduced-motion` (handled globally in CSS)

### Key Files

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Design tokens, CSS vars, base styles |
| `src/layouts/BaseLayout.astro` | Master page template |
| `astro.config.mjs` | Astro integrations (React, Tailwind, i18n, compression) |
| `src/i18n/es.json` / `ca.json` | All UI strings |
| `public/schema.json` | JSON-LD structured data for SEO |

### Deployment

Static build → Nginx via multi-stage Docker (`Dockerfile` has dev/builder/nginx stages).
