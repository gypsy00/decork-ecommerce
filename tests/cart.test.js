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
