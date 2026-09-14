import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../services/orderService';
import OrderCard from '../components/order/OrderCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError('Could not load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-semibold">My Orders</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it'll show up here."
          action={
            <Link to="/products" className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
              Start shopping
            </Link>
          }
        />
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
