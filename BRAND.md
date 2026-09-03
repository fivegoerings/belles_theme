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
- CTAs favor action verbs framed around booking (Calendly integration is central, "Book", scheduling language)

## Copy Rules (hard rules, not preferences)

**Never use em dashes (`—`, U+2014) in any customer-facing copy.** This applies to every string a visitor can read: section settings, template JSON, schema defaults, page and blog content, meta descriptions, and Shopify Admin fields. Use a comma, a period, a colon, or parentheses instead. Rewrite the sentence if none of those fit.

- Wrong: `Factory strings are designed to ship — not to match your game.`
- Right: `Factory strings are designed to ship, not to match your game.`

En dashes (`–`, U+2013) are fine and are used intentionally in numeric ranges (`$40–$55`, `2–3 days`). The rule is about em dashes only.

To check the theme before shipping copy:

```bash
grep -rn "—" --include=*.liquid --include=*.json . | grep -v node_modules
```

Note that meta descriptions and page body content live in Shopify Admin, not in this repo, so grep will not catch those. They have to be checked in the admin or on the rendered page.

**First person, singular.** Belle's is one person. Customer-facing copy says "I string every racquet myself", not "we". The exception is where "we" genuinely means the customer and Randy together ("before we meet", "we meet at the QuikTrip you chose"), which is correct and should stay. A "we" that implies staff undercuts the main differentiator.

## Service facts (confirmed, keep copy consistent with these)

These are the numbers and claims the whole site has to agree on. Verified against the live pricing page 2026-09-03.

| Fact | Value |
|---|---|
| Standard restring | **$40–$55 all-in, string included** |
| Rush uplift | **+$15 next-day, +$30 same-day** |
| Natural gut | **from $95**, quoted by string |
| Customer-supplied string | **$45 flat**, plus the standard rush uplift ($60 next-day, $75 same-day) |
| Standard turnaround | **2–3 days** |
| Deposit | None. Invoice sent when the racquet is done, paid before pickup |
| Machine | Gamma Progression II ELS electronic constant-pull |
| Measurement | Dynamic tension read on every finished stringbed with an **ERT 300**, logged on the service card |
| Credential | USRSA member |
| Strings kept on hand | **Solinco, Gosen, Head, Wilson** |

Pricing table, the four rows on the live page (standard / next-day / same-day):

| String type | Standard | Express | Rush |
|---|---|---|---|
| Synthetic gut | $40 | $55 | $70 |
| Multifilament | $50 | $65 | $80 |
| Polyester | $55 | $70 | $85 |
| Natural gut | $95+ | $110+ | $125+ |

Add-ons, all repriced 2026-09-03. **Every one is a flat all-in figure.** Nothing on the page reads "+$X" or "cost +$X" any more, and the parts are included rather than billed on top:

| Add-on | Price |
|---|---|
| You provide the string | **$45** (see the notes below, this one is not really an add-on) |
| Stenciling | **$5** |
| Hybrid setup | **no price shown.** Priced from the higher-tier string, no surcharge |
| String savers | **$8** |
| Overgrip replacement | **$5**, overgrip included |
| Replacement grip | **$20**, grip included |
| Grip build-up | **$25** |
| Grommet replacement | **$35** |

Notes on the ones that have been questioned and settled:

- **Rush pricing is deliberately higher than comparable stringers.** Competitors charge less for same-day, but most of them are storefront or locker-based, so their rush fee covers labor on a racquet already in hand. Belle's same-day requires a dedicated off-route round trip in each direction. The higher fee is also intentionally throttling demand for rush slots. Do not "correct" this against a competitor price list.
- **Customer-supplied string is published as a rate**, not quote-required. This is current and intentional.
- **Customer-supplied string lives in the add-ons block, not the main pricing table** (moved 2026-09-02, repriced from $35/$50/$65 to a flat $45). It is deliberately formatted unlike the other add-ons: full width, highlighted, and first in the grid, because it *replaces* the standard restring price instead of being bought alongside one. Since every add-on was flat-priced on 2026-09-03, the old visual cue (a bare number here versus "+$X" elsewhere) no longer separates it, so the card's own sentence does that work: "This is the whole price for the job, not an extra charge on top." Do not trim that sentence as redundant.
- **$45 is higher than the $40 low end of the all-in price, and that is not an error.** Labor has to carry the whole job when there is no margin on string, and customer-supplied string is often unknown quality or the wrong length. It also removes any "save money" motive, which is the point: the only customer left is the one who genuinely wants a string not carried. Expect to be asked; the pricing FAQ answers it rather than leaving it unexplained.
- **Special order is the recommended path, not bring-your-own.** The out-of-stock FAQ used to close by offering customer-supplied string as the way to skip an order wait, which was the shop generating that demand rather than customers asking for it. Reversed 2026-09-02. Ordering is now presented first, with the reason attached (the string was inspected and is stood behind), and bring-your-own is the last paragraph.
- **Bring-your-own conditions are published, not implied:** full unopened set, inspected before the racquet is taken, declined if it has been sitting for years because it goes brittle regardless of packaging, and no replacement guarantee if it fails during install. These appear on the add-on card and in the FAQ. The reasoning, from the USRSA study guide: with shop string a defect can be marked and the coil returned to the supplier, but with customer string there is no supplier and no remedy, and package length cannot be relied on (a two-piece job needs an extra 12 to 18 inches and four knots instead of two, so a short set means a dead job with the racquet already off the machine).
- **The hybrid surcharge was removed 2026-09-02** by owner decision, because the published +$10 did not match how hybrid jobs were actually being invoiced. Hybrids are priced from the higher-tier string and nothing else. Do not add a surcharge back without checking real invoices.
- **The pricing table is a real HTML table at every width.** A mobile "stacking" version was built and reverted on 2026-09-03: it was justified by a claim that the Rush column was clipped and unreachable on phones, and that claim was false, produced by a broken render harness. The real problem was only that the header labels collided ("STANDARDEXPRESS"), caused by the phone breakpoint setting `thead th` to 13px, larger than the 12px desktop size. That is fixed in CSS. Do not restructure the table with `display: block`; it removes table semantics from the accessibility tree.

## Out-of-area policy (do not re-publish what was removed)

Never publish a travel radius, a mileage figure, or a specific QuikTrip address as the base of operations. Both appeared in the out-of-area FAQ and were removed on 2026-08-23.

A published radius converts a case-by-case judgment call into an entitlement customers will negotiate against ("I'm only 14 miles out"). Naming a specific QuikTrip publishes an effective base location for a one-person business that works from home and meets strangers carrying customer property.

The settled framing: a Northland QuikTrip meetup is the normal arrangement at normal pricing; anything outside that is quoted privately before booking, is not guaranteed, and may run slower.

## City page content standard

All 13 city pages (`templates/page.city-*.json` plus `page.kansas-city-northland.json`) share the same five-section stack and should carry comparable depth. As of 2026-08-22 they range 3,548-4,855 characters; before that pass the floor was 2,271 and six pages had all three body paragraphs empty.

Each page should say something *different* in each slot rather than restating the same sentence. The failure mode to watch for is the hero intro, `local_paragraph_1`, and `cta_description` all carrying the same claim.

Two rules when editing these:

1. **Never invent local facts.** School names, courts, districts, and landmarks go on a page only if they are already there or the owner supplies them. Several pages (Parkville, Platte City, Pleasant Valley, Weatherby Lake, North Kansas City, and the Northland hub) have no school anchor, and that is better than a wrong one.
2. **Do not overwrite local specifics with boilerplate.** Several city pages carry better local detail than the Liberty template does, including exact QuikTrip locations (8601 MO-45, 8600 Pleasant Valley Rd, MO-92, North Oak Trafficway near Highway 169) and references like Northland Racquet Club. That detail is the local SEO asset. Business-level substance (setup tracking, string selection guidance) is shared boilerplate and is fine to repeat; the local slots are what differentiate.

## Files to check for the current source of truth
- `config/settings_data.json` — theme editor colors, fonts, spacing, button/card styling
- `assets/belles-fonts.css` — font-face declarations
- `assets/belle-hero.css`, `belle-footer.css`, `belle-why-section.css`, `section-belle-*.css` — brand color variables and applied typography
