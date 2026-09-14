const { calculateTotals } = require('../services/orderService');

describe('orderService.calculateTotals', () => {
  test('applies flat shipping below free-shipping threshold', () => {
    const { shippingCost } = calculateTotals(50);
    expect(shippingCost).toBe(6.99);
  });

  test('gives free shipping at or above threshold', () => {
    expect(calculateTotals(75).shippingCost).toBe(0);
    expect(calculateTotals(100).shippingCost).toBe(0);
  });

  test('gives free shipping for an empty cart (subtotal 0)', () => {
    expect(calculateTotals(0).shippingCost).toBe(0);
  });

  test('computes 8% tax rounded to cents', () => {
    const { tax } = calculateTotals(19.99);
    expect(tax).toBeCloseTo(1.6, 2);
  });

  test('total is subtotal + shipping + tax', () => {
    const subtotal = 40;
    const { shippingCost, tax, total } = calculateTotals(subtotal);
    expect(total).toBeCloseTo(subtotal + shippingCost + tax, 2);
  });

  test('never returns a negative total', () => {
    const { total } = calculateTotals(0);
    expect(total).toBeGreaterThanOrEqual(0);
  });
});
