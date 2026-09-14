export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_COST = 6.99;
export const TAX_RATE = 0.08;

export const calculateTotals = (subtotal) => {
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;
  return { shippingCost, tax, total };
};
