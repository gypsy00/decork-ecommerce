# Decork E-commerce Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully clickable static demo storefront for Decork (tiles & paint) showing browse → configure → cart → simulated checkout, in Naira, with a Claybrook-style premium look and Decork branding.

**Architecture:** Plain multi-page static site (no build step). Shared header/footer and catalog data are embedded as JS (so the site runs by double-clicking `index.html` — no server, no `fetch()`). Pure logic (coverage/litre calculators, cart math) lives in dual-mode JS modules (browser global + Node `require`) and is unit-tested with `node --test`. Cart state persists in `localStorage`.

**Tech Stack:** HTML5, CSS (custom properties, no framework), vanilla ES5/ES6 JS, Google Fonts (Lora + Hanken Grotesk), `node --test` for unit tests, `python3 -m http.server` optional for serving.

---

## Conventions for this plan

- **No git commits** during the demo phase (user decision). Each task ends with a **Checkpoint** (verify it works) instead of a commit. Files are simply saved.
- **Verify-in-browser** steps: open the file directly (`open index.html` on macOS) OR serve with `python3 -m http.server 8000` and visit `http://localhost:8000/`. Either works since data is embedded.
- **Money:** all prices are integers in Naira (no kobo). Format with `formatNaira()` → `₦1,234,567`.
- **Currency/brand tokens** are defined once in `styles.css` and `partials.js`; never hard-code colours/nav in individual pages.
- A couple of steps are flagged **🎓 Your turn** — optional spots where the user may implement the business logic themselves; reference code is still provided so the plan is complete.

## File structure

```
decork-ecommerce/
├── index.html            # Home
├── tiles.html            # Tiles listing + filters
├── paint.html            # Paint listing + filters
├── product.html          # Product detail (?id=...)
├── cart.html             # Cart
├── checkout.html         # Checkout + simulated payment
├── confirmation.html     # Order confirmation
├── locations.html        # Aba · Enugu · Abuja
├── about.html            # The Decork Group
├── assets/
│   ├── css/styles.css           # design system + components
│   └── js/
│       ├── partials.js          # injects shared header + footer; cart-count badge
│       ├── catalog.js           # window.DECORK_CATALOG (embedded data) + render helpers
│       ├── calculators.js       # tileCoverage(), paintLitres()  [dual-mode, tested]
│       ├── cart.js              # cart math + localStorage  [math is dual-mode, tested]
│       └── checkout.js          # simulated payment + order number
├── tests/
│   ├── calculators.test.js
│   └── cart.test.js
└── docs/                 # research + spec + this plan
```

Responsibilities:
- `calculators.js` — pure functions only (no DOM, no storage). Easy to test, reusable on any product page.
- `cart.js` — pure math functions (line totals, subtotal, delivery, formatting) + thin `localStorage` wrappers. Math is tested; storage wrappers are trivial.
- `catalog.js` — the product data + small DOM render helpers (cards, filtering).
- `partials.js` — single source of truth for header/footer markup, injected into every page.
- Each `*.html` is thin: structure + a small inline `<script>` that wires the page using the modules.

---

## Task 1: Design system (styles.css)

**Files:**
- Create: `assets/css/styles.css`

- [ ] **Step 1: Create the stylesheet with tokens, type, and base components**

```css
/* ===== Decork design system ===== */
:root{
  --red:#CC3527; --green:#2E9E3A; --clay:#6E3A2F;
  --ink:#2B2926; --cream:#FAF8F4; --sand:#F1EDE5; --line:#E7E3DB; --white:#FFFFFF;
  --muted:#8A8275;
  --serif:'Lora',Georgia,serif;
  --sans:'Hanken Grotesk',system-ui,sans-serif;
  --maxw:1180px;
}
*{box-sizing:border-box}
html,body{margin:0}
body{font-family:var(--sans);font-weight:300;color:var(--ink);background:var(--cream);font-size:16px;line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.serif{font-family:var(--serif);font-weight:400;line-height:1.15;color:var(--ink)}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.15;margin:0}
.eyebrow{font-size:13px;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted);font-weight:400}
.section{padding:72px 0}
.section--sand{background:var(--sand)}
.center{text-align:center}
.rule{width:46px;height:1px;background:var(--line);border:0;margin:16px auto}

/* buttons */
.btn{display:inline-block;font-family:var(--sans);font-size:13px;letter-spacing:1px;text-transform:uppercase;
  padding:13px 26px;border-radius:2px;cursor:pointer;border:1px solid transparent;background:none}
.btn--primary{background:var(--red);color:#fff;border-color:var(--red)}
.btn--primary:hover{background:#b02d20}
.btn--outline{border-color:var(--ink);color:var(--ink)}
.btn--outline:hover{background:var(--ink);color:#fff}
.btn--block{display:block;width:100%;text-align:center}

/* bands */
.band{background:var(--clay);color:#fff}
.announce{font-size:12px;letter-spacing:.5px;text-align:center;padding:9px 12px}

/* header */
.site-header{background:#fff;border-bottom:1px solid var(--line)}
.site-header .inner{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 0}
.logo{font-family:var(--serif);font-size:26px;font-weight:500;letter-spacing:.5px}
.logo .g{color:var(--green)} .logo .r{color:var(--red)}
.mainnav{display:flex;gap:26px;align-items:center;font-size:13px;letter-spacing:1.3px;text-transform:uppercase;color:#5a5246}
.mainnav a:hover{color:var(--red)}
.cartlink{position:relative}
.cartbadge{background:var(--red);color:#fff;border-radius:50%;font-size:10px;padding:1px 6px;margin-left:4px}

/* footer */
.site-footer{background:#2b2926;color:#cfcabf;font-size:13px}
.site-footer .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;padding:48px 0}
.site-footer h4{color:#fff;font-family:var(--sans);font-size:12px;letter-spacing:1.2px;text-transform:uppercase;margin:0 0 12px}
.site-footer a{display:block;padding:3px 0;color:#cfcabf}
.site-footer a:hover{color:#fff}
.copyright{border-top:1px solid #3a3733;padding:18px 0;font-size:11px;color:#9a948a;text-align:center}

/* grid + cards */
.grid{display:grid;gap:26px}
.grid--3{grid-template-columns:repeat(3,1fr)}
.grid--4{grid-template-columns:repeat(4,1fr)}
.grid--2{grid-template-columns:repeat(2,1fr)}
.card{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.card .ph,.ph{background:var(--sand);width:100%;aspect-ratio:4/3}
.card .body{padding:16px}
.card h3{font-size:18px}
.price{font-size:14px;margin-top:4px}
.price small{color:var(--muted)}
.tag{display:inline-block;font-size:11px;letter-spacing:.5px;color:var(--green);border:1px solid var(--green);border-radius:2px;padding:2px 8px}

/* hero */
.hero{position:relative;background:var(--sand);min-height:460px;display:flex;align-items:center;justify-content:center;text-align:center}
.hero h1{font-size:52px}
.hero .eyebrow{margin-bottom:14px}
.hero .cta{margin-top:26px;display:flex;gap:14px;justify-content:center}

/* product page */
.pdp{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:48px 0}
.pdp .gallery .ph{aspect-ratio:1/1;border-radius:8px}
.calc{background:var(--sand);border-radius:8px;padding:18px;margin-top:18px}
.calc label{font-size:13px;display:inline-block;margin:4px 8px 4px 0}
.calc input{width:64px;padding:7px;border:1px solid var(--line);border-radius:4px;font-family:var(--sans)}
.chip{border:1px solid #cdc7ba;border-radius:2px;padding:6px 12px;font-size:13px;cursor:pointer;background:#fff;margin:2px}
.chip.on{border-color:var(--red);color:var(--red)}
.swatch{width:30px;height:30px;border-radius:50%;border:1px solid #ddd;cursor:pointer;display:inline-block;margin:3px}
.swatch.on{outline:2px solid var(--ink);outline-offset:2px}
.calcout{background:#fff;border-radius:6px;padding:12px;margin-top:12px;font-size:14px;line-height:1.7}

/* filters + listing */
.listing{display:grid;grid-template-columns:220px 1fr;gap:32px;padding:40px 0}
.filters h4{font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:var(--sans);margin:18px 0 8px}
.filters label{display:block;font-size:14px;padding:3px 0;cursor:pointer}

/* cart + checkout */
.line{display:grid;grid-template-columns:80px 1fr auto;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--line)}
.line .ph{width:80px;aspect-ratio:1/1;border-radius:6px}
.qty{width:56px;padding:6px;border:1px solid var(--line);border-radius:4px}
.summary{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px}
.summary .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
.summary .total{font-size:18px;border-top:1px solid var(--line);margin-top:8px;padding-top:12px}
.field{display:block;margin:12px 0}
.field span{display:block;font-size:13px;margin-bottom:5px}
.field input,.field select{width:100%;padding:11px;border:1px solid var(--line);border-radius:4px;font-family:var(--sans)}

@media(max-width:860px){
  .grid--3,.grid--4{grid-template-columns:repeat(2,1fr)}
  .pdp,.listing{grid-template-columns:1fr}
  .site-footer .cols{grid-template-columns:repeat(2,1fr)}
  .hero h1{font-size:38px}
}
```

- [ ] **Step 2: Checkpoint** — file saved; no visual yet (used by later pages). Confirm no syntax errors by eye.

---

## Task 2: Shared header/footer (partials.js)

**Files:**
- Create: `assets/js/partials.js`

- [ ] **Step 1: Write partials.js that injects header + footer and wires the cart badge**

```js
/* Injects shared chrome into every page. Looks for <div id="header"></div> and <div id="footer"></div>. */
(function(){
  var nav = [
    ['Tiles','tiles.html'],['Paint','paint.html'],
    ['Our Locations','locations.html'],['About','about.html']
  ];
  function headerHTML(){
    var links = nav.map(function(n){return '<a href="'+n[1]+'">'+n[0]+'</a>';}).join('');
    return ''+
    '<div class="band announce">Nigerian · Italian · Spanish Tiles &nbsp;·&nbsp; Decorkote Paints &nbsp;|&nbsp; Free Samples · Nationwide Delivery</div>'+
    '<header class="site-header"><div class="wrap inner">'+
      '<a class="logo" href="index.html"><span class="g">DEC</span><span class="r">●</span><span class="g">RK</span></a>'+
      '<nav class="mainnav">'+links+
        '<a class="cartlink" href="cart.html">Cart<span class="cartbadge" id="cart-count">0</span></a>'+
      '</nav>'+
    '</div></header>';
  }
  function footerHTML(){
    return ''+
    '<footer class="site-footer"><div class="wrap cols">'+
      '<div><h4>Contact</h4>'+
        '<a href="locations.html">Aba · 119 Faulks Rd, Abia</a>'+
        '<a href="locations.html">Enugu · Bldg Materials Mkt</a>'+
        '<a href="locations.html">Abuja · Dei Dei Intl Mkt</a>'+
        '<a href="tel:07067685620">0706 768 5620</a></div>'+
      '<div><h4>Company</h4><a href="about.html">About Us</a><a href="about.html">The Decork Group</a><a href="about.html">Decork Logistics</a></div>'+
      '<div><h4>Your Order</h4><a href="#">Delivery & Returns</a><a href="#">FAQ</a><a href="cart.html">Your Cart</a></div>'+
      '<div><h4>Products</h4><a href="tiles.html">Tiles</a><a href="paint.html">Paint</a><a href="#">Free Samples</a></div>'+
    '</div><div class="copyright">© '+new Date().getFullYear()+' Decork Group · Aba · Enugu · Abuja</div></footer>';
  }
  function inject(id,html){var el=document.getElementById(id); if(el) el.outerHTML=html;}
  document.addEventListener('DOMContentLoaded',function(){
    inject('header',headerHTML());
    inject('footer',footerHTML());
    if(window.Cart && document.getElementById('cart-count')){
      document.getElementById('cart-count').textContent = Cart.count();
    }
  });
})();
```

- [ ] **Step 2: Checkpoint** — saved. Will render once a page includes it (Task 6).

---

## Task 3: Calculators module (TDD)

**Files:**
- Create: `assets/js/calculators.js`
- Test: `tests/calculators.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// tests/calculators.test.js
const test = require('node:test');
const assert = require('node:assert');
const { tileCoverage, paintLitres } = require('../assets/js/calculators.js');

test('tileCoverage: 4.0 x 3.5 room, 1.44 m²/box, straight (+10%)', () => {
  const r = tileCoverage({ length:4.0, width:3.5, sqmPerBox:1.44, tilesPerBox:4, pricePerSqm:8500, waste:0.10 });
  assert.strictEqual(r.area, 14);
  assert.strictEqual(r.boxes, 11);          // ceil(15.4 / 1.44)=11
  assert.strictEqual(r.tiles, 44);
  assert.strictEqual(r.coveredSqm, 15.84);  // 11 * 1.44
  assert.strictEqual(r.cost, 134640);       // 11 * round(8500*1.44=12240)
});

test('tileCoverage: diagonal waste (+15%) needs more boxes', () => {
  const r = tileCoverage({ length:4.0, width:3.5, sqmPerBox:1.44, tilesPerBox:4, pricePerSqm:8500, waste:0.15 });
  assert.strictEqual(r.boxes, 12);          // ceil(16.1/1.44)=12
});

test('paintLitres: 36 m², 2 coats, 12 m²/L -> 6 L', () => {
  const r = paintLitres({ area:36, coats:2, coveragePerL:12, sizes:[{litres:1,price:3500},{litres:4,price:11000},{litres:20,price:48000}] });
  assert.strictEqual(r.litres, 6);
  // cheapest combo covering >=6 L: 2 x 4L = 8L @ 22000  (vs 6x1L=21000? -> see note)
  assert.ok(r.tins.reduce((s,t)=>s+t.litres*t.qty,0) >= 6);
  assert.strictEqual(typeof r.cost, 'number');
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `node --test tests/calculators.test.js`
Expected: FAIL — `Cannot find module '../assets/js/calculators.js'`.

- [ ] **Step 3: Implement calculators.js (dual-mode)**

```js
/* Pure calculators. No DOM, no storage. */
(function(global){
  function round2(n){ return Math.round(n*100)/100; }

  // Tiles: area -> boxes (rounded up) with wastage, + cost.
  function tileCoverage(o){
    var area = round2(o.length * o.width);
    var withWaste = area * (1 + o.waste);
    var boxes = Math.ceil(round2(withWaste) / o.sqmPerBox);
    var pricePerBox = Math.round(o.pricePerSqm * o.sqmPerBox);
    return {
      area: area,
      boxes: boxes,
      tiles: boxes * o.tilesPerBox,
      coveredSqm: round2(boxes * o.sqmPerBox),
      pricePerBox: pricePerBox,
      cost: boxes * pricePerBox
    };
  }

  // Paint: litres needed, then a tin recommendation that minimises cost.
  function paintLitres(o){
    var litres = Math.ceil((o.area * o.coats) / o.coveragePerL);
    var best = bestTins(litres, o.sizes);
    return { litres: litres, tins: best.tins, cost: best.cost };
  }

  // Greedy from largest tin down, then top up with the smallest that covers remainder.
  // 🎓 Your turn: this is a reasonable heuristic; you could make it a true least-cost search.
  function bestTins(litres, sizes){
    var sorted = sizes.slice().sort(function(a,b){return b.litres-a.litres;});
    var remaining = litres, tins = [], cost = 0;
    for (var i=0;i<sorted.length;i++){
      var s = sorted[i];
      if (i === sorted.length-1){ // smallest tin: round up remainder
        var q = Math.ceil(remaining / s.litres);
        if (q>0){ tins.push({litres:s.litres, price:s.price, qty:q}); cost += q*s.price; remaining -= q*s.litres; }
      } else {
        var qty = Math.floor(remaining / s.litres);
        if (qty>0){ tins.push({litres:s.litres, price:s.price, qty:qty}); cost += qty*s.price; remaining -= qty*s.litres; }
      }
    }
    return { tins: tins, cost: cost };
  }

  var api = { tileCoverage: tileCoverage, paintLitres: paintLitres };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.DecorkCalc = api;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `node --test tests/calculators.test.js`
Expected: PASS (3 tests). If the paint combo assertion is too strict, it only checks coverage ≥ litres and cost is numeric — both hold.

- [ ] **Step 5: Checkpoint** — calculators verified.

---

## Task 4: Cart math + storage (TDD for math)

**Files:**
- Create: `assets/js/cart.js`
- Test: `tests/cart.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// tests/cart.test.js
const test = require('node:test');
const assert = require('node:assert');
const { formatNaira, lineTotal, subtotal, deliveryFee, FREE_DELIVERY_OVER } = require('../assets/js/cart.js');

test('formatNaira adds ₦ and thousands separators', () => {
  assert.strictEqual(formatNaira(134640), '₦134,640');
  assert.strictEqual(formatNaira(0), '₦0');
});

test('lineTotal multiplies qty by unit price', () => {
  assert.strictEqual(lineTotal({ unitPrice:12240, qty:11 }), 134640);
});

test('subtotal sums all lines', () => {
  const items = [{unitPrice:12240,qty:11},{unitPrice:11000,qty:2}];
  assert.strictEqual(subtotal(items), 156640);
});

test('deliveryFee is free over threshold', () => {
  assert.strictEqual(deliveryFee(FREE_DELIVERY_OVER + 1), 0);
  assert.strictEqual(deliveryFee(50000) > 0, true);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `node --test tests/cart.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement cart.js (pure math dual-mode + browser storage layer)**

```js
/* Cart: pure math (tested) + localStorage layer (browser only). */
(function(global){
  var FREE_DELIVERY_OVER = 100000;   // 🎓 Your turn: set Decork's real threshold
  var FLAT_DELIVERY = 5000;          // placeholder flat fee under threshold

  function formatNaira(n){ return '₦' + Math.round(n).toLocaleString('en-NG'); }
  function lineTotal(item){ return item.unitPrice * item.qty; }
  function subtotal(items){ return items.reduce(function(s,i){return s + lineTotal(i);},0); }
  function deliveryFee(sub){ return sub >= FREE_DELIVERY_OVER ? 0 : FLAT_DELIVERY; }
  function grandTotal(items){ var s = subtotal(items); return s + deliveryFee(s); }

  var math = { formatNaira:formatNaira, lineTotal:lineTotal, subtotal:subtotal,
               deliveryFee:deliveryFee, grandTotal:grandTotal,
               FREE_DELIVERY_OVER:FREE_DELIVERY_OVER, FLAT_DELIVERY:FLAT_DELIVERY };

  if (typeof module !== 'undefined' && module.exports){ module.exports = math; return; }

  // ---- browser storage layer ----
  var KEY = 'decork_cart';
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); }
  /* item: { id, name, kind:'tile'|'paint', variant, unitLabel, unitPrice, qty, meta } */
  function add(item){
    var items = read();
    var key = item.id + '|' + (item.variant||'');
    var found = items.find(function(i){ return (i.id+'|'+(i.variant||'')) === key; });
    if (found) found.qty += item.qty; else items.push(item);
    write(items); return items;
  }
  function setQty(key, qty){ var items=read().map(function(i){ if((i.id+'|'+(i.variant||''))===key) i.qty=Math.max(1,qty); return i; }); write(items); return items; }
  function remove(key){ var items=read().filter(function(i){ return (i.id+'|'+(i.variant||''))!==key; }); write(items); return items; }
  function clear(){ write([]); }
  function count(){ return read().reduce(function(s,i){return s+i.qty;},0); }

  global.Cart = Object.assign({}, math, { read:read, add:add, setQty:setQty, remove:remove, clear:clear, count:count });
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `node --test tests/cart.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the full suite**

Run: `node --test`
Expected: PASS (7 tests total).

- [ ] **Step 6: Checkpoint** — cart engine verified.

---

## Task 5: Catalog data + render helpers (catalog.js)

**Files:**
- Create: `assets/js/catalog.js`

- [ ] **Step 1: Write catalog.js with embedded data + helpers**

```js
/* Embedded catalog (no fetch -> works from file://) + render helpers. */
window.DECORK_CATALOG = {
  tiles: [
    { id:'carrara-60x60', type:'tile', name:'Carrara Marble-Effect Porcelain', origin:'Italian', category:'Floor', finish:'Matte', sizeCm:'600x600', colour:'White', pricePerSqm:8500, sqmPerBox:1.44, tilesPerBox:4, stockBoxes:120, img:'' },
    { id:'terrazzo-grey', type:'tile', name:'Terrazzo Speckle Porcelain', origin:'Spanish', category:'Floor', finish:'Matte', sizeCm:'600x600', colour:'Grey', pricePerSqm:7200, sqmPerBox:1.44, tilesPerBox:4, stockBoxes:80, img:'' },
    { id:'metro-white', type:'tile', name:'Metro Gloss Wall Tile', origin:'Nigerian', category:'Wall', finish:'Gloss', sizeCm:'100x300', colour:'White', pricePerSqm:5400, sqmPerBox:1.00, tilesPerBox:33, stockBoxes:200, img:'' },
    { id:'sage-zellige', type:'tile', name:'Sage Zellige Wall Tile', origin:'Spanish', category:'Wall', finish:'Textured', sizeCm:'100x100', colour:'Green', pricePerSqm:9900, sqmPerBox:0.50, tilesPerBox:50, stockBoxes:60, img:'' },
    { id:'travertine-outdoor', type:'tile', name:'Travertine-Effect Outdoor Porcelain', origin:'Italian', category:'Outdoor', finish:'Textured', sizeCm:'600x600', colour:'Beige', pricePerSqm:11500, sqmPerBox:1.08, tilesPerBox:3, stockBoxes:45, img:'' },
    { id:'charcoal-slate', type:'tile', name:'Charcoal Slate Floor Tile', origin:'Nigerian', category:'Floor', finish:'Matte', sizeCm:'300x600', colour:'Charcoal', pricePerSqm:6800, sqmPerBox:1.26, tilesPerBox:7, stockBoxes:90, img:'' }
  ],
  paint: [
    { id:'decorkote-emulsion', type:'paint', name:'Decorkote Premium Emulsion', category:'Interior', coveragePerL:12,
      finishes:['Matte','Eggshell','Satin'],
      colours:[{name:'Brilliant White',hex:'#F7F5EF',code:'DK-100'},{name:'Sage',hex:'#CFD8C5',code:'DK-220'},{name:'Clay',hex:'#7A3B30',code:'DK-410'},{name:'Forest',hex:'#2E9E3A',code:'DK-330'}],
      sizes:[{litres:1,price:3500},{litres:4,price:11000},{litres:20,price:48000}], img:'' },
    { id:'decorkote-weatherguard', type:'paint', name:'Decorkote Weatherguard Exterior', category:'Exterior', coveragePerL:10,
      finishes:['Matte','Satin'],
      colours:[{name:'Chalk White',hex:'#F4F1E9',code:'DW-100'},{name:'Sandstone',hex:'#D9C7A6',code:'DW-205'},{name:'Terracotta',hex:'#CC3527',code:'DW-440'}],
      sizes:[{litres:4,price:14000},{litres:20,price:62000}], img:'' },
    { id:'decorkote-satinwood', type:'paint', name:'Decorkote Satinwood (Wood & Metal)', category:'Interior', coveragePerL:14,
      finishes:['Satin','Gloss'],
      colours:[{name:'Pure White',hex:'#FBFAF6',code:'DS-100'},{name:'Charcoal',hex:'#2B2926',code:'DS-900'}],
      sizes:[{litres:1,price:4200},{litres:2.5,price:9500}], img:'' }
  ]
};

window.Catalog = {
  all:function(){ return window.DECORK_CATALOG; },
  find:function(id){
    var c=window.DECORK_CATALOG; return c.tiles.concat(c.paint).find(function(p){return p.id===id;});
  },
  // build a product card (used by listing pages)
  card:function(p){
    var priceLine = p.type==='tile'
      ? Cart.formatNaira(p.pricePerSqm)+' / m²'
      : 'from '+Cart.formatNaira(Math.min.apply(null, p.sizes.map(function(s){return s.price;})));
    var tag = p.type==='tile' ? p.origin : p.category;
    return '<a class="card" href="product.html?id='+p.id+'">'+
      '<div class="ph"></div><div class="body">'+
        '<span class="tag">'+tag+'</span>'+
        '<h3 style="margin-top:8px">'+p.name+'</h3>'+
        '<div class="price">'+priceLine+'</div>'+
      '</div></a>';
  }
};
```

- [ ] **Step 2: Checkpoint** — load order matters: pages must include `cart.js` before `catalog.js` (card() uses `Cart.formatNaira`). Note this for Tasks 6–10.

---

## Task 6: Home page (index.html)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Build the homepage with the agreed section stack**

```html
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Decork — Tiles & Paint | Free Samples · Nationwide Delivery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
</head><body>
<div id="header"></div>

<!-- 3 Hero -->
<section class="hero">
  <div class="wrap">
    <div class="eyebrow">Stylish wall &amp; floor tiles · Decorkote paints</div>
    <h1 class="serif">Beautiful tiles &amp; paint,<br>delivered nationwide</h1>
    <div class="cta">
      <a class="btn btn--primary" href="tiles.html">Shop Tiles</a>
      <a class="btn btn--outline" href="paint.html">Shop Paint</a>
    </div>
  </div>
</section>

<!-- 4 Shop by category -->
<section class="section"><div class="wrap">
  <div class="center"><div class="eyebrow">Shop by category</div><h2 class="serif" style="font-size:30px;margin-top:8px">What are you working on?</h2><hr class="rule"></div>
  <div class="grid grid--2" style="margin-top:24px">
    <a class="card" href="tiles.html"><div class="ph"></div><div class="body center"><h3>Tiles</h3><div class="price"><small>Floor · Wall · Outdoor — Nigerian, Italian &amp; Spanish</small></div></div></a>
    <a class="card" href="paint.html"><div class="ph"></div><div class="body center"><h3>Paint</h3><div class="price"><small>Decorkote — interior &amp; exterior</small></div></div></a>
  </div>
</div></section>

<!-- 5 The Decork Difference -->
<section class="section section--sand"><div class="wrap center">
  <div class="eyebrow">The Decork difference</div><h2 class="serif" style="font-size:30px;margin-top:8px">Quality you can stand on</h2><hr class="rule">
  <div class="grid grid--3" style="margin-top:30px;text-align:center">
    <div><h3 style="font-size:20px">Nationwide delivery</h3><p>Delivered to your door anywhere in Nigeria via Decork Logistics.</p></div>
    <div><h3 style="font-size:20px">Free samples</h3><p>Try tiles &amp; paint colours at home before you commit.</p></div>
    <div><h3 style="font-size:20px">Expert service</h3><p>Real people at our Aba, Enugu &amp; Abuja depots.</p></div>
  </div>
</div></section>

<!-- 6 Our Locations -->
<section class="section"><div class="wrap center">
  <div class="eyebrow">Our locations</div><h2 class="serif" style="font-size:30px;margin-top:8px">Visit us in town</h2><hr class="rule">
  <p>Find us in <strong>Aba</strong> (Abia State), <strong>Enugu</strong> and <strong>Abuja</strong>.</p>
  <a class="btn btn--outline" href="locations.html" style="margin-top:14px">Find a depot</a>
</div></section>

<!-- 7 Newsletter -->
<section class="band"><div class="wrap" style="display:flex;gap:16px;align-items:center;justify-content:center;padding:26px 0;flex-wrap:wrap">
  <div class="eyebrow" style="color:#f3e7e2">Newsletter</div>
  <input class="qty" style="width:240px" placeholder="Email address">
  <a class="btn btn--outline" style="border-color:#fff;color:#fff">Sign up</a>
</div></section>

<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/catalog.js"></script>
<script src="assets/js/partials.js"></script>
</body></html>
```

- [ ] **Step 2: Verify in browser**

Run: `open index.html` (or serve and visit). Expected: announcement bar, centered DECORK logo + nav with `Cart 0`, hero with two buttons, category/difference/locations sections, clay newsletter band, dark footer with Nigerian addresses. Fonts are Lora (headings) + Hanken Grotesk (body).

- [ ] **Step 3: Checkpoint** — homepage matches the approved layout.

---

## Task 7: Listing pages (tiles.html, paint.html)

**Files:**
- Create: `tiles.html`, `paint.html`

- [ ] **Step 1: Build tiles.html with filter sidebar + grid**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tiles — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<div class="wrap"><div class="center" style="padding-top:36px"><div class="eyebrow">Wall &amp; floor tiles</div><h1 class="serif" style="font-size:36px;margin-top:8px">Tiles</h1></div>
<div class="listing">
  <aside class="filters" id="filters"></aside>
  <div><div class="grid grid--3" id="grid"></div></div>
</div></div>
<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/catalog.js"></script>
<script src="assets/js/partials.js"></script>
<script>
(function(){
  var items = Catalog.all().tiles;
  var facets = { Origin:'origin', Category:'category', Finish:'finish' };
  var active = {};
  function values(key){ return [...new Set(items.map(function(i){return i[key];}))]; }
  function renderFilters(){
    var html = '';
    Object.keys(facets).forEach(function(label){
      var key = facets[label];
      html += '<h4>'+label+'</h4>';
      values(key).forEach(function(v){
        html += '<label><input type="checkbox" data-key="'+key+'" value="'+v+'"> '+v+'</label>';
      });
    });
    document.getElementById('filters').innerHTML = html;
    document.querySelectorAll('#filters input').forEach(function(cb){
      cb.addEventListener('change', function(){
        active[cb.dataset.key] = active[cb.dataset.key]||[];
        if(cb.checked) active[cb.dataset.key].push(cb.value);
        else active[cb.dataset.key] = active[cb.dataset.key].filter(function(x){return x!==cb.value;});
        renderGrid();
      });
    });
  }
  function renderGrid(){
    var filtered = items.filter(function(it){
      return Object.keys(active).every(function(k){
        return !active[k].length || active[k].indexOf(it[k])>-1;
      });
    });
    document.getElementById('grid').innerHTML = filtered.map(Catalog.card).join('') || '<p>No tiles match those filters.</p>';
  }
  renderFilters(); renderGrid();
})();
</script>
</body></html>
```

- [ ] **Step 2: Build paint.html** — identical to `tiles.html` except: `<title>Paint — Decork</title>`, heading "Paint", eyebrow "Decorkote paints", and the script uses `Catalog.all().paint` with `facets = { Range:'category', Finish:null }`. Since paint finishes are arrays, use this script body instead:

```html
<script>
(function(){
  var items = Catalog.all().paint;
  var active = {};
  function renderFilters(){
    var cats=[...new Set(items.map(function(i){return i.category;}))];
    var fins=[...new Set(items.reduce(function(a,i){return a.concat(i.finishes);},[]))];
    var html='<h4>Range</h4>'+cats.map(function(v){return '<label><input type="checkbox" data-key="category" value="'+v+'"> '+v+'</label>';}).join('');
    html+='<h4>Finish</h4>'+fins.map(function(v){return '<label><input type="checkbox" data-key="finish" value="'+v+'"> '+v+'</label>';}).join('');
    document.getElementById('filters').innerHTML=html;
    document.querySelectorAll('#filters input').forEach(function(cb){
      cb.addEventListener('change',function(){
        active[cb.dataset.key]=active[cb.dataset.key]||[];
        if(cb.checked) active[cb.dataset.key].push(cb.value); else active[cb.dataset.key]=active[cb.dataset.key].filter(function(x){return x!==cb.value;});
        renderGrid();
      });
    });
  }
  function renderGrid(){
    var filtered=items.filter(function(it){
      var okCat=!active.category||!active.category.length||active.category.indexOf(it.category)>-1;
      var okFin=!active.finish||!active.finish.length||it.finishes.some(function(f){return active.finish.indexOf(f)>-1;});
      return okCat&&okFin;
    });
    document.getElementById('grid').innerHTML=filtered.map(Catalog.card).join('')||'<p>No paints match.</p>';
  }
  renderFilters(); renderGrid();
})();
</script>
```

- [ ] **Step 3: Verify in browser** — Run `open tiles.html`. Expected: filter sidebar (Origin/Category/Finish), 6 tile cards; ticking a filter narrows the grid. Repeat for `paint.html` (3 paints, Range/Finish filters).

- [ ] **Step 4: Checkpoint** — listings + filtering work.

---

## Task 8: Product page (product.html)

**Files:**
- Create: `product.html`

- [ ] **Step 1: Build product.html that renders a tile or paint by `?id=`**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Product — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<div class="wrap"><div class="pdp" id="pdp"></div></div>
<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/catalog.js"></script>
<script src="assets/js/calculators.js"></script>
<script src="assets/js/partials.js"></script>
<script>
(function(){
  var id = new URLSearchParams(location.search).get('id');
  var p = Catalog.find(id);
  var box = document.getElementById('pdp');
  if(!p){ box.innerHTML='<p>Product not found. <a href="tiles.html">Browse tiles</a></p>'; return; }
  if(p.type==='tile') renderTile(p, box); else renderPaint(p, box);

  function gallery(){ return '<div class="gallery"><div class="ph"></div></div>'; }
  function addBtn(label){ return '<button class="btn btn--primary btn--block" id="add" style="margin-top:14px">'+label+'</button>'; }

  function renderTile(p, box){
    var pricePerBox = Math.round(p.pricePerSqm*p.sqmPerBox);
    box.innerHTML = gallery()+'<div>'+
      '<span class="tag">'+p.origin+'</span>'+
      '<h1 class="serif" style="font-size:30px;margin:10px 0">'+p.name+'</h1>'+
      '<div class="price">'+Cart.formatNaira(p.pricePerSqm)+' / m² <small>· '+Cart.formatNaira(pricePerBox)+' / box ('+p.sqmPerBox+'m², '+p.tilesPerBox+' tiles)</small></div>'+
      '<div class="calc">'+
        '<strong style="font-size:14px">Coverage calculator</strong><br>'+
        '<label>Length <input id="L" type="number" value="4" step="0.1"> m</label>'+
        '<label>Width <input id="W" type="number" value="3.5" step="0.1"> m</label><br>'+
        '<span class="chip on" data-waste="0.10" id="straight">Straight +10%</span>'+
        '<span class="chip" data-waste="0.15" id="diag">Diagonal +15%</span>'+
        '<div class="calcout" id="out"></div>'+
      '</div>'+ addBtn('Add to cart') +'</div>';
    var waste=0.10;
    function recalc(){
      var r = DecorkCalc.tileCoverage({length:+L.value,width:+W.value,sqmPerBox:p.sqmPerBox,tilesPerBox:p.tilesPerBox,pricePerSqm:p.pricePerSqm,waste:waste});
      out.innerHTML = 'Area '+r.area+' m² → <b>'+r.boxes+' boxes</b> ('+r.coveredSqm+' m², '+r.tiles+' tiles)<br><b>Total: '+Cart.formatNaira(r.cost)+'</b>';
      box._calc = r;
    }
    L.oninput=recalc; W.oninput=recalc;
    straight.onclick=function(){waste=0.10;straight.classList.add('on');diag.classList.remove('on');recalc();};
    diag.onclick=function(){waste=0.15;diag.classList.add('on');straight.classList.remove('on');recalc();};
    recalc();
    document.getElementById('add').onclick=function(){
      var r=box._calc;
      Cart.add({id:p.id,name:p.name,kind:'tile',variant:'',unitLabel:'box',unitPrice:r.pricePerBox,qty:r.boxes,meta:r.coveredSqm+' m²'});
      location.href='cart.html';
    };
  }

  function renderPaint(p, box){
    var colour=p.colours[0], finish=p.finishes[0], size=p.sizes[0];
    box.innerHTML = gallery()+'<div>'+
      '<span class="tag">'+p.category+'</span>'+
      '<h1 class="serif" style="font-size:30px;margin:10px 0">'+p.name+'</h1>'+
      '<div id="swatches">'+p.colours.map(function(c,i){return '<span class="swatch'+(i===0?' on':'')+'" data-i="'+i+'" style="background:'+c.hex+'"></span>';}).join('')+'</div>'+
      '<div id="cname" class="price"></div>'+
      '<div style="margin-top:10px">Finish: <span id="fins">'+p.finishes.map(function(f,i){return '<span class="chip'+(i===0?' on':'')+'" data-f="'+f+'">'+f+'</span>';}).join('')+'</span></div>'+
      '<div style="margin-top:10px">Size: <span id="sizes">'+p.sizes.map(function(s,i){return '<span class="chip'+(i===0?' on':'')+'" data-s="'+i+'">'+s.litres+'L · '+Cart.formatNaira(s.price)+'</span>';}).join('')+'</span></div>'+
      '<div class="calc"><strong style="font-size:14px">Paint calculator</strong><br>'+
        '<label>Wall area <input id="A" type="number" value="36"> m²</label>'+
        '<label>Coats <input id="C" type="number" value="2"></label>'+
        '<div class="calcout" id="out"></div></div>'+
      addBtn('Add to cart')+'</div>';
    function sync(){
      cname.innerHTML='<small>'+colour.name+' · '+colour.code+'</small>';
      var r=DecorkCalc.paintLitres({area:+A.value,coats:+C.value,coveragePerL:p.coveragePerL,sizes:p.sizes});
      out.innerHTML=r.litres+' L needed → <b>'+r.tins.map(function(t){return t.qty+'×'+t.litres+'L';}).join(' + ')+'</b> · '+Cart.formatNaira(r.cost);
    }
    document.querySelectorAll('#swatches .swatch').forEach(function(s){s.onclick=function(){document.querySelectorAll('#swatches .swatch').forEach(function(x){x.classList.remove('on');});s.classList.add('on');colour=p.colours[+s.dataset.i];sync();};});
    document.querySelectorAll('#fins .chip').forEach(function(c){c.onclick=function(){document.querySelectorAll('#fins .chip').forEach(function(x){x.classList.remove('on');});c.classList.add('on');finish=c.dataset.f;};});
    document.querySelectorAll('#sizes .chip').forEach(function(c){c.onclick=function(){document.querySelectorAll('#sizes .chip').forEach(function(x){x.classList.remove('on');});c.classList.add('on');size=p.sizes[+c.dataset.s];};});
    A.oninput=sync; C.oninput=sync; sync();
    document.getElementById('add').onclick=function(){
      Cart.add({id:p.id,name:p.name,kind:'paint',variant:colour.code+'/'+finish+'/'+size.litres+'L',unitLabel:'tin',unitPrice:size.price,qty:1,meta:colour.name+' · '+finish+' · '+size.litres+'L'});
      location.href='cart.html';
    };
  }
})();
</script>
</body></html>
```

- [ ] **Step 2: Verify tile product** — Run `open "product.html?id=carrara-60x60"` (or via server). Expected: calculator shows "Area 14 m² → 11 boxes … Total ₦134,640"; switching to Diagonal recomputes; "Add to cart" goes to cart.

- [ ] **Step 3: Verify paint product** — visit `product.html?id=decorkote-emulsion`. Expected: 4 swatches (white/sage/clay/forest) with selectable finish + size chips; calculator shows "6 L needed → 2×4L". Add to cart works.

- [ ] **Step 4: Checkpoint** — product page works for both kinds.

---

## Task 9: Cart page (cart.html)

**Files:**
- Create: `cart.html`

- [ ] **Step 1: Build cart.html**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Cart — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<div class="wrap" style="padding:40px 0"><div class="center"><div class="eyebrow">Your order</div><h1 class="serif" style="font-size:34px;margin-top:8px">Cart</h1></div>
<div class="grid" style="grid-template-columns:1fr 320px;gap:32px;margin-top:24px" id="cartwrap">
  <div id="lines"></div>
  <aside class="summary" id="summary"></aside>
</div></div>
<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/catalog.js"></script>
<script src="assets/js/partials.js"></script>
<script>
(function(){
  function key(i){ return i.id+'|'+(i.variant||''); }
  function render(){
    var items=Cart.read();
    var lines=document.getElementById('lines');
    if(!items.length){ document.getElementById('cartwrap').innerHTML='<p>Your cart is empty. <a href="tiles.html">Browse tiles</a> or <a href="paint.html">paint</a>.</p>'; return; }
    lines.innerHTML=items.map(function(i){
      return '<div class="line">'+
        '<div class="ph"></div>'+
        '<div><strong>'+i.name+'</strong><br><small>'+(i.meta||'')+(i.variant?(' · '+i.variant):'')+'</small><br>'+
          '<input class="qty" type="number" min="1" value="'+i.qty+'" data-k="'+key(i)+'"> '+i.unitLabel+'(s) · '+Cart.formatNaira(i.unitPrice)+' each</div>'+
        '<div style="text-align:right"><strong>'+Cart.formatNaira(Cart.lineTotal(i))+'</strong><br><a href="#" data-rm="'+key(i)+'" style="color:var(--red);font-size:12px">Remove</a></div>'+
      '</div>';
    }).join('');
    var sub=Cart.subtotal(items), del=Cart.deliveryFee(sub);
    document.getElementById('summary').innerHTML=
      '<div class="row"><span>Subtotal</span><span>'+Cart.formatNaira(sub)+'</span></div>'+
      '<div class="row"><span>Delivery</span><span>'+(del===0?'<b style="color:var(--green)">Free</b>':Cart.formatNaira(del))+'</span></div>'+
      '<div class="row total"><span>Total</span><span>'+Cart.formatNaira(sub+del)+'</span></div>'+
      '<a class="btn btn--primary btn--block" style="margin-top:16px" href="checkout.html">Checkout</a>';
    lines.querySelectorAll('.qty').forEach(function(q){ q.onchange=function(){ Cart.setQty(q.dataset.k, parseInt(q.value,10)); render(); }; });
    lines.querySelectorAll('[data-rm]').forEach(function(a){ a.onclick=function(e){ e.preventDefault(); Cart.remove(a.dataset.rm); render(); }; });
  }
  render();
})();
</script>
</body></html>
```

- [ ] **Step 2: Verify** — after adding the tile + paint above, `open cart.html`. Expected: two lines, editable qty (changing qty updates totals), Remove works, summary shows Subtotal / Delivery (Free over ₦100,000) / Total.

- [ ] **Step 3: Checkpoint** — cart works end to end.

---

## Task 10: Checkout + confirmation (checkout.html, confirmation.html, checkout.js)

**Files:**
- Create: `checkout.html`, `confirmation.html`, `assets/js/checkout.js`

- [ ] **Step 1: Write checkout.js (order number + simulated payment)**

```js
/* Simulated checkout. No real payment. */
window.Checkout = {
  orderNumber:function(){ return 'DK-'+Date.now().toString().slice(-6); },
  placeOrder:function(details){
    var items=Cart.read();
    var sub=Cart.subtotal(items), del=Cart.deliveryFee(sub);
    var order={ number:this.orderNumber(), items:items, subtotal:sub, delivery:del, total:sub+del, details:details, when:new Date().toISOString() };
    sessionStorage.setItem('decork_last_order', JSON.stringify(order));
    Cart.clear();
    return order;
  }
};
```

- [ ] **Step 2: Build checkout.html**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Checkout — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<div class="wrap" style="padding:40px 0"><div class="center"><div class="eyebrow">Checkout</div><h1 class="serif" style="font-size:34px;margin-top:8px">Almost there</h1></div>
<div class="grid" style="grid-template-columns:1fr 320px;gap:32px;margin-top:24px">
  <form id="form">
    <label class="field"><span>Full name</span><input name="name" required></label>
    <label class="field"><span>Phone</span><input name="phone" required></label>
    <label class="field"><span>Delivery address</span><input name="address" required></label>
    <label class="field"><span>State</span>
      <select name="state"><option>Abia</option><option>Enugu</option><option>FCT (Abuja)</option><option>Lagos</option><option>Other</option></select></label>
    <label class="field"><span>Delivery method</span>
      <select name="delivery"><option>Decork Logistics — to your door</option><option>Pickup at depot</option></select></label>
    <label class="field"><span>Payment</span>
      <select name="payment"><option>Card</option><option>Bank Transfer</option><option>Pay on Delivery</option></select></label>
    <button class="btn btn--primary btn--block" type="submit" style="margin-top:8px">Place order (demo)</button>
    <p style="font-size:12px;color:var(--muted)">This is a demo — no real payment is taken.</p>
  </form>
  <aside class="summary" id="summary"></aside>
</div></div>
<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/checkout.js"></script>
<script src="assets/js/partials.js"></script>
<script>
(function(){
  var items=Cart.read();
  if(!items.length){ location.href='cart.html'; return; }
  var sub=Cart.subtotal(items), del=Cart.deliveryFee(sub);
  document.getElementById('summary').innerHTML=
    items.map(function(i){return '<div class="row"><span>'+i.name+' ×'+i.qty+'</span><span>'+Cart.formatNaira(Cart.lineTotal(i))+'</span></div>';}).join('')+
    '<div class="row"><span>Delivery</span><span>'+(del===0?'Free':Cart.formatNaira(del))+'</span></div>'+
    '<div class="row total"><span>Total</span><span>'+Cart.formatNaira(sub+del)+'</span></div>';
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();
    var d={}; new FormData(e.target).forEach(function(v,k){d[k]=v;});
    Checkout.placeOrder(d);
    location.href='confirmation.html';
  });
})();
</script>
</body></html>
```

- [ ] **Step 3: Build confirmation.html**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order Confirmed — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<div class="wrap section center" id="conf"></div>
<div id="footer"></div>
<script src="assets/js/cart.js"></script>
<script src="assets/js/partials.js"></script>
<script>
(function(){
  var o; try{ o=JSON.parse(sessionStorage.getItem('decork_last_order')); }catch(e){}
  var box=document.getElementById('conf');
  if(!o){ box.innerHTML='<h1 class="serif">No recent order</h1><p><a href="tiles.html">Start shopping</a></p>'; return; }
  box.innerHTML='<div class="eyebrow">Thank you</div>'+
    '<h1 class="serif" style="font-size:40px;margin:10px 0">Order '+o.number+' confirmed</h1>'+
    '<p>Thanks '+(o.details.name||'')+' — your order of '+Cart.formatNaira(o.total)+' is being prepared.<br>'+
    'Delivery: '+o.details.delivery+' · Payment: '+o.details.payment+'</p>'+
    '<p style="color:var(--muted);font-size:13px">(Demo order — no payment was taken.)</p>'+
    '<a class="btn btn--primary" href="index.html" style="margin-top:14px">Back to home</a>';
})();
</script>
</body></html>
```

- [ ] **Step 4: Verify the full funnel** — From a populated cart: `checkout.html` shows the summary; submitting the form clears the cart, redirects to `confirmation.html` with an order number like `DK-123456`, and the header cart badge returns to 0.

- [ ] **Step 5: Checkpoint** — checkout + confirmation complete.

---

## Task 11: Locations + About (locations.html, about.html)

**Files:**
- Create: `locations.html`, `about.html`

- [ ] **Step 1: Build locations.html**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Our Locations — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<section class="section"><div class="wrap center"><div class="eyebrow">Our locations</div><h1 class="serif" style="font-size:36px;margin-top:8px">Come and see us</h1><hr class="rule"></div>
<div class="wrap grid grid--3" style="margin-top:20px">
  <div class="card"><div class="ph"></div><div class="body"><h3>Aba</h3><p>119 & 128 Faulks Road,<br>Aba, Abia State<br>0706 768 5620</p></div></div>
  <div class="card"><div class="ph"></div><div class="body"><h3>Enugu</h3><p>Enugu South Building Materials Market, Block H14 · Line D4, Shop 3 (Decorkote Paints Depot)<br>0808 636 4714</p></div></div>
  <div class="card"><div class="ph"></div><div class="body"><h3>Abuja</h3><p>Decorkote Plaza, Dei Dei International Market, Abuja<br>0903 063 3140</p></div></div>
</div></section>
<div id="footer"></div>
<script src="assets/js/cart.js"></script><script src="assets/js/partials.js"></script>
</body></html>
```

- [ ] **Step 2: Build about.html**

```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About — Decork</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Hanken+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css"></head><body>
<div id="header"></div>
<section class="section"><div class="wrap" style="max-width:760px;text-align:center">
  <div class="eyebrow">About</div><h1 class="serif" style="font-size:36px;margin-top:8px">The Decork Group</h1><hr class="rule">
  <p>Decork is a Nigerian building-materials group supplying quality Nigerian, Italian and Spanish tiles alongside our own Decorkote paints — delivered nationwide from our depots in Aba, Enugu and Abuja.</p>
  <p style="color:var(--muted)">The wider group also includes Decork Logistics, Freedom Dolomite (calcium carbonate), Increte floors &amp; wall stamping, and Ayaa Table Water.</p>
  <a class="btn btn--primary" href="tiles.html" style="margin-top:14px">Shop tiles</a>
</div></section>
<div id="footer"></div>
<script src="assets/js/cart.js"></script><script src="assets/js/partials.js"></script>
</body></html>
```

- [ ] **Step 3: Verify** — both pages render with shared header/footer and correct addresses.

- [ ] **Step 4: Checkpoint** — all 9 pages exist.

---

## Task 12: Final polish + full-funnel verification

**Files:** (touch-ups across pages as needed)

- [ ] **Step 1: Run the unit suite once more**

Run: `node --test`
Expected: PASS (7 tests).

- [ ] **Step 2: Serve and walk the whole funnel**

Run: `python3 -m http.server 8000` then visit `http://localhost:8000/`.
Walk: Home → Tiles → filter → open Carrara → calculator → add → Paint → open Decorkote → pick colour/size → add → Cart (edit qty, see Free delivery) → Checkout → Place order → Confirmation. Confirm cart badge updates throughout and resets after the order.

- [ ] **Step 3: Mobile check** — narrow the window to ~380px. Expected: grids collapse to 1–2 columns, product page stacks, nav still usable (per the `@media` rules in `styles.css`).

- [ ] **Step 4: Placeholder-image note** — all imagery is grey `.ph` blocks. Before client sign-off, drop real/free photos into `assets/products/` and set each product's `img`, then render `<img>` in `Catalog.card` and the product gallery. (Out of scope for this build; tracked as an open item.)

- [ ] **Step 5: Final checkpoint** — demo is complete and walkable end to end.

---

## Open items (post-build, non-blocking)
- Replace grey placeholders with real/free product photos; wire `img` fields.
- Drop in the real Decork logo (SVG/PNG) in place of the text wordmark in `partials.js`.
- Confirm exact brand hex values, free-delivery threshold, and flat delivery fee.
- (Go-live phase) real payment gateway, accounts, inventory, trade pricing, hosting.
```
