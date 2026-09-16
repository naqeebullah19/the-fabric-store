import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiCheck, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product?.variants?.length) {
      const firstInStock = product.variants.find((v) => v.stock > 0);
      setSelectedVariantId(firstInStock?._id || product.variants[0]._id);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80'];

  const selectedVariant = product.variants?.find((v) => v._id === selectedVariantId) || product.variants?.[0];
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addToCart(product._id, selectedVariant._id, qty, product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/80 p-2 text-gray-600 hover:text-gray-900 hover:bg-white shadow transition-colors"
          aria-label="Close dialog"
        >
          <FiX className="text-lg" />
        </button>

        {/* Image Gallery Column */}
        <div className="md:w-1/2 bg-gray-50 flex flex-col justify-between p-4">
          <div className="aspect-[4/5] rounded overflow-hidden bg-gray-100 relative">
            <img
              src={images[activeImg] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-brand text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                -{discount}%
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-16 rounded overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand font-semibold uppercase tracking-wider">
              <span>{product.fabric || 'Premium Fabric'}</span>
              {product.pieces && <span>&bull; {product.pieces} Piece</span>}
            </div>

            <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 mt-1 leading-snug">
              {product.name}
            </h2>

            {/* Price block */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-bold text-brand">
                Rs. {product.price?.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.compareAtPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Fabric specs badge */}
            <div className="mt-4 p-3 bg-cream rounded text-xs space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Suit Type:</span>
                <span className="font-medium">{product.category?.name || 'Women Collections'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fabric:</span>
                <span className="font-medium">{product.fabric || 'Original Lawn / Chiffon'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Availability:</span>
                <span className={`font-semibold ${outOfStock ? 'text-red-500' : 'text-emerald-700'}`}>
                  {outOfStock ? 'Sold Out' : 'In Stock & Ready to Ship'}
                </span>
              </div>
            </div>

            {/* Variant / Size pills */}
            {product.variants?.length > 0 && (
              <div className="mt-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-gray-700">Select Size:</span>
                  <span className="text-gray-500">{selectedVariant?.color ? `Color: ${selectedVariant.color}` : ''}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = v._id === selectedVariantId;
                    const isSoldOut = v.stock <= 0;
                    return (
                      <button
                        key={v._id}
                        disabled={isSoldOut}
                        onClick={() => setSelectedVariantId(v._id)}
                        className={`text-xs px-3.5 py-2 rounded border font-medium transition-all ${
                          isSelected
                            ? 'border-brand bg-brand text-white shadow-sm'
                            : isSoldOut
                            ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:border-brand hover:text-brand'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded text-xs">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="px-3 font-semibold text-gray-800">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-gray-100">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="prestige-button-black w-full gap-2 py-3 px-4 shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingBag className="text-base" />
              <span>{outOfStock ? 'Sold Out' : 'Add to Bag'}</span>
            </button>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-gray-600 hover:text-brand underline font-medium py-1"
            >
              View Full Product Details & Specs &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
