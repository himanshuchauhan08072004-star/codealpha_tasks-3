const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 6.99;
const TAX_RATE = 0.08;

// Server is the single source of truth for money math - never trust client-sent totals
const calculateTotals = (subtotal) => {
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;
  return { shippingCost, tax, total };
};

module.exports = { calculateTotals };
