# Decork Products LTD — E-commerce Research & Backend Model

**Client:** Decork Products LTD — tiles & paint (building materials) retailer
**Goal:** Demo site → customers browse products, configure/select, add to cart, pay at checkout.
**Status:** Research / discovery (demo first; go-live explored later)
**Date:** 2026-06-21

---

## 1. Case studies (who to copy, and what specifically)

| Company | What they sell | Backend features worth stealing |
|---|---|---|
| **Topps Tiles** (UK #1 tile specialist) | Wall/floor/bathroom/kitchen tiles + LVT, laminate, grout | **Free sample ordering** (up to 3 cut samples + grout samples), **room visualiser** ("Design My Home" — upload your room), **coverage in m²/box on every product page**, **click & collect from 300+ stores**, free kerbside delivery over a threshold (£300) |
| **Tile Mountain / Walls & Floors** | Tiles direct-to-consumer | Per-m² *and* per-box pricing shown together, tiles-per-box + m²-per-box on PDP, free/cheap sample packs, "trade account" tier |
| **Floor & Decor / Best Tile / Apollo Tile** | Tile + flooring | **Tile coverage calculator** (enter room dimensions → boxes needed + wastage %), "sq ft per case" on every product |
| **Dulux / Benjamin Moore / Sherwin-Williams / Behr** | Paint | **Variant matrix**: colour × sheen/finish × tin size × base, **colour visualiser** (paint a photo of your wall), colour search by name/code (RAL, Pantone), **sheen guide** to help choose finish |
| **Sana Commerce / OroCommerce / TOOLBX** | B2B construction-materials platforms | **Trade/contractor accounts** with negotiated pricing, **bulk/volume pricing tiers**, **ERP/inventory real-time sync**, **freight/LTL delivery** for heavy goods, account hierarchies (branches, buyers), reorder/quote flows |

### The recurring lessons
1. **Building materials are not sold "one unit at a time."** Tiles sell by the **box** but are *priced and chosen by area (m²/ft²)*. Paint sells by **tin size** within a colour+finish combination. Your data model must handle this or nothing else works.
2. **Buyers won't commit blind.** Samples, high-res multi-angle photos, texture/360 views, and visualisers reduce returns and abandoned carts.
3. **Quantity help is mandatory.** A **coverage calculator** (room size → boxes + wastage allowance of 10–20%) is the single highest-value tool for a tile shop.
4. **Two customer types.** Retail walk-in homeowners *and* trade/contractors who want bulk pricing, accounts, and delivery. Even the demo should leave room for this.
5. **Heavy + fragile = logistics matter.** Delivery cost by weight/zone, pallet/kerbside delivery, and click-&-collect are core, not afterthoughts.

---

## 2. The backend variables — domain-specific complexity

This is where building-materials e-commerce differs from a normal "t-shirt" store.

### Tiles
- Sold in **boxes**; each box covers a fixed **area** (e.g. 1.44 m²/box) and contains a fixed **tile count**.
- Customer thinks in **room area**, not boxes → system converts area → boxes (rounding **up**) and adds **wastage %** (10% standard, 15–20% for diagonal/patterned).
- Attributes that drive filtering/search: material (porcelain/ceramic/natural stone/mosaic), finish (matte/gloss/textured), size (300×600 etc.), colour, thickness, application (wall/floor/outdoor/wet-area), slip rating, PEI/wear rating, rectified or not, batch/shade code.
- **Batch ("shade/lot") matters** — tiles from different batches vary in colour; ideally reserve one batch per order.

### Paint
- A single paint product is a **variant matrix**: **colour × finish/sheen × tin size × base/type**.
  - Colour: name + code (own range, RAL, Pantone, BS).
  - Finish: matte/emulsion, eggshell, satin, semi-gloss, gloss.
  - Size: e.g. 1L, 2.5L, 5L, 10L.
  - Type: interior/exterior, primer/undercoat/topcoat, wood/metal/masonry.
- Each variant is its own **SKU** with its own **price + stock**.
- **Coverage** (m² per litre, e.g. ~12 m²/L) feeds a **paint calculator** (wall area − doors/windows × number of coats → litres → tins).
- Some colours are **tinted/mixed to order** (made on demand, often non-returnable) vs **ready-stocked**.

### Cross-cutting backend entities (the data model)
| Entity | Key fields | Notes |
|---|---|---|
| **Product** | id, name, brand, category, description, base attributes, images[] | The marketing-level item |
| **Variant / SKU** | id, product_id, attributes (colour/finish/size), price, stock_qty, weight | The actual buyable, priced, stocked unit |
| **Unit-of-measure / packaging** | sell_unit (box/tin), coverage_per_unit, units_per_pack, base_uom (m²/L) | Drives calculators & conversions |
| **Category / taxonomy** | hierarchical (Tiles → Floor → Porcelain) | Powers nav + faceted filters |
| **Attribute / facet** | name, type, allowed values | Powers filtering (colour, size, finish, material…) |
| **Inventory** | stock per SKU per location, batch/lot, reorder level | Real-time; "only sell what's available" |
| **Pricing** | base price, per-m²/per-L display price, volume tiers, trade price | Multiple price *types* per SKU |
| **Cart / Cart line** | sku, qty (in sell units), computed area/coverage, line total | Cart stores boxes/tins, shows m²/L |
| **Customer / Account** | retail vs trade, addresses, trade pricing group | Account tier gates pricing |
| **Order / Order line** | snapshot of price, qty, batch, delivery method, status | Immutable financial record |
| **Delivery / Shipping** | method (courier/pallet/kerbside/collect), rate by weight+zone | Heavy-goods aware |
| **Sample request** | products[], free vs paid, address | Conversion driver, light-weight order |
| **Payment** | provider, txn id, status | Gateway integration |
| **Tax** | VAT/sales-tax rate per region | |
| **Content** | guides, sheen guide, how-to, banners | SEO + decision support |

---

## 3. Essential feature set (mapped to demo vs later)

### Must-have for a convincing **demo**
- Product catalog with categories + **faceted filters** (colour, size, material, finish, price).
- Product detail page: multi-image gallery, attributes, **price shown per-box & per-m² (tiles) / per-tin (paint)**, stock indicator.
- **Coverage calculator** on tile/paint pages (room dimensions → quantity + wastage).
- **Paint variant selector** (colour → finish → size, updating price/stock).
- **Cart** that stores boxes/tins but displays the m²/L equivalent and totals.
- **Checkout** with delivery method choice + a (test-mode) payment step.
- Responsive / mobile-first layout.
- **Free sample request** flow (great wow-factor, low effort).

### Phase 2 (toward go-live)
- Real payment gateway (live keys), accounts/login, order history.
- Trade/contractor accounts with bulk pricing.
- Real inventory + (optionally) ERP/accounting sync.
- Delivery rate engine by weight/zone, pallet/freight.
- Colour/room **visualiser** or AR preview.
- Admin dashboard (manage products, stock, orders), email notifications.
- SEO, analytics, search with autocomplete.

---

## 4. Key open decisions (need client/your input)
1. **Demo build approach** — hand-coded static/JS demo (fast, full control, no backend) vs a platform (Shopify/Woo/Wix) styled for Decork. Affects everything downstream.
2. **Catalog scope for demo** — how many real Decork products/photos do we have, or do we use placeholders?
3. **Payment in demo** — fake/simulated checkout vs Stripe test mode.
4. **Audience priority** — homeowners first, or contractors/trade (changes pricing & bulk emphasis).
5. **Currency / region / tax** — (₦/£/$?) and VAT handling.

---

## Sources
- https://www.toppstiles.co.uk/ (samples, visualiser, click & collect, delivery)
- https://apollotile.com/pages/tile-calculator , https://besttile.com/tile-calculator (coverage calculators, sq ft per case)
- https://www.elsner.com/features-for-a-successful-tile-ecommerce-site/ (tile ecommerce features)
- https://www.shopify.com/sell/tiles (selling tiles online)
- https://www.benjaminmoore.com/.../choosing-paint-finish , https://www.sherwin-williams.com/.../paint-sheen-guide (paint finish/sheen)
- https://help.shopify.com/en/manual/products/variants (variant matrix for paint)
- https://www.sana-commerce.com/industries/construction-materials/ , https://oroinc.com/b2b-ecommerce/construction-material-b2b-ecommerce/ (B2B: trade accounts, bulk pricing, ERP, freight)
- https://www.toolbx.com/guide/mastering-product-data-the-key-to-e-commerce-success-in-building-supply (product data / sell-by-unit)
- https://www.codesoltech.com/blog/e-commerce-product-catalog-architecture/ , https://fabric.inc/blog/commerce/ecommerce-data-model (catalog architecture, data model)
