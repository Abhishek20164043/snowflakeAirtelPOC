# Airtel POC — Stardust → EDS conversion log

## Source prototypes

- `stardust/prototypes/home.html` — "Airtel — India's #1 Network | Home"
- `stardust/prototypes/looking-for.html` — "Airtel — What are you looking for?"

## Block inventory

### Home page (`content/index.html`)

| # | Block | Section in prototype |
|---|---|---|
| 1 | `hero` | dark hero with red wave + side image + CTAs |
| 2 | `promo-rail` | 4 promo pills below hero |
| 3 | `product-cards` | 4-card product grid (one `featured` dark card) |
| 4 | `recharge-strip` | dark "Quick Recharge" strip with tabs + input |
| 5 | `plan-finder` | 2-col wifi configurator (steps + recommended panel) |
| 6 | `recommendations` | 4-card image grid with overlay text |
| 7 | `business-grid` | intro + 2×2 enterprise cards |

### Looking-for page (`content/looking-for.html`)

| # | Block | Section in prototype |
|---|---|---|
| 1 | `intent-hero` | dark gradient hero + 4 colored intent path cards |
| 2 | `floating-recharge` | sticky quick-recharge bar |
| 3 | `path-nav` | dark sticky anchor nav |
| 4 | `path-home` | "Connect at home" — hero card + 3 mini plan cards |
| 5 | `path-mobile` | filter sidebar + 6 plan card grid |
| 6 | `path-bank` | image card + 6 quick-action cards |
| 7 | `path-business` | stat stack + 2×2 solution cards |
| 8 | `trust-strip` | 5 stat items, dark background |

## Reuse decisions

- **No block reuse between the two pages.** The two prototypes use distinct visual languages (red/black retail vs colored intent paths). Each section maps to its own block. The header/footer are the only shared elements.
- **`hero` (home) vs `intent-hero` (looking-for)** are visually different enough to be separate blocks (hero is product-focused with side image; intent-hero is intent navigation with 4 colored chips).
- **`recharge-strip` (home, dark, large)** and **`floating-recharge` (looking-for, sticky, white)** are also visually distinct — kept separate per the one-section-one-block rule.
- **`business-grid` (home) vs `path-business` (looking-for)** look related but `path-business` has stat tiles + orange theme — different blocks.

## Site foundation

- **`styles/styles.css`** — Lifted `:root` tokens from both prototypes (they share most: `--red #E40000`, `--charcoal`, `--off-white`, `--lavender`, `--text-on-dark`, radii, `--max-w 1280px`, `--header-h 64px`). Added the looking-for intent-path color set (`--home-clr`, `--mobile-clr`, `--bank-clr`, `--biz-clr`). Plus the EDS section scaffold, body reset, and global button system.
- **`styles/fonts/`** — Self-hosted Nunito Variable (latin) from `@fontsource-variable/nunito`. Italic also bundled. Both shipped as woff2 (~40 KB each).
- **Font swap (zero CLS pattern)** — Body defaults to `arial, sans-serif`; `body.session` switches to `var(--font-body)`. An override `@font-face "Arial"` with `size-adjust: 100.6%; ascent-override: 101%; descent-override: 35%` makes the local Arial render with Nunito's metrics. (Fontsource doesn't publish a calibrated fallback for Nunito — these values are a reasonable Capsize-derived approximation.)
- **`head.html`** — untouched. No font links, no preloads.

## Static header + footer fragments

- `fragments/header.html` — Airtel logo + 5 nav tabs (Wi-Fi / Priority Postpaid / Prepaid / DTH / Airtel Black) + More dropdown → /looking-for, plus search + sign-in. Sticky white bar.
- `fragments/footer.html` — 5-column dark footer (Quick Access / Services / Help / About) with social row + app badges.
- Both committed to GitHub and loaded from the code origin by `scripts/postlcp.js`. No DA deployment; no block JS.

## Authoring shape notes

- Each block's JS is positional: rows in author order map to specific fields. JSDoc at top of each `<block>.js` documents the row schema.
- CTAs use the EDS convention: `<strong><a>` → `.btn-primary`, `<em><strong><a>` → `.btn-accent` (Airtel red), `<em><a>` → `.btn-secondary`. Block JS just clones the cell's child nodes into an `.actions` wrapper — `decorateButton()` in `scripts/ak.js` applies the classes earlier in the pipeline.
- Multi-line cell content (option lists, feature bullets) is encoded with `<br>` or newlines and parsed by per-block helpers.
- An option/chip prefixed with `* ` is treated as "selected/active" — used by `plan-finder` steps, `path-mobile` filter chips.
- `product-cards` row 2 (variant cell) supports `featured` (dark card) and tag-color (`red`/`black`/`lavender`).
- `path-home` plans use `recommended` to highlight the middle card.
- `path-mobile` plans use `popular` to highlight cards with the green badge.

## Images

- The prototype `<img>` paths point to a sibling `_files/` folder produced by the browser when the prototype was saved. Those images are not in the repo and the user's `~/Downloads/` is sandboxed from this session.
- Content pages reference **`picsum.photos`** seeded URLs as placeholders so the pages render correctly during `aem up` preview. Replace with the actual Airtel CDN URLs (or upload assets to `stardust/prototypes/images/` and update the URLs to `https://main--snowflakeAirtelPOC--Abhishek20164043.aem.page/stardust/prototypes/images/...`) before publishing.

## Anti-patterns intentionally avoided

- Did **not** abstract `hero` / `intent-hero` into a shared block with variants. Per the skill's rule, one section = one block.
- Did **not** add `.section.dark` style classes. Per-block CSS paints its own dark surfaces.
- Did **not** manufacture button anchors in block JS — the EDS link decorator owns button classes.
- Did **not** put fonts or preload links in `head.html`. All font declarations live in `styles/styles.css`.
- Did **not** rebuild the header/footer through block JS. They are static fragments served from the code origin.

## Next steps

1. Run `aem up` from the repo root to preview locally.
2. Replace `picsum.photos` placeholders with real Airtel assets.
3. Smoke-test the looking-for page anchor scroll (`#path-home` etc.) — the path-nav, intent-hero, and intent paths use these.
4. Tune Nunito fallback metrics empirically if you observe any layout shift on font load.
