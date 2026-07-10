# SEO / Accessibility / PageSpeed Fixes — 2026-07-08 to 2026-07-09

Summary of the SEO cleanup session, triggered by Screaming Frog and PageSpeed Insights audits. All changes are committed to `main` and deployed to the live theme (#152058953924).

**Real PSI results as of the end of this session (mobile, real Google infrastructure, not local estimates): Performance 62, Accessibility 100, Best Practices 96, SEO 100** (desktop: 79/97/96/100). Started at Performance 51, Accessibility 93, Best Practices 92, SEO 92.

## H1 issues

- **`sections/belle-racquet-sales.liquid`** (`9a56ad4`) — "Solinco Racquets" heading changed from `h2` to `h1` for correct heading hierarchy on the shop/racquets pages. Updated matching CSS selectors in `assets/belle-racquet-sales.css`.

- **`templates/collection.json`** (`ac9bf2f`) — the default collection template had `main-collection-banner` (which renders `<h1>{{ collection.title }}</h1>`) set to `disabled: true`. Enabling it fixed missing H1s on `/collections/all`, `/demo-racquets`, `/strings`, `/solinco-racquets`, `/vintage-racquets`.

- **`templates/page.json`, `templates/page.judgeme_reviews.json`** (`0a1f79e`) — same root cause as above but for the `main-page` section; fixed missing H1 on `/pages/data-sharing-opt-out` and `/pages/customer-reviews`.

- **`sections/main-page.liquid`, `assets/section-main-page.css`, `templates/page.judgeme_reviews.json`** (`8770879`) — `.page-title` had no `text-align`, leaving generic content pages left-aligned while the rest of the site centers headings. Added a `hide_title` option to visually hide the h1 only on the customer-reviews page (Judge.me's own widget renders its own "Customer Reviews" title client-side, so ours was a visible duplicate) while keeping it in the DOM for SEO/screen readers.

- **`sections/belle-faq-section.liquid`, `templates/page.faq.json`** (`341d684`) — the FAQ section hardcoded its title as `h1`, but it's reused as a secondary section on the homepage and pricing page (each already has its own primary h1), producing 2–3 h1s per page. Added an `is_page_heading` setting (default off → renders `h2`), enabled only on `page.faq.json` where the FAQ section is the page's sole content.

- **`sections/belle-article-section.liquid`** (`89038af`) — a blog post had a second `<h1>` typed into the article body via the blog editor, duplicating the template's own h1. Filter `article.content` at render time so any body-authored h1 is demoted to h2 — fixes this post and future-proofs every article against the same authoring pattern.

- **`sections/belle-hero-section.liquid`** (`ce0ee53`) — homepage feature cards were `h3` directly after the hero's `h1` (skipping `h2`, flagged by Lighthouse's heading-order audit). Promoted to `h2` and updated the two CSS selectors that targeted them by tag.

### Left as-is (documented, not code bugs)

- `/cart` — "Your cart" / "Your cart is empty" are two h1s in stock Dawn markup, mutually exclusive via CSS depending on cart state. Never both visible; low SEO impact; changing stock Dawn cart behavior was declined.
- `/blogs/news/know-your-knots` (old URL) — was a genuine 404 from a renamed/removed post, not a theme bug.
- Homepage's `header__heading` h1 (site logo, index-only) + hero h1 is intentional, standard Dawn behavior — not a duplicate-H1 problem.

## Missing alt text

- **`snippets/product-media.liquid`, `snippets/card-product.liquid`** (`b13dc26`) — product images uploaded without alt text in Shopify rendered `alt=""`. Added `default: product.title` fallback (matching a pattern `belle-racquet-sales.liquid` already used), covering the PDP main gallery and collection/quick-add grid cards.

- **`snippets/product-thumbnail.liquid`** (`a60250b`) — found a second, separate render path (the product-page thumbnail nav strip) using Shopify's `image_tag` filter with no `alt:` argument, so it always used the raw (often blank) `media.alt`. This was the actual source of the 47 racquet photos Screaming Frog originally flagged — the main/grid images were already fixed by the commit above, but the thumbnail strip on every product page was a separate, unfixed path. Added the same `product.title` fallback.

## Page titles (SERP truncation)

- **`layout/theme.liquid`** (`ccfa42d`, `6ab3d68`) — the rendered title suffix `– Belle's Performance Tennis Shop™` (~37 chars) pushed 62 of 74 page titles past Google's ~60-char truncation point. Shortened the suffix to `– Belle's™`, and broadened the "already branded" guard from `contains shop.name` to `contains 'Belle'` so admin-set SEO titles that already reference the brand (e.g. `... | Belle's Performance Tennis Shop`) don't get a redundant second suffix appended. Reduced "Page Titles: Over 60 Characters" from 62 pages to a handful of admin-authored titles/blog-tag archive pages (content-level, not theme code).

## Internal links

- **`sections/belle-footer.liquid`, `sections/belle-city-landing.liquid`, `templates/page.city-gladstone.json`** (`5a23980`) — Screaming Frog's redirect report found three hardcoded internal links pointing at old page URLs that 301-redirect to their current versions: the footer's "Areas We Serve" list linked the old Platte City URL (present on every page site-wide, all 69 flagged redirect rows traced back to this one link), all 13 city landing pages' "See Pricing" link used the old `/pages/pricing` URL, and the Gladstone page's "Park Hill" nearby-area cross-link used an old slug. Repointed all three at their current URLs — removes an unnecessary redirect hop on every click and stops diluting link equity.

## Performance / PageSpeed investigation

- **`layout/theme.liquid`** (`1b5e298`) — added a `preconnect` hint for `https://cdn.shopify.com`. Lighthouse flagged the Judge.me app extension's `carousels.css` (3.7 KB) as costing 700–1400ms of render-blocking time, almost entirely cold DNS+TLS connection setup to that origin (different from the store's own `/cdn/` asset paths). Same pattern as the existing Google Fonts preconnect fix.

- **Diagnosed, no code fix exists or needed**: a real PSI mobile run reported LCP as 13.1s, which looked like a serious regression. Investigation using Lighthouse's raw LCP-discovery/breakdown audits plus a WebPageTest.org run resolved this:
  - The hero image (the LCP element) already has every best practice applied (`fetchpriority="high"`, `loading="eager"`, explicit `width`/`height`, discoverable in initial HTML) and itself downloads in ~20ms once requested — confirmed via Lighthouse's `lcp-discovery-insight` and `lcp-breakdown-insight` audits.
  - A devtools-throttled (trace-accurate, not simulated) local Lighthouse run measured real LCP at **1.7s**. A fresh WebPageTest.org run independently confirmed **1.606s**. Both are well inside Google's "good" threshold (<2.5s).
  - The "13.1s" figure was almost certainly a misread of **Total Time** (time for all ~289 requests, including every third-party analytics/tracking script, to finish) rather than actual Largest Contentful Paint — WebPageTest's own "Total Time" reading for the same run was 13.184s, matching almost exactly.
  - Considered and rejected: disabling/removing the hero image to "improve" the LCP metric. Since the image already loads fast, removing it would just shift the LCP candidate to the H1 text (next-largest element), producing a better-looking number without fixing anything real, at a real cost (the hero image does conversion/trust work for the business).
  - Real remaining issue, confirmed by both PSI and WebPageTest: intermittent **Cumulative Layout Shift** (seen as low as 0, as high as 0.48 across different runs of the identical page) traced to Shopify's own native Shop Pay buyer-recognition script — not theme code, no theme-level fix exists, only lever is disabling Shop Pay in Shopify Admin → Payments (a checkout-conversion trade-off, declined).
  - 239 KiB of "unused JavaScript" flagged by Lighthouse is 100% third-party: Google Tag Manager (loaded via **two separate GTM containers** — `GT-WPLWW3SK` and `G-SKJK8YPREK`, worth asking whoever set up tracking why there are two), GA4, and Shopify's own Web Pixel Manager. Zero theme-authored JavaScript appears anywhere in that report.
  - "Best Practices capped at 77" (noted below in an earlier pass, from a local Lighthouse run) turned out to be local-environment noise — a real PSI run from Google's own infrastructure later in the session showed **96**, not 77. The 2 failing audits either way trace to the same non-theme causes (Shop Pay + Merchant Center + GA4 third-party cookies).
  - A brand-new, experimental PSI category called "Agentic Browsing" (Google's own label: "still under development and subject to change") showed 2/3, down from 3/3 seen in an earlier screenshot. The one failing check listed was Cumulative Layout Shift — the same already-diagnosed Shop Pay issue above, not a new or different problem.

## Accessibility / Lighthouse (Best Practices, Accessibility, SEO categories)

- **`sections/belle-hero-section.liquid`** (`ce0ee53`) — the hero background image rendered with no `alt` attribute when the uploaded image itself had no alt set in Shopify admin; added a descriptive fallback string. Combined with the heading-order fix above, this took the homepage's Lighthouse Accessibility score from 93→100 and SEO from 92→100 (mobile).

- **`sections/header.liquid`** (`6b55985`) — the site-wide logo's `height` attribute rendered as an invalid float (`height="80.0"`) because `settings.logo_width | divided_by: settings.logo.aspect_ratio` produces a float in Liquid when the aspect ratio isn't a whole number. Added `| round` to both occurrences (desktop logo + middle-center logo variant). This is a real CLS risk — browsers can't reliably reserve layout space for a malformed size attribute — not just a lint nit; Screaming Frog's "Images: Missing Size Attributes" audit was the one that caught it, flagged across all 70 pages that include the header.

### Investigated, left as-is (platform/app behavior, not theme bugs)

- **Blog tag-archive pages get an inconsistent `noindex, follow`** on 4 of 11 tags. Confirmed via full-theme grep that no theme file (layout, sections, or snippets) sets a robots meta tag anywhere — it's injected server-side between our canonical link and the favicon tag, meaning it comes from Shopify's platform or an installed app, not theme code. Can't standardize this from the theme without knowing the actual source.
- **Response Codes: Internal Blocked by Robots.txt** (`cart.js`, `/checkouts/` preload) — intentional Shopify platform defaults, not a bug.
- **H1: Alt Text in H1** (homepage) — the header's h1 wraps the logo `<img>`, so crawlers read the image's alt text as the h1 content. Standard, accepted Dawn pattern (logo-as-h1 on the homepage).
- **PageSpeed "Best Practices"** — the only two failing audits (`Uses third-party cookies`, `Issues logged in DevTools Issues panel`) trace to the same root cause reported twice: third-party cookies from Shopify's native Shop Pay buyer-recognition system, the installed Google Merchant Center widget app block, and GA4. All three are legitimate business integrations (checkout conversion, Google Shopping listings, analytics), not theme code, and the user declined to disable any of them to chase the score. (See Performance section above — real PSI later showed 96 here, not the 77 a local-only Lighthouse run had suggested.)
- **Images: Over 100 KB** (68 images) — real, but it's product photography that needs re-compression/re-export before upload; not a theme-code fix.
- **Meta Description duplicates/length, Low Content Pages, blog H1s over 70 chars** — content-level items (admin page/product/post edits), not theme code. Shortened title strings were provided separately for 12 pages/products/posts; not yet applied in Shopify Admin as of this writing.
- **Protocol-relative image URLs** (`//cdn.../...`, Screaming Frog's "Security: Protocol-Relative Resource Links", 52 instances) — confirmed this is produced by Shopify's own `image_url` Liquid filter, used across 42 theme files. Cosmetic only on an HTTPS-only site (browsers resolve `//host/path` against the current page's protocol); fixing it means touching 42 files for no real security benefit. Not pursued.

## Final audit pass (checked clean, no action needed)

Ran a dedicated audit crawl for categories not covered by the original Screaming Frog report:

- **Orphan pages**: none found — every crawled page is properly linked internally.
- **Structured data**: zero validation errors, zero parse errors in the site's JSON-LD (Organization/LocalBusiness schema in `theme.liquid`).
- **Duplicate content** (exact and near-duplicate): zero flagged. Notable because the 13 near-identical city landing page templates were a real risk worth checking — each city's local copy, cross-links, and FAQ answers are distinct enough that Screaming Frog doesn't consider them duplicate content.
- **Redirect chains**: none — every redirect on the site is a single hop, not a multi-hop chain.

## Not yet resolved

- **Two apparently orphaned files**, flagged during the `document.md` section/template inventory but not deleted (worth confirming before removal): `sections/belle-stringing.liquid` (no `{% schema %}`, unreferenced legacy stringing-toggle fragment, superseded by `belle-product-stringing.liquid`), and `templates/collection.solinco-racquets.json` (exists in the theme with a working `main-collection-banner` enabled, but the live "Solinco Racquets" collection isn't actually assigned this template suffix in Shopify Admin, so it silently falls back to `collection.json` instead).
- **The one genuine 404** (`/pages/book-tennis-racquet-stringing`) and a **225-character junk tag-archive URL** (every blog tag concatenated into one link) — both traced to a link embedded in Shopify page/blog rich-text content via the admin editor, not visible in the theme repo. Needs a content-side fix in Shopify Admin.
- **12 shortened page/product/post SEO titles** and **3 shortened blog post titles** (to fix the remaining "Page Titles: Over 60 Characters" and "H1: Over 70 Characters" flags) — exact strings were provided in conversation; not yet confirmed applied in Shopify Admin.

## Verification notes

- Confirmed at least one Shopify CLI theme push silently failed to persist a file when bundled with another `--only` file in the same command (`page.faq.json` in the `341d684` deploy) — caught by pulling the live theme back down and diffing against the intended change. Every subsequent deploy in this session was verified by `shopify theme pull --only <file>` immediately after push, and cross-checked against the live URL via direct HTTP requests (bypassing browser/CDN cache where relevant).
- Screaming Frog crawls of this site are affected by Shopify's own bot-mitigation: rapid/bulk crawler traffic intermittently receives a stripped-down page response (missing sections, including H1s) that real users and slower requests never see. Confirmed via reproducible rate-based testing (single requests always succeed; rapid repeated requests with a crawler-identifying user agent fail 30-50% of the time). This means Screaming Frog will likely always show some false-positive "missing" results on this site when run at normal crawl speed — reducing max threads to 1 in Screaming Frog's Speed settings avoids triggering it.
