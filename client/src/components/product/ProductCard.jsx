import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { handleImageError } from '../../utils/imageFallback';
import useCart from '../../hooks/useCart';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const discount = product.discountPercentage || 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-surface">
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-bg">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-amber px-2 py-0.5 text-xs font-semibold text-navy">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to={`/products/${product._id}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-amber-dark">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-ink/60">
          <Star size={13} className="fill-amber text-amber" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span>({product.reviewCount || 0})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-ink/40 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        <p className={`text-xs ${outOfStock ? 'text-red-600' : 'text-stock'}`}>
          {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
        </p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => addItem(product, 1)}
            disabled={outOfStock}
            className="flex-1 rounded-md bg-navy py-2 text-xs font-medium text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="flex-1 rounded-md border border-ink/20 py-2 text-center text-xs font-medium text-ink hover:bg-bg"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
