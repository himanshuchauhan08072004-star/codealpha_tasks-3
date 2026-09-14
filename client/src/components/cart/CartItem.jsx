import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { handleImageError } from '../../utils/imageFallback';
import useCart from '../../hooks/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 border-b border-ink/10 py-4">
      <Link to={`/products/${product._id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg">
        <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover" onError={handleImageError} />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/products/${product._id}`} className="text-sm font-medium text-ink hover:text-amber-dark">
            {product.name}
          </Link>
          <button
            onClick={() => removeItem(product._id)}
            className="text-ink/40 hover:text-red-600"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="mt-1 text-sm text-ink/60">{formatCurrency(product.price)} each</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-md border border-ink/20">
            <button
              onClick={() => updateQuantity(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-1 text-lg disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => updateQuantity(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="px-3 py-1 text-lg disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold">{formatCurrency(product.price * quantity)}</span>
        </div>
      </div>
    </div>
  );
}
