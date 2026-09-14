import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';

const CATEGORIES = [
  { name: 'Electronics', blurb: 'Phones, audio, gadgets' },
  { name: 'Fashion', blurb: 'Everyday and statement pieces' },
  { name: 'Home & Living', blurb: 'For the space you live in' },
  { name: 'Accessories', blurb: 'The finishing details' },
  { name: 'Beauty', blurb: 'Skin, hair, and self-care' },
  { name: 'Sports', blurb: 'Gear for staying active' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProducts({ featured: 'true', limit: 4 }),
      fetchProducts({ sort: 'rating', limit: 8 }),
    ])
      .then(([featuredRes, popularRes]) => {
        setFeatured(featuredRes.data);
        setPopular(popularRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Everyday products, picked well.
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Electronics, fashion, home goods, and more — curated and shipped fast.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-full bg-amber px-6 py-3 text-sm font-medium text-navy hover:bg-amber-dark"
          >
            Shop all products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="rounded-lg border border-ink/10 bg-surface p-4 hover:border-amber"
            >
              <p className="text-sm font-semibold text-ink">{cat.name}</p>
              <p className="mt-1 text-xs text-ink/50">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {(loading || featured.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Featured</h2>
            <Link to="/products" className="text-sm font-medium text-amber-dark hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="rounded-lg bg-amber/10 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Free shipping over $75</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            Every order ships fast, and orders over $75 ship free — no code needed.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Start shopping
          </Link>
        </div>
      </section>

      {(loading || popular.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-semibold">Popular right now</h2>
          <ProductGrid products={popular} loading={loading} />
        </section>
      )}
    </div>
  );
}
