# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Shopify theme for **Belle's Performance Tennis** (racquet stringing, racquet sales, and lessons, based in the Kansas City Northland). It's a fork of Shopify's **Dawn** theme (`config/settings_schema.json` reports `theme_version: 15.5.0`) with a layer of custom `belle-*` sections/snippets/assets built on top for this business. There is no `package.json`, build tooling, or test suite — this is a plain Liquid/JS/CSS theme directory deployed via Shopify CLI or the admin theme editor. The repo is currently not under git version control.

A full theme export zip (`theme_export__...zip`) sits at the repo root as a backup snapshot — it's not part of the working source and shouldn't be edited or unzipped into the tree.

## Commands

There's no npm/build pipeline in this repo. Standard Shopify theme workflows apply if the Shopify CLI is installed:

- `shopify theme dev` — serve the theme locally with hot reload against a connected dev store
- `shopify theme check` — lint Liquid/JSON against Shopify's Theme Check rules, configured via `.theme-check.yml` (extends the default rule set)
- `shopify theme push` / `shopify theme pull` — sync with a Shopify store's theme library
- `shopify theme package` — produce a distributable zip like the one already at the repo root

There is no automated test suite, but `.github/workflows/theme-check.yml` runs Theme Check on every push/PR to `main` via Shopify's `theme-check-action`. Verifying changes locally means running `theme dev` and checking pages/sections in the browser (and in the Shopify theme editor for schema/settings changes).

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
