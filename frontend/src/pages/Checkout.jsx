import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiTruck, FiArrowLeft, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mardan',
  'Gujrat',
  'Rahim Yar Khan',
  'Kasur',
  'Sheikhupura',
];

export default function Checkout() {
  const { cart, subtotal, clearCart, freeShippingThreshold } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    line1: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [placing, setPlacing] = useState(false);

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 250;
  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'TFS10' || clean === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponApplied(true);
      toast.success(`Coupon ${clean} applied! You saved Rs. ${disc.toLocaleString()}`);
    } else {
      toast.error('Invalid or expired coupon code');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error('Please enter your full name');
    if (!form.phone.trim() || form.phone.length < 10) return toast.error('Please enter a valid phone/WhatsApp number');
    if (!form.line1.trim()) return toast.error('Please enter your delivery street address');
    if (!form.city.trim()) return toast.error('Please select or enter your city');

    setPlacing(true);
    try {
      const orderPayload = {
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        paymentMethod,
        guestEmail: form.email,
        items: cart.items.map((i) => ({
          productId: i.product?._id || i.product,
          variantId: i.variantId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
      };

      const res = await api.post('/orders', orderPayload);
      await clearCart();
      toast.success('Order placed successfully! Thank you for shopping with TFS.');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-body">
        <h2 className="font-heading text-xl font-bold mb-2">Your Bag is Empty</h2>
        <p className="text-gray-500 text-xs mb-6">Add suits or shawls to your bag before proceeding to checkout.</p>
        <Link to="/category/unstitched" className="btn-primary inline-block text-xs uppercase tracking-wider px-6 py-3">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-body">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-6 border-b mb-8">
        <Link to="/cart" className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand">
          <FiArrowLeft />
          <span>Return to Shopping Bag</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <FiLock />
          <span>Encrypted Secure Checkout</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Form */}
        <form onSubmit={submit} className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-900">
                1. Delivery Details
              </h3>
              {!user && (
                <span className="text-[11px] text-gray-500">
                  Checking out as Guest &middot;{' '}
                  <Link to="/login" className="text-brand font-semibold underline">
                    Log in
                  </Link>
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ayesha Khan"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="0300 1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address (Optional - for tracking receipts)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address *</label>
              <input
                required
                type="text"
                placeholder="House / Apartment #, Street #, Sector or Area"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                className="input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input text-xs"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Province</label>
                <select
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital">Islamabad Capital</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="e.g. 54000"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-900">
              2. Payment Method
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'COD' ? 'border-brand bg-cream' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-brand focus:ring-brand"
                />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 block text-sm">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-gray-500 mt-0.5 block">
                    Pay in cash when your parcel is delivered to your doorstep. Recommended for convenience across Pakistan.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'CARD' ? 'border-brand bg-cream' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="mt-1 text-brand focus:ring-brand"
                />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 block text-sm">
                    Direct Bank Transfer / IBFT
                  </span>
                  <span className="text-gray-500 mt-0.5 block">
                    Transfer funds directly to TFS official Meezan Bank account. Account details will be presented on order confirmation.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-lg disabled:opacity-50"
          >
            {placing ? 'Placing Order...' : `Complete Order — Rs. ${total.toLocaleString()}`}
          </button>
        </form>

        {/* Right Col: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-900 pb-3 border-b">
              Order Summary ({cart.items.length})
            </h3>

            {/* Items list */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {cart.items.map((item) => {
                const image =
                  item.product?.images?.[0] ||
                  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=150&q=80';
                const price = item.priceAtAdd || item.product?.price || 0;
                return (
                  <div key={item._id || item.variantId} className="py-2.5 flex items-center gap-3 text-xs">
                    <img src={image} alt="" className="w-12 h-14 object-cover rounded bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.size || 'Standard'} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Box */}
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. TFS10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                  className="input text-xs py-1.5 uppercase tracking-wider"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className="border border-gray-300 px-3 py-1.5 rounded text-xs font-semibold hover:border-brand hover:text-brand"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-2 border-t text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount (10%)</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-950">
                <span>Total Due</span>
                <span className="text-brand">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Security reassurance */}
          <div className="bg-[#fbf9f6] p-4 rounded-lg border border-brand/15 text-xs text-gray-700 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-brand">
              <FiTruck />
              <span>Express Delivery across Pakistan</span>
            </div>
            <p className="text-[11px] text-gray-500">
              You will receive an SMS and WhatsApp confirmation with your tracking reference upon order placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
