import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { createOrder } from '../services/orderService';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Checkout() {
  const { items, subtotal, loading, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products to your cart before checking out."
        action={
          <Link to="/products" className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
            Browse products
          </Link>
        }
      />
    );
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await createOrder(formData);
      await clearCart();
      toast.success('Order placed successfully');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-semibold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CheckoutForm
            onSubmit={handleSubmit}
            submitting={submitting}
            defaultValues={{ customerInfo: { fullName: user?.name || '', email: user?.email || '' } }}
          />
        </div>

        <div>
          <div className="mb-4 rounded-lg border border-ink/10 bg-surface p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Items ({items.length})</p>
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between py-1 text-xs text-ink/70">
                <span className="line-clamp-1">{item.product.name} × {item.quantity}</span>
              </div>
            ))}
          </div>
          <CartSummary subtotal={subtotal} showCheckoutButton={false} />
        </div>
      </div>
    </div>
  );
}
