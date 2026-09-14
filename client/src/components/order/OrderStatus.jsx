const STATUS_STYLES = {
  pending: 'bg-navy/10 text-ink',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber/20 text-amber-dark',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-stock/15 text-stock',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderStatus({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
