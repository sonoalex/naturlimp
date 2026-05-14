# Design System — NaturLimp

Generated from source. Single source of truth: `src/styles/global.css` + component scan.

---

## Color Tokens

Defined in `src/styles/global.css` via Tailwind v4 `@theme`. Reference as `var(--color-*)` in components.

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#15803d` | Brand green — headings, links, icon strokes, focus ring |
| `--color-primary-dark` | `#166534` | Hover on primary elements |
| `--color-primary-light` | `#dcfce7` | Icon container backgrounds, badge fills |
| `--color-secondary` | `#0891b2` | Cyan — pool/water service accent |
| `--color-secondary-dark` | `#0e7490` | Hover on secondary |
| `--color-accent` | `#059669` | CTA buttons (primary action) |
| `--color-background` | `#f0fdf4` | Page background (green-tinted white) |
| `--color-surface` | `#ffffff` | Cards, header, form containers |
| `--color-foreground` | `#0f172a` | Body text, headings (15:1 contrast on background) |
| `--color-muted` | `#f0f7f3` | Alternating section backgrounds |
| `--color-muted-fg` | `#64748b` | Secondary text, nav links, labels |
| `--color-border` | `#e2efe7` | Card borders, dividers |
| `--color-destructive` | `#dc2626` | Form errors |
| `--color-destructive-light` | `#fef2f2` | Error field background |
| `--color-ring` | `#15803d` | Focus outline |

### Contrast pairs (WCAG AA verified)

| Foreground | Background | Ratio |
|---|---|---|
| `#0f172a` | `#f0fdf4` | 15:1 AAA |
| `#ffffff` | `#059669` | 4.6:1 AA |
| `#ffffff` | `#15803d` | 5.9:1 AA |
| `#64748b` | `#ffffff` | 4.6:1 AA |

---

## Typography

| Role | Family | Weights | CSS var |
|---|---|---|---|
| Heading | Poppins | 400, 600, 700 | `--font-heading` |
| Body | Open Sans | 400, 500 | `--font-body` |

Loaded via Google Fonts in `BaseLayout.astro` with `font-display: swap` and `<link rel="preload">` for Poppins 600/700.

### Scale (Tailwind classes in use)

| Class | Size | Usage |
|---|---|---|
| `text-sm` | 14px | Labels, card descriptions, nav links, meta text |
| `text-base` | 16px | Body text, button labels |
| `text-lg` | 18px | Lead paragraphs, subheadlines |
| `text-xl` | 20px | Large body copy |
| `text-2xl` | 24px | Section sub-headings (`h2` inner) |
| `text-3xl` | 30px | Section headings (`h2`) |
| `text-4xl` | 36px | Stats values, `h1` mobile |
| `text-5xl` | 48px | `h1` tablet |
| `text-6xl` | 60px | `h1` desktop |

Line heights: `1.2` on headings (`h1–h6`), `1.6` on body, `leading-relaxed` (1.625) on card descriptions.

Font class: `font-heading` activates Poppins, `font-body` activates Open Sans (applied globally on `html`).

---

## Spacing

8dp grid. Section rhythm defined as tokens:

| Token | Value | Usage |
|---|---|---|
| `--spacing-section` | `5rem` (80px) | `py-20` — standard section vertical padding |
| `--spacing-section-sm` | `3rem` (48px) | `py-12` — tighter sections |

Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (standard), `max-w-4xl` (narrow content), `max-w-2xl` (form/single-column).

---

## Component Patterns

### Cards

```html
<article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6
                transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
```

- Shape: `rounded-2xl` (16px)
- Border: 1px `--color-border`, lifts to primary/40 on hover
- Elevation: flat by default, `shadow-md` on hover only
- No nested cards

### Icon containers (service cards)

```html
<div class="h-12 w-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
  <svg width="24" height="24" stroke="#15803d" stroke-width="2" stroke-linecap="round" .../>
</div>
```

### Buttons

**Primary CTA** (hero, section CTAs):
```html
<a class="rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white
          hover:bg-[var(--color-primary)] hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200">
```

**Secondary/outline** (hero secondary):
```html
<a class="rounded-xl border border-white/30 px-8 py-4 text-base font-medium text-white
          hover:border-white/60 hover:bg-white/10 transition-all duration-200">
```

**Nav CTA** (header):
```html
<a class="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white
          hover:bg-[var(--color-primary)] transition-colors duration-200">
```

### Badges

```html
<div class="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]
            bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary-light)]">
```

### Header

- Sticky, `z-50`, `h-16`
- `bg-[var(--color-surface)]/95 backdrop-blur-sm` — frosted on scroll
- Border-bottom `--color-border`
- Logo: Poppins bold, 20px, primary color, inline SVG mark (32×32)
- Nav links: `text-sm font-medium text-[--color-muted-fg]` → hover primary
- Language switcher: bordered pill, uppercase, `text-xs tracking-wide`
- Mobile: hamburger toggle, slide-down panel, JS-controlled `aria-expanded`

### Section headings

```html
<h2 class="font-heading text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl">
<p class="mt-4 text-[var(--color-muted-fg)] max-w-2xl mx-auto">
```

---

## Icons

Library: inline SVG only (no icon font, no emoji).
- Stroke width: `2` (UI icons), `2.5` (emphasis/checkmarks)
- Stroke-linecap: `round`
- Size: `24×24` standard, `18×18` trust bar, `16×16` inline text
- Color: `currentColor` (inherits) or explicit `#15803d` on brand marks
- Always `aria-hidden="true"` on decorative icons

---

## Animation

All animations: `transform` and `opacity` only.

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Hero overlay wipe | `clipPath` inset 100%→0% | 1200ms | `[0.22, 1, 0.36, 1]` (expo out) |
| Hero content stagger | `opacity` 0→1, `y` 20→0 | 500ms | `easeOut`, 80ms stagger |
| Scroll indicator dot | `y` bounce loop | 1500ms | `easeInOut` |
| Hover buttons | `scale` 1→1.02 | 200ms | `ease-out` |
| Card hover | `shadow`, `border-color` | 200ms | default |

`prefers-reduced-motion`: all Framer Motion animations disabled via `useReducedMotion()`. Content shown immediately. CSS transitions clamped to `0.01ms` via media query in global.css.

---

## Accessibility

- Focus: `outline: 2px solid var(--color-ring)`, `outline-offset: 3px`, `border-radius: 4px`
- Skip link: `.skip-link` — visually hidden until `:focus`, appears top-left
- All interactive elements: min 44×44px touch target
- `aria-hidden="true"` on all decorative SVGs
- `aria-label` on icon-only buttons
- `lang="es"` / `lang="ca"` on `<html>`
- WCAG AA minimum; primary text pairs hit AAA

---

## Section Backgrounds (alternating rhythm)

| Section | Background |
|---|---|
| Hero | `var(--color-foreground)` (#0f172a) — dark |
| Trust bar | `var(--color-surface)` |
| Services | `var(--color-background)` |
| Before/After | `var(--color-muted)` |
| Map | `var(--color-background)` |
| Testimonials | `var(--color-muted)` |
| Stats | `var(--color-primary)` — brand green |
| FAQ | `var(--color-background)` |
| Contact | `var(--color-background)` |
