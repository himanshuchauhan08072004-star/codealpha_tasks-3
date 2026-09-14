import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Cart() {
  const { items, subtotal, loading } = useCart();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse products and add something you like."
        action={
          <Link to="/products" className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-semibold">Shopping Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {items.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
          <Link to="/products" className="mt-4 inline-block text-sm font-medium text-amber-dark hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <div>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
