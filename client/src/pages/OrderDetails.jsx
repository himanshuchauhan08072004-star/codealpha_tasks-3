import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';
import OrderStatus from '../components/order/OrderStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        setError(
          err.response?.status === 404
            ? 'Order not found'
            : err.response?.status === 403
            ? 'You do not have access to this order'
            : 'Could not load this order'
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <EmptyState
        title={error || 'Order not found'}
        action={
          <Link to="/orders" className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
            Back to orders
          </Link>
        }
      />
    );
  }

  const { shippingAddress, customerInfo } = order;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-ink/50">
            Placed {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <OrderStatus status={order.orderStatus} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-ink/10 bg-surface p-5">
            <p className="mb-4 text-sm font-semibold text-ink">Items</p>
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex gap-3 border-b border-ink/10 py-3 last:border-0">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md bg-bg object-cover" onError={handleImageError} />
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-ink/50">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="self-center text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-ink/10 bg-surface p-5">
              <p className="mb-2 text-sm font-semibold text-ink">Shipping address</p>
              <p className="text-sm text-ink/70">{customerInfo.fullName}</p>
              <p className="text-sm text-ink/70">{shippingAddress.address}</p>
              <p className="text-sm text-ink/70">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </p>
              <p className="text-sm text-ink/70">{shippingAddress.country}</p>
            </div>

            <div className="rounded-lg border border-ink/10 bg-surface p-5">
              <p className="mb-2 text-sm font-semibold text-ink">Payment</p>
              <p className="text-sm text-ink/70 capitalize">Method: {order.paymentMethod}</p>
              <p className="text-sm text-ink/70 capitalize">Status: {order.paymentStatus}</p>
              <p className="mt-3 text-sm font-semibold text-ink">Contact</p>
              <p className="text-sm text-ink/70">{customerInfo.email}</p>
              <p className="text-sm text-ink/70">{customerInfo.phone}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-surface p-5">
          <p className="mb-4 text-sm font-semibold text-ink">Order Total</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
