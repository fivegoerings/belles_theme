# Belle's Performance Tennis — Brand Style Guide

Source of truth pulled from the live theme (`config/settings_data.json`, `assets/belles-fonts.css`, `assets/belle-*.css`). Update this file if those source files change — don't let it drift.

## Brand

**Name:** Belle's Performance Tennis Shop
**Tagline/description:** Appointment-based racquet stringing and tennis equipment service serving Kansas City Northland players.
**Logo:** `belles_logo_cymk.webp` (hosted on Shopify CDN, used as both site logo and favicon)

**Social:**
- Facebook: facebook.com/BellesPerformanceTennis
- Instagram: instagram.com/bellesperformancetennis
- X/Twitter: x.com/Belle_Tennis

## Color Palette

### Core brand colors (CSS custom properties, defined per-component with fallback)

| Name | Variable | Hex | Usage |
|---|---|---|---|
| Belle Green | `--belle-green` | `#1a3c2a` | Primary brand color — headings, CTAs, borders, dark backgrounds |
| Belle Gold | `--belle-gold` | `#c8a951` | Accent — eyebrow text, badges, hover states, dividers |
| Belle Cream | `--belle-cream` | `#faf9f6` | Soft background, gradient base |
| Belle Charcoal | `--belle-charcoal` | `#2d2d2d` | Body text on light backgrounds |
| Belle Light Gray | `--belle-light-gray` | `#f5f5f5` | Section backgrounds, legal/utility pages |
| Belle Light | `--belle-light` | `#f8f8f8` | Card/callout backgrounds (article, blog, FAQ) |
| Belle Border | `--belle-border` | `#e0e0e0` | Hairline borders, dividers |
| Belle Yellow (rare) | `--belle-yellow` | `#d8e000` | Single-use alert accent in racquet sales |

Secondary gradient stop used alongside Belle Green: `#2d5a3d` / `#2a5a3a` (a lighter green used only as the midpoint of `linear-gradient(135deg, #1a3c2a 0%, #2d5a3d 50%, #1a3c2a 100%)` hero backgrounds).

### Usage pattern
- **Green** is the dominant color: headings, primary buttons/backgrounds, icon fills.
- **Gold** is the accent: eyebrow labels, CTA buttons (gold bg + green text), dividers, hover highlights.
- **Cream/Light/Light-gray** are backgrounds only, never text.
- **Charcoal** is body copy; near-black, not pure black.
- White (`#ffffff`) is used for text over green, and as gradient tops.

### Theme editor color schemes (Shopify Dawn scheme system, `config/settings_data.json`)

| Scheme | Background | Text | Button | Button label | Notes |
|---|---|---|---|---|---|
| scheme-1 | `#ffffff` | `#121212` | `#121212` | `#ffffff` | Default light |
| scheme-2 | `#f3f3f3` | `#121212` | `#121212` | `#f3f3f3` | Card/muted light |
| scheme-3 | `#1a3c2a` (belle green) | `#c8a951` (belle gold) | `#ffffff` | `#000000` | On-brand dark scheme — used for sold-out badges |
| scheme-4 | `#121212` | `#ffffff` | `#ffffff` | `#121212` | Near-black — used for sale badges |
| scheme-5 | `#334fb4` | `#ffffff` | `#ffffff` | `#334fb4` | Leftover Dawn default blue, not brand-aligned; avoid for new brand work |

## Typography

### Typefaces

**Headings — Bebas Neue** (self-hosted, weight 400 only)
- Condensed display face, always used with tight/negative-feeling `line-height` (e.g. `0.95`) and positive `letter-spacing` (`1–1.5px`)
- Stack: `'Bebas Neue', 'Bebas Neue Fallback', sans-serif`
- `font-display: optional` — the metric-matched `Bebas Neue Fallback` face (sized off Arial Black) prevents layout shift if the real font swaps in

**Body — Source Sans Pro** (self-hosted as "Source Sans 3", weights 400 / 600 / 700)
- Stack: `'Source Sans Pro', 'Source Sans Pro Fallback', sans-serif`
- `font-display: optional`, with a metric-matched `Source Sans Pro Fallback` per weight (sized off Arial)

**System fallback stack** (used for some container-level `font-family` resets, e.g. footer, why-section):
`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`

**Base theme (Dawn) settings:** `type_header_font` / `type_body_font` = `system_ui_n4` (system UI, regular) at 100% scale — this governs stock Dawn components (cart, search, etc.) that aren't overridden by the custom `belle-*` sections above.

### Type scale observed in custom sections
| Use | Font | Size | Notes |
|---|---|---|---|
| Hero H1 | Bebas Neue | 44px | `line-height: 0.95`, `letter-spacing: 1.5px` |
| Hero CTA button | Bebas Neue | 22px | `letter-spacing: 1px` |
| Eyebrow / label | Source Sans Pro 700 | 11–13px | `letter-spacing: 2–2.5px`, uppercase |
| Body copy | Source Sans Pro 400 | 13–18px | `line-height: 1.45–1.6` |
| Card/product title | Bebas Neue | 24–52px | scales by context (grid card vs. modal) |

**Convention:** headings and CTA buttons use Bebas Neue in mixed case (not forced uppercase) except eyebrow/label text, which is Source Sans Pro 700 with `text-transform: uppercase` and wide letter-spacing.

## UI Components (from theme editor settings)

- **Buttons:** square corners (`border-radius: 0`), 1px border, subtle shadow (4px vertical offset, 5px blur, 0% opacity by default)
- **Pills (variant swatches, badges):** fully rounded (`border-radius: 40`)
- **Inputs:** square corners, 1px border at 55% opacity
- **Cards:** square corners, no border, `scheme-2` (light gray) background
- **Page width:** 1200px max
- **Hover animation:** 3D lift on interactive elements
- **Badge position:** bottom left, pill-shaped (`border-radius: 40`)

## Voice/Tone Notes (inferred from copy)
- Direct, locally-rooted ("Kansas City Northland players"), appointment/service-oriented rather than big-box retail
- CTAs favor action verbs framed around booking (Calendly integration is central — "Book", scheduling language)

## Files to check for the current source of truth
- `config/settings_data.json` — theme editor colors, fonts, spacing, button/card styling
- `assets/belles-fonts.css` — font-face declarations
- `assets/belle-hero.css`, `belle-footer.css`, `belle-why-section.css`, `section-belle-*.css` — brand color variables and applied typography
