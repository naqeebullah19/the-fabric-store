import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    subtotal,
    itemCount,
    freeShippingThreshold,
    freeShippingLeft,
    freeShippingPercent,
    isDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCart();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-xl text-brand" />
            <h2 className="font-heading font-bold text-lg tracking-wide uppercase">Shopping Bag</h2>
            <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold">
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#fcf9f5] border-b px-5 py-3 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <FiCheckCircle className="text-base shrink-0" />
              <span>You have unlocked <strong>FREE Delivery</strong> across Pakistan!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5 text-gray-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <FiTruck className="text-brand text-sm" />
                  Add <strong>Rs. {freeShippingLeft.toLocaleString()}</strong> more for FREE Shipping!
                </span>
                <span>{freeShippingPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-gray-100">
          {cart.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-4 text-2xl">
                <FiShoppingBag />
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-800">Your bag is empty</h3>
              <p className="text-gray-500 text-xs mt-1 max-w-xs">
                Explore our unstitched lawn, festive pret, and luxury shawls.
              </p>
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/category/unstitched');
                }}
                className="btn-primary mt-5 text-xs uppercase tracking-wider px-6 py-2.5"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const image =
                item.product?.images?.[0] ||
                'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=300&q=80';
              const price = item.priceAtAdd || item.product?.price || 0;
              const itemId = item._id || item.variantId;

              return (
                <div key={itemId} className="py-4 flex gap-3.5 group">
                  <img
                    src={image}
                    alt={item.product?.name}
                    className="w-20 h-24 object-cover rounded bg-gray-100 shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.product?.slug}`}
                          onClick={closeCartDrawer}
                          className="text-sm font-medium text-gray-900 hover:text-brand line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <button
                          onClick={() => removeItem(itemId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.size || 'Standard'} {item.color ? `· ${item.color}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center border border-gray-200 rounded text-xs bg-gray-50">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-sm text-gray-900">
                          Rs. {(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.items?.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 bg-white shadow-inner space-y-3">
            {/* Optional order note toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-xs text-gray-600 underline hover:text-brand"
              >
                {showNoteInput ? 'Hide order note' : '+ Add order instructions / note'}
              </button>
              {showNoteInput && (
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Special instructions for delivery, sizing or gift note..."
                  rows={2}
                  className="mt-2 w-full text-xs border border-gray-200 rounded p-2 focus:outline-none focus:border-brand"
                />
              )}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-lg text-brand">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Taxes included. Delivery charges calculated at checkout.
            </p>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 px-4 rounded text-xs uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>Proceed to Checkout</span>
                <span>&rarr;</span>
              </button>
              <button
                onClick={handleViewCart}
                className="w-full border border-gray-300 hover:border-gray-900 text-gray-800 font-semibold py-2.5 px-4 rounded text-xs uppercase tracking-[0.14em] transition-colors"
              >
                View Bag ({itemCount})
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-2">
              <span>🇵🇰 Nationwide COD</span>
              <span>&bull;</span>
              <span>🔒 100% Safe Checkout</span>
              <span>&bull;</span>
              <span>🔄 7-Day Exchange</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
