import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProductById } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import { handleImageError } from '../utils/imageFallback';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    setQuantity(1);
    setActiveImage(0);

    fetchProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        setError(err.response?.status === 404 ? 'Product not found' : 'Could not load this product');
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

  if (error || !product) {
    return (
      <EmptyState
        title={error || 'Product not found'}
        description="It may have been removed or the link is incorrect."
        action={
          <Link to="/products" className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
            Browse products
          </Link>
        }
      />
    );
  }

  const outOfStock = product.stock <= 0;
  const discount = product.discountPercentage || 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-bg">
            <img src={product.images?.[activeImage]} alt={product.name} className="h-full w-full object-cover" onError={handleImageError} />
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                    i === activeImage ? 'border-amber' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" onError={handleImageError} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-ink/50">{product.category}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-ink/60">
            <Star size={15} className="fill-amber text-amber" />
            <span>{product.rating?.toFixed(1) || '0.0'}</span>
            <span>({product.reviewCount || 0} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-ink/40 line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="rounded-full bg-amber/15 px-2 py-0.5 text-xs font-semibold text-amber-dark">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className={`mt-2 text-sm font-medium ${outOfStock ? 'text-red-600' : 'text-stock'}`}>
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink/70">{product.description}</p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center rounded-md border border-ink/20">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 rounded-md bg-navy py-3 text-sm font-medium text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-1 rounded-md bg-amber py-3 text-sm font-medium text-navy hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="mb-3 text-sm font-semibold text-ink">Specifications</p>
              <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="text-ink/50">{key}:</dt>
                    <dd className="font-medium">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
