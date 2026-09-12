import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiCheck, FiChevronRight } from 'react-icons/fi';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import EmptyState from '../components/EmptyState';

const FABRICS = ['Lawn', 'Chiffon', 'Khaddar', 'Karandi', 'Silk', 'Cambric', 'Wool', 'Pashmina', 'Velvet'];
const PIECES = [
  { value: '1', label: '1 Piece (Shirt/Kurti)' },
  { value: '2', label: '2 Piece (Suit/Coord)' },
  { value: '3', label: '3 Piece (Full Suit)' },
];
const SIZES = ['Unstitched', 'S', 'M', 'L', 'XL'];
const SORTS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'bestSeller', label: 'Best Sellers' },
  { value: 'rating', label: 'Top Customer Rated' },
];

export default function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from URL
  const selectedFabric = searchParams.get('fabric') || '';
  const selectedPieces = searchParams.get('pieces') || '';
  const selectedSize = searchParams.get('size') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  // Category Title
  useEffect(() => {
    if (slug === 'sale') {
      setCategoryName('Seasonal Sale & Clearance');
    } else if (slug === 'new-arrivals') {
      setCategoryName('New Arrivals Edit');
    } else {
      api
        .get(`/categories/${slug}`)
        .then((r) => setCategoryName(r.data.name))
        .catch(() => setCategoryName(slug.replace(/-/g, ' ')));
    }
  }, [slug]);

  // Fetch filtered products
  useEffect(() => {
    setData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api
      .get('/products', {
        params: {
          category: slug,
          fabric: selectedFabric || undefined,
          pieces: selectedPieces || undefined,
          size: selectedSize || undefined,
          inStock: inStockOnly ? 'true' : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          limit: 30,
        },
      })
      .then((r) => setData(r.data))
      .catch(() => setData({ products: [], total: 0 }));
  }, [slug, selectedFabric, selectedPieces, selectedSize, inStockOnly, minPrice, maxPrice, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value !== undefined && value !== '' && value !== false) {
      next.set(key, String(value));
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFilterCount =
    (selectedFabric ? 1 : 0) +
    (selectedPieces ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  const FilterSidebarContent = () => (
    <div className="space-y-6 text-xs text-gray-800">
      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="p-3 bg-cream rounded border border-brand/20">
          <div className="flex items-center justify-between mb-2 font-semibold text-brand">
            <span>Active Filters ({activeFilterCount})</span>
            <button onClick={clearAllFilters} className="text-[11px] underline hover:text-brand-dark">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedFabric && (
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                {selectedFabric}
                <button onClick={() => updateParam('fabric', '')}><FiX /></button>
              </span>
            )}
            {selectedPieces && (
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                {selectedPieces} Pc
                <button onClick={() => updateParam('pieces', '')}><FiX /></button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                Size: {selectedSize}
                <button onClick={() => updateParam('size', '')}><FiX /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                In Stock
                <button onClick={() => updateParam('inStock', false)}><FiX /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                Rs. {minPrice || '0'} - {maxPrice || 'Any'}
                <button onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }}><FiX /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Fabric Filter */}
      <div>
        <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-2.5 pb-1 border-b">
          Fabric
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {FABRICS.map((f) => {
            const isChecked = selectedFabric.toLowerCase() === f.toLowerCase();
            return (
              <label key={f} className="flex items-center justify-between cursor-pointer hover:text-brand py-0.5">
                <span className={isChecked ? 'font-semibold text-brand' : 'text-gray-600'}>{f}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateParam('fabric', isChecked ? '' : f)}
                  className="rounded text-brand focus:ring-brand h-3.5 w-3.5"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Pieces Filter */}
      <div>
        <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-2.5 pb-1 border-b">
          Pieces
        </h4>
        <div className="space-y-1.5">
          {PIECES.map((p) => {
            const isChecked = selectedPieces === p.value;
            return (
              <label key={p.value} className="flex items-center justify-between cursor-pointer hover:text-brand py-0.5">
                <span className={isChecked ? 'font-semibold text-brand' : 'text-gray-600'}>{p.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateParam('pieces', isChecked ? '' : p.value)}
                  className="rounded text-brand focus:ring-brand h-3.5 w-3.5"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-2.5 pb-1 border-b">
          Size / Type
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => {
            const isSelected = selectedSize === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => updateParam('size', isSelected ? '' : s)}
                className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-2.5 pb-1 border-b">
          Price Range (Rs.)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand"
          />
          <span className="text-gray-400">&ndash;</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam('inStock', e.target.checked)}
            className="rounded text-brand focus:ring-brand h-4 w-4"
          />
          <span className="font-medium text-gray-800">Show In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-body">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 uppercase tracking-wider">
        <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <FiChevronRight className="text-[10px]" />
        <span className="text-gray-500">Collections</span>
        <FiChevronRight className="text-[10px]" />
        <span className="text-gray-900 font-semibold">{categoryName}</span>
      </nav>

      {/* Category Banner / Header */}
      <div className="border-b border-gray-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-gray-950 capitalize tracking-wide">
            {categoryName}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {data ? `${data.total} luxury products found` : 'Loading collection...'}
          </p>
        </div>

        {/* Sort and Mobile Filter Bar */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:border-brand"
          >
            <FiFilter />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-gray-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-xs font-medium bg-white text-gray-800 focus:outline-none focus:border-brand"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-28 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <FilterSidebarContent />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {data === null ? (
            <ProductGridSkeleton count={12} />
          ) : data.products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              subtitle="Try loosening your filters (fabric, size or price) to discover more pieces."
              action={
                <button onClick={clearAllFilters} className="btn-primary mt-2">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-start lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b mb-4">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-gray-900">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-xl text-gray-500 hover:text-gray-900"
                aria-label="Close filters"
              >
                <FiX />
              </button>
            </div>
            <div className="flex-1">
              <FilterSidebarContent />
            </div>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="btn-primary w-full mt-4 text-xs uppercase tracking-wider py-3"
            >
              Apply Filters ({data?.total || 0} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
