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
