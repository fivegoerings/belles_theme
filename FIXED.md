# SEO / Accessibility / PageSpeed Fixes — 2026-07-08 to 2026-07-09

Summary of the SEO cleanup session, triggered by Screaming Frog and PageSpeed Insights audits. All changes are committed to `main` and deployed to the live theme (#152058953924).

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

## Accessibility / Lighthouse (Best Practices, Accessibility, SEO categories)

- **`sections/belle-hero-section.liquid`** (`ce0ee53`) — the hero background image rendered with no `alt` attribute when the uploaded image itself had no alt set in Shopify admin; added a descriptive fallback string. Combined with the heading-order fix above, this took the homepage's Lighthouse Accessibility score from 93→100 and SEO from 92→100 (mobile).

- **`sections/header.liquid`** (`6b55985`) — the site-wide logo's `height` attribute rendered as an invalid float (`height="80.0"`) because `settings.logo_width | divided_by: settings.logo.aspect_ratio` produces a float in Liquid when the aspect ratio isn't a whole number. Added `| round` to both occurrences (desktop logo + middle-center logo variant). This is a real CLS risk — browsers can't reliably reserve layout space for a malformed size attribute — not just a lint nit; Screaming Frog's "Images: Missing Size Attributes" audit was the one that caught it, flagged across all 70 pages that include the header.

### Investigated, left as-is (platform/app behavior, not theme bugs)

- **Blog tag-archive pages get an inconsistent `noindex, follow`** on 4 of 11 tags. Confirmed via full-theme grep that no theme file (layout, sections, or snippets) sets a robots meta tag anywhere — it's injected server-side between our canonical link and the favicon tag, meaning it comes from Shopify's platform or an installed app, not theme code. Can't standardize this from the theme without knowing the actual source.
- **Response Codes: Internal Blocked by Robots.txt** (`cart.js`, `/checkouts/` preload) — intentional Shopify platform defaults, not a bug.
- **H1: Alt Text in H1** (homepage) — the header's h1 wraps the logo `<img>`, so crawlers read the image's alt text as the h1 content. Standard, accepted Dawn pattern (logo-as-h1 on the homepage).
- **PageSpeed "Best Practices" capped at 77** — the only two failing audits (`Uses third-party cookies`, `Issues logged in DevTools Issues panel`) trace to the same root cause reported twice: third-party cookies from Shopify's native Shop Pay buyer-recognition system, the installed Google Merchant Center widget app block, and GA4. All three are legitimate business integrations (checkout conversion, Google Shopping listings, analytics), not theme code, and the user declined to disable any of them to chase the score.
- **Images: Over 100 KB** (68 images) — real, but it's product photography that needs re-compression/re-export before upload; not a theme-code fix.
- **Meta Description duplicates/length, Low Content Pages, blog H1s over 70 chars** — content-level items (admin page/product/post edits), not theme code. Shortened title strings were provided separately for 12 pages/products/posts; not yet applied in Shopify Admin as of this writing.

## Verification notes

- Confirmed at least one Shopify CLI theme push silently failed to persist a file when bundled with another `--only` file in the same command (`page.faq.json` in the `341d684` deploy) — caught by pulling the live theme back down and diffing against the intended change. Every subsequent deploy in this session was verified by `shopify theme pull --only <file>` immediately after push, and cross-checked against the live URL via direct HTTP requests (bypassing browser/CDN cache where relevant).
- Screaming Frog crawls of this site are affected by Shopify's own bot-mitigation: rapid/bulk crawler traffic intermittently receives a stripped-down page response (missing sections, including H1s) that real users and slower requests never see. Confirmed via reproducible rate-based testing (single requests always succeed; rapid repeated requests with a crawler-identifying user agent fail 30-50% of the time). This means Screaming Frog will likely always show some false-positive "missing" results on this site when run at normal crawl speed — reducing max threads to 1 in Screaming Frog's Speed settings avoids triggering it.
