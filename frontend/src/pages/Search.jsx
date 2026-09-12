import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import EmptyState from '../components/EmptyState';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [input, setInput] = useState(q);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!q) return setData({ products: [], total: 0 });
    setData(null);
    api.get('/products/search', { params: { q } }).then((r) => setData(r.data));
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    setSearchParams(input ? { q: input } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={submit} className="max-w-md mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for suits, shawls, fabrics..."
          className="input"
          autoFocus
        />
      </form>

      {!q ? (
        <EmptyState title="Search our catalog" subtitle="Try 'chiffon', 'shawl', or 'lawn 3 pcs'." />
      ) : data === null ? (
        <ProductGridSkeleton count={8} />
      ) : data.products.length === 0 ? (
        <EmptyState title={`No results for "${q}"`} subtitle="Try a different search term." />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{data.total} results for "{q}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
