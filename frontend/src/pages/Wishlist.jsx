import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useAuth } from '../context/AuthContext';

const GUEST_WISHLIST_KEY = 'tfs_guest_wishlist';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (user) {
      api
        .get('/wishlist')
        .then((r) => setItems(r.data))
        .catch(() => setItems([]));
      return;
    }

    // Guest wishlist
    try {
      const savedIds = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
      if (savedIds.length === 0) {
        setItems([]);
        return;
      }
      // Fetch products
      api
        .get('/products', { params: { limit: 50 } })
        .then((r) => {
          const matched = (r.data.products || []).filter((p) => savedIds.includes(p._id));
          setItems(matched);
        })
        .catch(() => setItems([]));
    } catch {
      setItems([]);
    }
  }, [user]);

  if (items === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Wishlist is Empty"
          subtitle="Save your favorite unstitched lawn, festive pret, and luxury shawls by tapping the heart icon on any product."
          action={
            <Link to="/category/unstitched" className="btn-primary inline-flex items-center gap-2">
              <span>Explore Collection</span>
              <FiArrowRight />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gray-900">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Items you have saved for later. Ready to add to your shopping bag anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
