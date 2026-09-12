import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingBag, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import QuickViewModal from './QuickViewModal';

const GUEST_WISHLIST_KEY = 'tfs_guest_wishlist';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [inWishlist, setInWishlist] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80'];
  const primaryImg = images[0];
  const secondaryImg = images[1] || images[0];

  const availableVariants = product.variants?.filter((v) => v.stock > 0) || [];
  const outOfStock = (product.totalStock ?? 0) <= 0 || availableVariants.length === 0;
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  // Check wishlist state
  useEffect(() => {
    if (!user) {
      try {
        const saved = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
        setInWishlist(saved.includes(product._id));
      } catch {
        setInWishlist(false);
      }
    }
  }, [product._id, user]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      try {
        let saved = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
        if (saved.includes(product._id)) {
          saved = saved.filter((id) => id !== product._id);
          setInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          saved.push(product._id);
          setInWishlist(true);
          toast.success('Added to wishlist');
        }
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(saved));
      } catch {
        toast.error('Could not update wishlist');
      }
      return;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId: product._id });
      setInWishlist(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    // If product has multiple sizes/variants, open quick-view so they choose size
    if (availableVariants.length > 1) {
      setQuickViewOpen(true);
      return;
    }

    const targetVariant = availableVariants[0] || product.variants?.[0];
    if (!targetVariant) {
      navigate(`/product/${product.slug}`);
      return;
    }

    setAdding(true);
    await addToCart(product._id, targetVariant._id, 1, product);
    setAdding(false);
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white transition-all duration-300">
        {/* Image Container with Hover Swap */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-[3/4] w-full overflow-hidden bg-gray-100"
        >
          {/* Primary Image */}
          <img
            src={primaryImg}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              images.length > 1 ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Secondary Image (Hover Swap) */}
          {images.length > 1 && (
            <img
              src={secondaryImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="bg-[#b12a3b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
                -{discount}% OFF
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
                NEW
              </span>
            )}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-2.5 right-2.5 z-20 rounded-full p-2 text-base transition-all duration-200 shadow-sm ${
              inWishlist
                ? 'bg-white text-red-500 shadow-md scale-110'
                : 'bg-white/85 text-gray-600 hover:text-red-500 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            aria-label="Wishlist"
          >
            <FiHeart className={inWishlist ? 'fill-current' : ''} />
          </button>

          {/* Action buttons bar over image (Desktop slide-up) */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 hidden sm:flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={openQuickView}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold py-2 px-2 rounded shadow transition-colors"
              aria-label="Quick View"
            >
              <FiEye className="text-sm" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 px-2 rounded shadow transition-colors disabled:opacity-50"
              aria-label="Add to bag"
            >
              <FiShoppingBag className="text-sm" />
              <span>{availableVariants.length > 1 ? 'Select Size' : 'Quick Add'}</span>
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
          <div>
            {/* Fabric & piece category label */}
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium truncate">
              {product.fabric || 'Luxury Fabric'}
              {product.pieces ? ` · ${product.pieces} Pc Suit` : ''}
            </div>

            {/* Title */}
            <Link
              to={`/product/${product.slug}`}
              className="block font-heading text-sm text-gray-900 hover:text-brand font-medium mt-1 line-clamp-2 leading-snug transition-colors"
            >
              {product.name}
            </Link>
          </div>

          {/* Price & Mobile Add Button */}
          <div className="mt-2 pt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-brand text-sm sm:text-base">
                Rs. {product.price?.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  Rs. {product.compareAtPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Mobile quick add button */}
            <button
              onClick={handleQuickAdd}
              disabled={outOfStock}
              className="sm:hidden p-1.5 rounded-full bg-gray-100 hover:bg-brand hover:text-white text-gray-700 transition-colors"
              aria-label="Add to bag"
            >
              <FiShoppingBag className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
