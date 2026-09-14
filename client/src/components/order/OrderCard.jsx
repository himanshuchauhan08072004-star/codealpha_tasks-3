import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatus from './OrderStatus';

export default function OrderCard({ order }) {
  const itemCount = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-ink">Order #{order._id.slice(-8).toUpperCase()}</p>
        <p className="mt-1 text-xs text-ink/50">
          {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          {' · '}
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <OrderStatus status={order.orderStatus} />
        <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
        <Link
          to={`/orders/${order._id}`}
          className="rounded-md border border-ink/20 px-3 py-1.5 text-xs font-medium hover:bg-bg"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
