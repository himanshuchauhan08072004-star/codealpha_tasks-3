import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAllOrders, updateOrderStatusApi } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllOrders()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (order, orderStatus) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o._id === order._id ? { ...o, orderStatus } : o)));
    try {
      await updateOrderStatusApi(order._id, orderStatus);
      toast.success('Order status updated');
    } catch (err) {
      setOrders(prev);
      toast.error(err.response?.data?.message || 'Could not update status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-bg text-xs uppercase text-ink/50">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">{order.user?.name || order.customerInfo?.fullName}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="rounded-md border border-ink/20 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/orders/${order._id}`} className="text-xs font-medium text-amber-dark hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
