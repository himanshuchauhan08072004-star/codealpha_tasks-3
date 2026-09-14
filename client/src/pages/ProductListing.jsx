import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import SearchBar from '../components/product/SearchBar';
import Pagination from '../components/common/Pagination';
import useDebounce from '../hooks/useDebounce';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  };

  const debouncedSearch = useDebounce(filters.search, 400);

  const handleFilterChange = useCallback(
    (next) => {
      const params = {};
      Object.entries(next).forEach(([key, val]) => {
        if (val !== '' && val !== undefined && val !== null) params[key] = val;
      });
      setSearchParams(params);
    },
    [setSearchParams]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchProducts({
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      rating: filters.rating || undefined,
      sort: filters.sort,
      page: filters.page,
      limit: 12,
    })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setPagination(res.pagination);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.rating, filters.sort, filters.page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-4 font-display text-2xl font-semibold">
        {filters.search ? `Results for "${filters.search}"` : filters.category || 'All Products'}
      </h1>

      <div className="mb-6 max-w-md">
        <SearchBar value={filters.search} onChange={(val) => handleFilterChange({ ...filters, search: val, page: 1 })} />
      </div>

      <div className="flex gap-8">
        <ProductFilters filters={filters} onChange={handleFilterChange} />

        <div className="flex-1">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <>
              <ProductGrid products={products} loading={loading} />
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
