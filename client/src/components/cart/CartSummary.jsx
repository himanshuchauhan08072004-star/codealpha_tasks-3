import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateTotals, FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

export default function CartSummary({ subtotal, showCheckoutButton = true }) {
  const { shippingCost, tax, total } = calculateTotals(subtotal);

  return (
    <div className="rounded-lg border border-ink/10 bg-surface p-5">
      <p className="mb-4 font-display text-lg font-semibold">Order Summary</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/60">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      {shippingCost > 0 && (
        <p className="mt-3 text-xs text-ink/50">
          Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
        </p>
      )}

      <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-base font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="mt-5 block rounded-md bg-navy py-3 text-center text-sm font-medium text-white hover:bg-navy-dark"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
