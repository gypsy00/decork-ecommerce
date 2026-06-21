# Decork Products LTD — E-commerce

E-commerce website for **Decork Products LTD**, a tiles & paint (building materials) retailer.
Customers browse products, configure/select quantities, add to cart, and pay at checkout.

**Current stage:** Demo for client review. Not live yet (go-live explored later).

## Project structure

```
decork-ecommerce/
├── README.md                  ← you are here
├── docs/
│   └── research/              ← market research, case studies, backend model
│       └── case-studies-and-backend-model.md
├── src/                       ← the demo website code (stack TBD)
├── assets/
│   └── products/              ← Decork product photos & media
└── data/                      ← product catalog data (tiles, paint, prices)
```

## Status / next steps
- [x] Market research + backend data model — see `docs/research/`
- [ ] Decide build approach (hand-coded demo vs Shopify/Woo/Wix)
- [ ] Gather real Decork product list + photos
- [ ] Build demo (catalog, coverage calculator, paint variants, cart, checkout)
- [ ] Client review
- [ ] Go-live planning (payments, accounts, inventory, delivery, admin)

## Key domain notes
- **Tiles** are sold by the *box* but chosen by *area (m²)* → coverage calculator + wastage %.
- **Paint** is a *variant matrix*: colour × finish × tin size × type → each combo is its own SKU.
- Two audiences: homeowners (retail) and contractors (trade/bulk).
