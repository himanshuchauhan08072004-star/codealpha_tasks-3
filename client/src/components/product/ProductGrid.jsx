import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-ink/10 bg-surface">
      <div className="aspect-square bg-navy/5" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-navy/10" />
        <div className="h-3 w-1/2 rounded bg-navy/10" />
        <div className="h-8 rounded bg-navy/10" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
