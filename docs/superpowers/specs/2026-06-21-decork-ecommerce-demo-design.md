# Decork Products LTD — E-commerce Demo Design Spec

**Date:** 2026-06-21
**Client:** Decork Group (Nigeria) — tiles & paint building-materials retailer
**Deliverable:** A demo storefront to show the client. Not live. Go-live is a later phase.
**Reference:** Layout and feel modeled on [claybrookstudio.co.uk](https://www.claybrookstudio.co.uk) (premium, editorial), dressed in Decork's brand.

---

## 1. Goals & scope

Build a **fully clickable demo** of the buying journey: **browse → select/configure → add to cart → pay (simulated) → confirmation**, for **tiles and paint only** (Decork's other divisions — Logistics, Dolomite, Increte, Ayaa Water — appear only as an "Our Group" mention).

- **Audience:** retail customers. Trade/bulk accounts are explicitly **out of scope** (Phase 2).
- **Currency:** Nigerian Naira (₦).
- **Payments:** **simulated only** — no real gateway, no real charge.
- **Region:** Nigeria; depots in Aba (Abia), Enugu, Abuja.

### Out of scope (Phase 2 / go-live)
Real payment gateway, user accounts/login, real inventory/ERP sync, trade pricing, delivery-rate engine, admin dashboard, AR/room visualiser, live hosting.

## 2. Build approach

**Static site — hand-coded HTML / CSS / vanilla JS.** No build step, no backend. Catalog is JSON; cart lives in `localStorage`; checkout is simulated. Chosen for total design control (to match Claybrook), zero cost, instant browser preview, and easy free hosting later (Netlify/GitHub Pages). All catalog/cart/calculator logic maps cleanly onto a real backend when going live.

## 3. Visual identity

Decork's brand in Claybrook's premium register: a calm cream/white canvas, restrained use of brand colour, elegant serif headings.

### Palette
| Token | Hex | Use |
|---|---|---|
| Decork Red | `#CC3527` | primary accent — buttons, links, hovers (used sparingly) |
| Decork Green | `#2E9E3A` | secondary accent — tags, eco/in-stock cues |
| Clay Brown | `#6E3A2F` | announcement bar + footer bands |
| Ink | `#2B2926` | body text / headings |
| Cream | `#FAF8F4` | page canvas |
| Sand | `#F1EDE5` | alternating section fills |
| Line | `#E7E3DB` | borders |
| White | `#FFFFFF` | cards |

> Hex values are read from the logo; replace with exact brand values / SVG logo when available.
> Rule: ~90% of any page is cream/white/ink. Red is the action colour only.

### Typography (loaded free via Google Fonts)
- **Headings:** **Lora** (serif), light weight, sentence case, tight line-height — *exact match to Claybrook*.
- **Body / nav / eyebrows:** **Hanken Grotesk** (sans) — free stand-in for Claybrook's proprietary Calibre. Calibre may be licensed later for pixel-identical body text.
- **Signature pattern:** small UPPERCASE letter-spaced sans **eyebrow** above a large light **Lora** heading.

## 4. Site map

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | layout per §5 |
| Tiles listing | `tiles.html` | grid + filters (origin: Nigerian/Italian/Spanish, category, colour, size, finish) |
| Paint listing | `paint.html` | grid + filters (colour family, finish, interior/exterior) |
| Product detail | `product.html` | one page, driven by `?id=`; renders tile or paint from JSON |
| Cart | `cart.html` | line items in ₦, qty in boxes/tins showing m²/L, totals |
| Checkout | `checkout.html` | delivery details + simulated payment |
| Confirmation | `confirmation.html` | order number + summary |
| Our Locations | `locations.html` | Aba · Enugu · Abuja depots |
| About | `about.html` | Decork Group story |

## 5. Homepage layout (mapped onto Claybrook)

1. **Announcement bar** — "Nigerian · Italian · Spanish Tiles · Decorkote Paints | Free Samples · Nationwide Delivery" (Clay Brown band).
2. **Header** — centered Decork logo; nav: **TILES · PAINT · OUR LOCATIONS · ABOUT** + search + cart icons.
3. **Hero** — full-width image, serif headline, primary CTA (Shop Tiles) + outline CTA (Shop Paint).
4. **Shop by category** — Tiles / Paint feature blocks.
5. **"The Decork Difference"** — 3 value props: Nationwide delivery (Decork Logistics) · Free samples · Expert service (3 depots).
6. **"Our Locations"** — Aba · Enugu · Abuja, with CTA.
7. **Newsletter band + Footer** — footer columns: Contact (depots + phones) · Company · Your order · Products; social icons.

> Removed vs Claybrook (per client): "Inspiration & Advice" and "Real Projects" sections.

## 6. Data model

```jsonc
// data/tiles.json — array of:
{ "id":"carrara-60x60", "type":"tile", "name":"Carrara Marble-Effect Porcelain",
  "origin":"Italian", "category":"Floor", "finish":"Matte", "sizeCm":"600x600",
  "colour":"White", "pricePerSqm":8500, "sqmPerBox":1.44, "tilesPerBox":4,
  "stockBoxes":120, "images":["assets/products/..."] }

// data/paint.json — array of:
{ "id":"decorkote-emulsion", "type":"paint", "name":"Decorkote Premium Emulsion",
  "category":"Interior", "coveragePerL":12,
  "finishes":["Matte","Eggshell","Satin"],
  "colours":[{"name":"Brilliant White","hex":"#F7F5EF","code":"DK-100"}],
  "sizes":[{"litres":1,"price":3500},{"litres":4,"price":11000},{"litres":20,"price":48000}],
  "images":["assets/products/..."] }
```
- Tile derived value: `pricePerBox = pricePerSqm × sqmPerBox`.
- Paint **variant = colour × finish × size**; price comes from the chosen size.

## 7. Key interactions / logic

### Tile coverage calculator (`calculators.js`)
- Inputs: room length × width (m); layout toggle.
- `area = L × W` → `areaWithWaste = area × (1 + waste)` → `boxes = ceil(areaWithWaste ÷ sqmPerBox)` → `tiles = boxes × tilesPerBox` → `cost = boxes × pricePerBox`.
- **Wastage:** Straight = **10%**, Diagonal/pattern = **15%** (default Straight).
- "Add N boxes to cart" uses the computed box count.

### Paint selector + litres calculator
- Selecting colour/finish/size updates the price (size-driven) and the swatch/label.
- `litres = (wallArea × coats) ÷ coveragePerL` → round up to a tin combination → show recommended tins + cost.

### Cart (`cart.js`, `localStorage`)
- Tile line: qty in **boxes**, displays m² (`boxes × sqmPerBox`), `lineTotal = boxes × pricePerBox`.
- Paint line: qty in **tins** of a chosen variant, `lineTotal = tins × sizePrice`.
- Subtotal, delivery, total in ₦ (formatted `₦1,234,567`).
- **Delivery:** "Free over ₦100,000" (tunable placeholder); otherwise flat fee placeholder.

### Checkout (`checkout.js`)
- Form: name, phone, address, state, delivery method.
- **Simulated payment** options (Nigeria-relevant): Card · Bank Transfer · Pay on Delivery → generates an order number → confirmation page. No real charge.

## 8. Architecture

- **No build step.** Plain `.html` at repo root, shared CSS, modular vanilla JS. Google Fonts via `<link>`.
- **`partials.js`** injects the shared header + footer into every page (single source of truth for nav/logo/footer).
- **`product.html?id=`** renders any product from JSON (no per-product files).
- **`styles.css`** holds the design system (color tokens, type scale, component styles).

```
decork-ecommerce/
├── index.html  tiles.html  paint.html  product.html
├── cart.html  checkout.html  confirmation.html  locations.html  about.html
├── assets/
│   ├── css/styles.css
│   ├── js/{partials,catalog,calculators,cart,checkout}.js
│   ├── img/        # hero, category, logo
│   └── products/   # product photos (placeholders for now)
├── data/{tiles,paint}.json
└── docs/           # research + this spec
```

## 9. Assets

Placeholder imagery from free sources (e.g. Unsplash/Pexels) for now; swap for Decork's real product photos before client sign-off / go-live. Decork logo to be supplied as SVG/PNG; until then a styled wordmark stands in.

## 10. Success criteria

- Visitor can browse tiles & paint, filter, open a product, use the calculator/variant selector, add to cart, reach a confirmed (simulated) order — end to end, in ₦.
- Looks unmistakably premium (Claybrook-grade) and unmistakably Decork (brand colours + logo).
- Opens by double-clicking `index.html`; no server or install required.

## 11. Open items (non-blocking, use defaults)
- Exact brand hex values + logo file.
- Real free-delivery threshold and delivery fee.
- Final product list / real photos.
