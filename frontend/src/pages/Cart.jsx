import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiTruck, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const {
    cart,
    subtotal,
    itemCount,
    freeShippingThreshold,
    freeShippingLeft,
    freeShippingPercent,
    updateQuantity,
    removeItem,
  } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Your shopping bag is empty"
          subtitle="Explore our unstitched lawn, festive formals, and ready to wear collections."
          action={
            <Link to="/category/unstitched" className="btn-primary inline-flex items-center gap-2">
              <span>Start Shopping</span>
              <FiArrowRight />
            </Link>
          }
        />
      </div>
    );
  }

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 250;
  const estimatedTotal = subtotal + shippingFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-body">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gray-900 mb-2">
        Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>

      {/* Free Delivery Bar */}
      <div className="bg-[#fcf8f3] border border-amber-200/60 rounded-lg p-4 mb-8">
        {subtotal >= freeShippingThreshold ? (
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs sm:text-sm">
            <FiCheckCircle className="text-lg shrink-0 text-emerald-600" />
            <span>Congratulations! You have unlocked <strong>FREE Shipping</strong> across Pakistan!</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-800 mb-2">
              <span className="flex items-center gap-2">
                <FiTruck className="text-brand text-base" />
                Add <strong>Rs. {freeShippingLeft.toLocaleString()}</strong> more to get FREE Delivery!
              </span>
              <span className="font-bold text-brand">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items column */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const image =
              item.product?.images?.[0] ||
              'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=300&q=80';
            const price = item.priceAtAdd || item.product?.price || 0;
            const itemId = item._id || item.variantId;

            return (
              <div
                key={itemId}
                className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all"
              >
                <img
                  src={image}
                  alt={item.product?.name}
                  className="w-24 h-32 object-cover rounded bg-gray-100 shrink-0 border border-gray-100"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product?.slug}`}
                        className="font-heading font-semibold text-sm sm:text-base text-gray-900 hover:text-brand line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      <button
                        onClick={() => removeItem(itemId)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.size || 'Standard'} {item.color ? `· ${item.color}` : ''}
                    </p>
                    <p className="text-xs text-gray-700 mt-1 font-medium">
                      Unit Price: Rs. {price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-300 rounded text-xs bg-gray-50">
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-base text-brand">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary column */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm h-fit space-y-4">
          <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-gray-900 pb-3 border-b">
            Order Summary
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nationwide Shipping</span>
              <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-950">
              <span>Estimated Total</span>
              <span className="text-brand">Rs. {estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Cash on Delivery (COD) available across Pakistan. Easy returns within 7 days.
          </p>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary w-full py-3.5 uppercase tracking-[0.16em] text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <FiArrowRight />
          </button>

          <Link
            to="/category/unstitched"
            className="block text-center text-xs text-gray-600 hover:text-brand underline font-medium pt-2"
          >
            &larr; Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
