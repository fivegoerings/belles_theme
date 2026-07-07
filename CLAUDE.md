# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Shopify theme for **Belle's Performance Tennis** (racquet stringing, racquet sales, and lessons, based in the Kansas City Northland). It's a fork of Shopify's **Dawn** theme (`config/settings_schema.json` reports `theme_version: 15.5.0`) with a layer of custom `belle-*` sections/snippets/assets built on top for this business. There is no `package.json`, build tooling, or test suite — this is a plain Liquid/JS/CSS theme directory deployed via Shopify CLI or the admin theme editor. The repo is currently not under git version control.

A full theme export zip (`theme_export__...zip`) sits at the repo root as a backup snapshot — it's not part of the working source and shouldn't be edited or unzipped into the tree.

The repo is under git, pushed to a private GitHub repo (`fivegoerings/belles_theme`, remote `origin/main`). Deploying a change means both `git push origin main` (source of truth / CI) and `shopify theme push --theme <id> --allow-live` (the actual live storefront) — pushing to git alone does not affect the live site.

## Commands

There's no npm/build pipeline in this repo. Standard Shopify theme workflows apply if the Shopify CLI is installed:

- `shopify theme dev` — serve the theme locally with hot reload against a connected dev store
- `shopify theme check` — lint Liquid/JSON against Shopify's Theme Check rules, configured via `.theme-check.yml` (extends the default rule set)
- `shopify theme push` / `shopify theme pull` — sync with a Shopify store's theme library
- `shopify theme package` — produce a distributable zip like the one already at the repo root

There is no automated test suite, but `.github/workflows/theme-check.yml` runs Theme Check on every push/PR to `main` via Shopify's `theme-check-action`. Verifying changes locally means running `theme dev` and checking pages/sections in the browser (and in the Shopify theme editor for schema/settings changes).

Theme Check currently passes clean (0 offenses). A few `{% # theme-check-disable ... %}` / `theme-check-enable` comment pairs are in place for known false positives rather than real bugs — e.g. `RemoteAsset` around the intentional Calendly `preconnect`/`dns-prefetch` links and the JS-populated empty-`src` lightbox `<img>`s, `UndefinedObject` around the valid `offset: continue` pagination keyword in `main-product.liquid`, and `UnclosedHTMLElement` around the cross-loop-iteration category grouping in `belle-gallery-section.liquid` (its div open/close pairs span loop iterations in a way Theme Check's HTML parser can't statically verify, even though the rendered markup is balanced). Don't "fix" these by removing the suppressions without re-verifying the underlying pattern is actually still a false positive.

## Architecture

Standard Shopify theme structure:
- `layout/theme.liquid` — main HTML shell (fonts, meta tags, global scripts); `layout/password.liquid` for password-protected stores
- `sections/` — renderable, theme-editor-configurable blocks (each with a `{% schema %}` block defining settings/blocks)
- `snippets/` — reusable Liquid partials, included via `{% render %}`
- `templates/*.json` — per-page-type section compositions (JSON templates reference section `type`s and pass `settings`); a few legacy `.liquid` templates remain (`gift_card.liquid`, `page.legal.liquid`)
- `config/settings_schema.json` / `settings_data.json` — global theme settings (colors, typography, layout) and their current values
- `locales/` — translation files; `en.default.json` is the source locale, `*.schema.json` files are translations for section/setting labels used in the theme editor
- `assets/` — all CSS/JS/images/fonts, referenced via the `asset_url` filter; no bundler, everything is loaded as separate `<script>`/`<link>` tags

### Dawn vs. custom code

Most of `assets/`, `sections/`, and `snippets/` is stock Dawn (cart drawer, facets, predictive search, quick order list, product variant picker, etc.) — treat those as upstream code and be conservative about changing their behavior, since future Dawn updates may need to be merged in.

The business-specific layer is the `belle-*`-prefixed sections/CSS files, plus a handful of specific integrations:
- `sections/belle-*.liquid` — marketing/commerce sections specific to this store: hero, about, pricing, FAQ, gallery, stringing services, racquet sales, and per-city local-SEO landing sections (`belle-city-hero`, `belle-city-community`, `belle-city-landing`). Each city page template under `templates/page.city-*.json` composes these with per-city copy and a Calendly booking URL carrying UTM params.
- `assets/belle-racquet-sales.js` + `sections/belle-racquet-sales.liquid` — a custom racquet catalog/quick-view built without Dawn's product-modal component. Product data is serialized into a page-level `window.BelleRacquetSales[section.id]` object by the Liquid section, and the JS renders a filterable grid, a spec/gallery modal, and adds to cart via `/cart/add.js` directly (including an optional "stringing add-on" line item with String/Tension/racquet cart properties).
- `assets/standard-actions-override.js` — reconfigures Shopify's Storefront Renderer "Standard Actions" bundle (`window.Shopify.actions`) so `openCart`/`updateCart` route through Dawn's own `<cart-drawer>` element and pubsub (`cart-update`) instead of the bundle's built-in refresh logic. This is what keeps Shopify's native buy-button/cart actions compatible with Dawn's custom cart UI. If Dawn's cart markup or its pubsub-handled section list changes, `DAWN_CART_TAGS`/`DAWN_PUBSUB_REFRESHED_SECTIONS` in that file need to stay in sync (see comments in the file).
- `snippets/calendly-modal.liquid` — turns any element with `data-calendly-modal="true"` (or a `calendly.com` link) into a Calendly booking popup; used across hero/CTA sections for scheduling stringing/lessons.
- `assets/belles-fonts.css`, `belle-hero.css`, `belle-footer.css`, `belle-why-section.css`, `collage.css`, `mask-blobs.css` — custom styling/layout not part of stock Dawn.

When editing a `belle-*` section, check its `{% schema %}` block for the settings/defaults already wired up (copy, CTA URLs with UTM params, pricing, spacing ranges) before assuming new settings are needed.

### Section ID scoping pattern

Sections that need per-instance JS state (like `belle-racquet-sales`) key global data and DOM ids by `{{ section.id }}` (e.g. `brs-grid-{{ section.id }}`, `window.BelleRacquetSales["{{ section.id }}"]`) so multiple instances of the same section can coexist on a page without collisions — follow this pattern for any new stateful section.

## Performance notes (PageSpeed Insights / Core Web Vitals)

Real-world PSI numbers on this site are **noisy run-to-run**, especially on mobile (single-run Performance scores have swung 35-54 on an otherwise-unchanged page within minutes). Desktop throttling is much lighter and gives a cleaner trend. Don't react to a single PSI run — if chasing a specific regression/improvement, run it 2-3+ times or use WebPageTest.org (multi-iteration median) instead.

Fixes already shipped (see git log around 2026-07-06 for the full sequence):
- `snippets/calendly-modal.liquid`: Calendly's ~2.5MB booking widget now only preloads on `pointerenter`/`touchstart`/`focus` of a trigger element, not unconditionally on every page load.
- `sections/belle-hero-section.liquid`: the hero background image needs a **manual** `<link rel=preload as=image fetchpriority=high>` — Shopify's `image_tag: preload: true` filter does not emit a preload link when called from a section template (only works before `content_for_header` flushes, i.e. from the layout). Don't "simplify" this back to the filter argument.
- `layout/theme.liquid` + `snippets/cart-drawer.liquid`: cart-drawer CSS (`component-cart-drawer.css`, `component-cart.css`, `component-totals.css`, `component-price.css`, `component-discounts.css`, `quantity-popover.css`, `component-card.css`) is deferred via `media="print" onload="this.media='all'"` since the drawer is hidden off-canvas on every page regardless of template. `component-slideshow.css`/`component-slider.css` from `announcement-bar.liquid` were deliberately **not** deferred — the announcement bar is visible above the fold site-wide with `auto_rotate: true`, genuinely using the slider mechanics on first paint.
- `assets/belles-fonts.css` + font-family stacks in `belle-hero.css`/`belle-racquet-sales.css`/`section-belle-article.css`/`section-belle-blog.css`/`section-belle-faq.css`: added metric-matched fallback `@font-face` rules (`Bebas Neue Fallback`, `Source Sans Pro Fallback`, computed via `fontkit` against Arial/Arial Black metrics) as the 2nd choice in every stack, defense-in-depth against font-swap layout shift even though these fonts already use `font-display: optional`.
- `layout/theme.liquid`: preconnects to `fonts.googleapis.com`/`fonts.gstatic.com` — an installed app loads a Google Font directly (not our self-hosted fonts), and it was the single longest item in the real network critical path (1,375ms, almost entirely connection setup) with nothing preconnecting to it.
- Microsoft Clarity disabled both as a theme app-embed block (`config/settings_data.json`) and in Shopify Admin → Settings → Customer events (the theme embed alone wasn't sufficient; Clarity kept loading via the separate Customer Events/Web Pixel registration until both were off).

**Known, understood, unfixed**: intermittent mobile CLS (~0.4, on `section.belle-hero-v2`) was root-caused via WebPageTest/Catchpoint waterfall data to **Shopify's own "Sign in with Shop" / Shop Pay buyer-recognition system** — a native platform script (`shop-js` module `chunk.useUserRecognitionSignal_*.esm.js`) that runs a hidden cross-domain iframe handshake (`/services/login_with_shop/buyer/transfer` → `shop.app/pay/hop` → callback) on every Shopify storefront, timed almost exactly at the observed shift. This is not theme code, not an app, and has no theme-level fix — only a possible Shopify Admin/Payments-level setting (if one exists) to disable Shop Pay buyer recognition, which is a business tradeoff against Shop Pay's conversion benefits, not a bug fix. Don't re-investigate this from scratch; verify this is still the cause before spending time on it again.

Other confirmed-non-theme third-party weight (don't try to "fix" from the theme): Google Tag Manager loads 3x (GA4 `G-SKJK8YPREK` twice due to Google's own GA4↔Merchant-Center tag-linking, plus a separate `GT-WPLWW3SK` container), Google Merchant Center's `gstatic.com` scripts (~284KB), and Shopify's own `shop-js`/checkout-web/Shop Pay bundles — all either store-configuration-level (Customer Events/Sales Channels in Shopify Admin) or core platform code that ships regardless of theme.
