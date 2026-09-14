import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Beauty', 'Sports'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductFilters({ filters, onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (patch) => onChange({ ...filters, ...patch, page: 1 });

  const panel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Sort by</p>
        <select
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="w-full rounded-md border border-ink/20 bg-surface px-3 py-2 text-sm text-ink"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Category</p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => update({ category: '' })}
            />
            All categories
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => update({ category: cat })}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Price range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="w-full rounded-md border border-ink/20 bg-surface px-2 py-1.5 text-sm text-ink"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="w-full rounded-md border border-ink/20 bg-surface px-2 py-1.5 text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Minimum rating</p>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={String(filters.rating) === String(r)}
                onChange={() => update({ rating: r })}
              />
              {r}+ stars
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={!filters.rating}
              onChange={() => update({ rating: '' })}
            />
            Any rating
          </label>
        </div>
      </div>

      <button
        onClick={() => onChange({ search: filters.search, sort: 'newest', category: '', minPrice: '', maxPrice: '', rating: '', page: 1 })}
        className="text-sm font-medium text-amber-dark hover:underline"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-md border border-ink/20 px-4 py-2 text-sm font-medium md:hidden"
      >
        <SlidersHorizontal size={16} />
        Filters &amp; sort
      </button>

      <aside className="hidden w-56 shrink-0 md:block">{panel}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Filters</p>
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
