# Theme Structure Reference — Sections & Templates

Full inventory of every file in `sections/` and `templates/`. See `CLAUDE.md` for the high-level architecture; this file documents what each individual file actually does.

Two kinds of sections exist in this theme:
- **`belle-*` sections** — business-specific, custom-built for Belle's Performance Tennis. Hand-authored, business logic lives here.
- **Stock Dawn sections** — unmodified (or lightly modified) upstream Shopify Dawn components (cart, product page, account pages, generic content blocks). Treat these as upstream code per `CLAUDE.md`.

---

## 1. Custom `belle-*` Sections

| File | Schema name | Purpose | Used on |
|---|---|---|---|
| `belle-404.liquid` | Belle's 404 | Custom 404 page matching the brand palette (green/gold, Bebas Neue/Source Sans Pro). Settings: `heading`, `message`. | `404.json` |
| `belle-about-section.liquid` | Belle's About | "About Us" page — story, team photo blocks (`Team Member`), and value/feature blocks. | `page.about.json` |
| `belle-article-section.liquid` | Belle's Article | Custom single-blog-post layout (hero image, header, body, share buttons) replacing Dawn's `main-article`. Article body content is filtered at render time to demote any author-typed `<h1>` to `<h2>` (fixes a duplicate-H1 pattern from the blog editor). | `article.json` |
| `belle-blog-section.liquid` | Belle's Blog | Custom blog listing/index page layout. | `blog.json` |
| `belle-city-community.liquid` | City Community Callout | Small CTA-styled callout block for a city landing page; entire section hides itself when `community_heading` is blank. | 13 city landing pages |
| `belle-city-hero.liquid` | City Hero | Per-city hero banner — background image, eyebrow, headline, CTA (usually a Calendly booking link with UTM params). | 14 city landing pages |
| `belle-city-landing.liquid` | City Landing Page | The bulk of each city page: 2×2 value-prop grid, local-context paragraphs, testimonial, FAQ block, "nearby areas" cross-links (up to 7). Settings are hierarchical (`value_1..4`, `faq_1..3`, `nearby_1..7`) — all IDs preserved across versions for backward compatibility. v3; see in-file changelog comment for what moved to `belle-city-hero`/`belle-city-community`. | 13 city landing pages |
| `belle-contact.liquid` | Belle's Contact | Branded contact page — form (via Shopify's built-in contact form), contact info, quick-action links. | `page.contact.json` |
| `belle-demo-racquets-section.liquid` | Belle's Demo Racquets | Showcases the Solinco demo-racquet lending program; `How It Works Step`, `Demo Racquet`, and `Program Detail` blocks. | `page.demo-racquets.json` |
| `belle-events-section.liquid` | Events | Lists local KC Northland tennis events (`Event` blocks) so players book stringing ahead of competing. Explicit disclaimer: Belle's is not affiliated with/sponsored by listed events. v3.0. | `page.events.json` |
| `belle-faq-section.liquid` | Belle's FAQ | Accordion-style FAQ list (`FAQ Category`, `FAQ Question` blocks). Has an `is_page_heading` setting (default off → renders `h2`) so the same section can be the page's primary H1 (dedicated FAQ page) or a secondary section elsewhere (homepage, pricing page) without duplicate H1s. | `index.json`, `page.faq.json`, `page.pricing.json` |
| `belle-footer.liquid` | Belle's Footer | Custom footer: logo, tagline, value prop, USRSA affiliation logo, quick-links menu, expandable "cities served" list. Optimized for CLS (explicit image dimensions). | `footer-group.json` |
| `belle-gallery-section.liquid` | Belle's Gallery | Work-gallery page with dynamic category grouping (`Category`, `Photo` blocks). CTA is added as a separate section, not built in. | `page.gallery.json` |
| `belle-hero-section.liquid` | Belle's Hero | Homepage hero — full-width background image, customer-benefit H1 (not the business name), trust bar, dual CTA, feature cards below (`Feature Card` blocks, now `<h2>`). Marked `LOCKED` in comments — don't modify without conversion data. v1.1.0. | `index.json` |
| `belle-how-it-works.liquid` | How It Works | 3-step "how does mobile stringing work" explainer, addressing the top confusion point for first-time visitors per the site's strategy doc. Marked `LOCKED`. | homepage + all 14 city pages |
| `belle-legal-page.liquid` | Belle's Legal Page | Generic legal/policy page layout (Terms of Service, etc.) — `Text Section` and `Highlighted Section` blocks. | `page.legal.liquid` |
| `belle-lessons-section.liquid` | Lessons | Promotes private tennis lesson instruction (Ella Gates). v1.0, added June 2026. | `page.events.json` |
| `belle-new-racquet-setup.liquid` | New Racquet Setup | Targets parents/new-frame owners who don't know factory strings are rarely right for serious play. `Checklist Item` blocks. Marked `LOCKED`. v1.0.0. | `index.json` |
| `belle-pricing-section.liquid` | Belle's Pricing | Full pricing page: price-anchor hero, 3 turnaround-tier cards, detailed pricing table, "what happens to your racquet," big-box comparison. v5.0, restructured per conversion-roast recommendations. | `page.pricing.json` |
| `belle-product-stringing.liquid` | Product Stringing Add-On | Adds a stringing toggle + string/tension picker to individual product pages (only renders if `stringing_variant_id` is set). | `product.json` |
| `belle-racquet-sales.liquid` | Racquet Sales | The Solinco racquet storefront: filterable grid (series/type tabs from `product.product_type`), detail modal with spec table (read from `specs` metafields), add-to-cart with optional stringing add-on line item. Custom JS in `assets/belle-racquet-sales.js`, keyed by `section.id` for multi-instance safety. Heading renders `<h1>`. | `page.racquets.json`, `page.shop.json` |
| `belle-shop-strings.liquid` | Shop Strings | Standalone expandable "strings we carry" list (`String` blocks) — fully editor-managed, no code edits needed to add/remove strings. | `page.pricing.json` |
| `belle-stringing.liquid` | *(none — no `{% schema %}`)* | **Orphaned/legacy.** Plain inline-styled stringing add-on markup (toggle, string/tension selects), predates `belle-product-stringing.liquid`. Not referenced by any section or snippet. Safe to delete after confirming it isn't pulled in by an app block. |
| `belle-why-section.liquid` | Why Belle's (with Images) | "Why choose us" reason cards (`Reason` blocks) with optional images and link URLs, placed between hero and other homepage content. v1.1.0. | `index.json` |
| `belles-pricing-addons.liquid` | Belle's Pricing Add-Ons | Companion section to the pricing page — collects an email lead-gen field alongside pricing add-ons info. | `page.pricing.json` |

### Section groups

| File | Purpose |
|---|---|
| `header-group.json` | Composes `announcement-bar` (rotating banner, currently promoting Northland drop-off booking) + `header` (logo middle-left, dropdown menu, sticky "reduce logo size" behavior). |
| `footer-group.json` | Wraps the single `belle-footer` section instance with the site's logo, USRSA logo, tagline, and footer quick-links menu. |

---

## 2. Stock Dawn Sections (upstream, business-agnostic)

These are unmodified or lightly modified Shopify Dawn components. Grouped by function rather than documented individually — see Shopify's Dawn theme docs for full behavior; only Belle's-specific config notes are called out.

### Product & collection
| File | Purpose |
|---|---|
| `main-product.liquid` | Product page — media gallery, variant picker, buy buttons, description, complementary products. Extensive block system (title, price, sku, inventory, collapsible tabs, icon-with-text, rating, etc.). |
| `main-collection-banner.liquid` | Collection page header — renders `<h1>{{ collection.title }}</h1>` + optional description/image. **Must not be `disabled: true`** or the collection page loses its H1 (was the root cause of several missing-H1 bugs fixed this session). |
| `main-collection-product-grid.liquid` | The product grid/filtering/sorting UI on collection pages. |
| `featured-product.liquid`, `featured-collection.liquid` | Reusable "spotlight one product/collection" sections, usable on any page via the theme editor. |
| `related-products.liquid` | "You may also like" product recommendations block on product pages. |
| `quick-order-list.liquid`, `bulk-quick-order-list.liquid` | B2B-style bulk variant ordering tables. Not confirmed in active use on this store. |
| `pickup-availability.liquid` | Local pickup availability widget (store locations), used inside product templates. |
| `disclosures.liquid` | Product page legal/shipping disclosure text block. |

### Cart
| File | Purpose |
|---|---|
| `main-cart-items.liquid` | Full `/cart` page line-item list. Contains the well-known dual-h1 pattern ("Your cart" / "Your cart is empty") — both always render, CSS shows/hides based on cart state. Left as-is; stock Dawn behavior. |
| `main-cart-footer.liquid` | Cart page subtotal + checkout button. |
| `cart-drawer.liquid` | Off-canvas cart drawer (used site-wide regardless of page). |
| `cart-icon-bubble.liquid`, `cart-notification-button.liquid`, `cart-notification-product.liquid`, `cart-live-region-text.liquid` | Small cart-state UI fragments (header cart icon badge, "added to cart" toast). |

### Customer accounts
| File | Purpose |
|---|---|
| `main-account.liquid` | Account dashboard (order history). |
| `main-login.liquid`, `main-register.liquid`, `main-activate-account.liquid`, `main-reset-password.liquid` | Auth flow pages. |
| `main-addresses.liquid` | Saved address book management. |
| `main-order.liquid` | Single order detail/status page. |

### Content & layout building blocks
Usable on any page via the theme editor's Add Section menu — these are Dawn's generic, reusable content sections:

| File | Purpose |
|---|---|
| `rich-text.liquid` | Heading + text + button(s), centered content block. |
| `multicolumn.liquid`, `multirow.liquid` | Grid layouts of repeating column/row blocks (icon + heading + text pattern). |
| `image-with-text.liquid`, `image-banner.liquid` | Image paired with text/CTA, in banner or side-by-side layout. |
| `collage.liquid` | Asymmetric image/product/collection/video grid. |
| `collapsible-content.liquid` | Accordion-style expandable rows (generic, non-FAQ-specific version of `belle-faq-section`). |
| `slideshow.liquid` | Full-width slide carousel. |
| `video.liquid` | Embedded or self-hosted video block. |
| `custom-liquid.liquid` | Escape hatch for raw Liquid/HTML injection via the theme editor. |
| `collection-list.liquid` | Grid of collection cards (used on the generic `page.json` default template). |
| `featured-blog.liquid` | Blog post preview grid, embeddable on any page. |
| `newsletter.liquid`, `email-signup-banner.liquid` | Email capture forms (the latter also used as the password-page layout). |
| `contact-form.liquid` | Standalone Shopify contact form (Belle's uses its own `belle-contact.liquid` instead for the main contact page). |
| `announcement-bar.liquid` | Rotating top-of-page banner (used in `header-group.json`). |
| `header.liquid` | Site header — logo, nav menu, search, cart icon. Contains the `logo_height` calculation (fixed this session — was producing an invalid float `height` attribute). |
| `footer.liquid` | Stock Dawn footer (superseded by `belle-footer.liquid` for the live theme, kept for reference/rollback). |
| `apps.liquid` | Generic slot for Shopify app embed blocks (used to host the Judge.me reviews widget on `index.json` and `page.judgeme_reviews.json`, and the product page). |

### System / utility pages
| File | Purpose |
|---|---|
| `main-404.liquid` | Stock Dawn 404 (superseded by `belle-404.liquid`). |
| `main-page.liquid` | Generic page renderer — `<h1>{{ page.title }}</h1>` + `page.content`. Has a `hide_title` setting (added this session) to visually hide the h1 while keeping it in the DOM, used on the customer-reviews page to avoid duplicating Judge.me's own widget title. |
| `main-list-collections.liquid` | "All collections" index page. |
| `main-blog.liquid`, `main-article.liquid` | Stock Dawn blog/article renderers (superseded by `belle-blog-section.liquid` / `belle-article-section.liquid`). |
| `main-search.liquid`, `predictive-search.liquid` | Search results page and live search-as-you-type dropdown. |
| `main-password-header.liquid`, `main-password-footer.liquid` | Header/footer shown only on the password-protected storefront splash page. |
| `page.liquid` | Legacy/simple page section (largely superseded by `main-page.liquid` + belle-* page sections). |

---

## 3. Templates

Templates compose sections into a page. All are JSON except `gift_card.liquid` and `page.legal.liquid` (legacy Liquid templates).

### Homepage & core resource pages
| Template | Sections used | Notes |
|---|---|---|
| `index.json` | `belle-hero-section` → `belle-how-it-works` → `belle-new-racquet-setup` → `belle-why-section` → Judge.me reviews (`apps`) → `cta-inline` → `belle-faq-section` (h2) → `cta-inline` | Homepage. |
| `product.json` | `main-product`, `belle-product-stringing`, `related-products`, app blocks | Default product page. |
| `collection.json` | `main-collection-banner`, `main-collection-product-grid` | Default collection template — banner section must stay enabled (fixed this session). |
| `collection.solinco-racquets.json` | Same as above, banner enabled by default | **Orphaned**: exists in the theme but the live "Solinco Racquets" collection isn't actually assigned this template suffix — it falls back to `collection.json`. Either assign it in Shopify Admin or delete the unused file. |
| `cart.json` | `main-cart-items`, `main-cart-footer` | |
| `search.json` | `main-search` | |
| `list-collections.json` | `main-list-collections` | |
| `blog.json` | `belle-blog-section`, `cta-inline` | |
| `article.json` | `belle-article-section` | |
| `404.json` | `belle-404` | |
| `password.json` | `email-signup-banner` (layout: password) | |

### Custom pages (`page.*.json`)
| Template | Page | Sections |
|---|---|---|
| `page.json` | Default/fallback for any Shopify Page without a specific template | `main-page`, `featured-collection` (disabled), `collection-list`, `rich-text` — note this default composition looks like a "browse our collections" landing pattern, not generic body copy. |
| `page.about.json` | About Us | `belle-about-section` |
| `page.calendar.json` | Booking calendar page | `main-page`, `cta-inline` |
| `page.contact.json` | Contact | `belle-contact` |
| `page.demo-racquets.json` | Demo Racquet Program | `belle-demo-racquets-section` |
| `page.events.json` | Events | `belle-city-hero`, `belle-lessons-section`, `belle-events-section`, `cta-inline` |
| `page.faq.json` | Dedicated FAQ page | `belle-faq-section` (`is_page_heading: true` → renders `h1`), `cta-inline` |
| `page.gallery.json` | Work gallery | `belle-gallery-section` |
| `page.judgeme_reviews.json` | Customer Reviews | `main-page` (`hide_title: true`), Judge.me widget (`apps`), `cta-inline` |
| `page.legal.liquid` | Terms of Service (legacy Liquid template) | `belle-legal-page` |
| `page.pricing.json` | Pricing | `belle-pricing-section`, `belles-pricing-addons`, `belle-shop-strings` (disabled), `belle-faq-section` (h2), `cta-inline` |
| `page.racquets.json` | Racquet shop (generic) | `belle-racquet-sales` |
| `page.shop.json` | Racquet shop (Solinco, tennis-equipment-kansas-city-northland URL) | `belle-racquet-sales` |
| `page.kansas-city-northland.json` | City landing (legacy naming) | `belle-city-hero`, `belle-city-community`, `belle-how-it-works`, `belle-city-landing`, `cta-inline` |
| `page.city-*.json` (11 files: gladstone, kearney, liberty, north-kansas-city, parkhill, parkville, platte-city, pleasant-valley, smithville, staley, weatherby-lake, winnetonka) | Per-suburb local-SEO landing pages | Identical section stack: `belle-city-hero`, `belle-city-community`, `belle-how-it-works`, `belle-city-landing`, `cta-inline`. Only the settings content (city name, copy, Calendly UTM params) differs per file. |

### Customer account templates (`templates/customers/`)
| Template | Section |
|---|---|
| `account.json` | `main-account` |
| `activate_account.json` | `main-activate-account` |
| `addresses.json` | `main-addresses` |
| `login.json` | `main-login` |
| `order.json` | `main-order` |
| `register.json` | `main-register` |
| `reset_password.json` | `main-reset-password` |

### Utility
| Template | Purpose |
|---|---|
| `gift_card.liquid` | Legacy Liquid template for the gift card issuance/redemption page. |

---

## Notes & known gaps

- **`collection.solinco-racquets.json`** and **`belle-stringing.liquid`** both appear to be orphaned — not referenced by anything live. Worth confirming with a `shopify theme check` / Admin audit before deleting.
- The 13 near-identical **city landing page templates** are a strong candidate for consolidation if Shopify ever supports parameterized templates — currently each is a full copy with only settings values differing.
- Several `belle-*` sections carry `LOCKED` comments (`belle-hero-section`, `belle-how-it-works`, `belle-new-racquet-setup`) — these were intentionally frozen pending conversion data (GA4/Calendly) per the business's own strategy doc. Don't restructure them without that data, per the in-file instructions.
