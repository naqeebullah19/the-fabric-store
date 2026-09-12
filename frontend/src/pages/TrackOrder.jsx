import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiTruck, FiSearch, FiCheckCircle, FiClock, FiBox, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/client';

const PIPELINE_STEPS = [
  { key: 'Pending', label: 'Order Received', desc: 'Your order has been logged in our system' },
  { key: 'Processing', label: 'In Verification & Packing', desc: 'Fabric inspected and parcel prepared' },
  { key: 'Shipped', label: 'Dispatched with Courier', desc: 'Handed over for nationwide delivery' },
  { key: 'Delivered', label: 'Delivered', desc: 'Successfully received by customer' },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchTracking = async (num, ph) => {
    if (!num.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/orders/track', {
        params: { orderNumber: num.trim(), phone: ph?.trim() || undefined },
      });
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      toast.error(err.response?.data?.message || 'Order not found. Please check your order reference.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialNum = searchParams.get('orderNumber');
    if (initialNum) {
      fetchTracking(initialNum, searchParams.get('phone'));
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderNumber, phone);
  };

  const getStepIndex = (status) => {
    const idx = PIPELINE_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-body">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-3 text-xl">
          <FiTruck />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gray-900">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Enter your TFS Order Number (e.g. <strong>TFS-593534</strong>) or phone number to check live shipment status.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 mb-10"
      >
        <div className="flex-1 space-y-2">
          <input
            type="text"
            required
            placeholder="Order Number (e.g. TFS-593534)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="input text-xs uppercase tracking-wider"
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-xs uppercase tracking-wider font-semibold py-3 px-6 h-fit self-stretch sm:self-auto flex items-center justify-center gap-2"
        >
          <FiSearch />
          <span>{loading ? 'Searching...' : 'Track'}</span>
        </button>
      </form>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-3">
            <div>
              <span className="text-xs text-brand uppercase font-bold tracking-widest">Order Details</span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                {order.orderNumber || `Order #${order._id.slice(-8).toUpperCase()}`}
              </h2>
              <p className="text-xs text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                Status: {order.status}
              </span>
              <p className="text-xs text-gray-600 mt-1 font-semibold">
                Total Amount: Rs. {order.total?.toLocaleString()} ({order.paymentMethod})
              </p>
            </div>
          </div>

          {/* Timeline Pipeline */}
          {order.status !== 'Cancelled' ? (
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gray-800 mb-6">
                Shipment Progress
              </h3>
              <div className="relative">
                {/* Horizontal Progress Bar for Desktop */}
                <div className="hidden sm:grid grid-cols-4 gap-2 relative z-10">
                  {PIPELINE_STEPS.map((step, i) => {
                    const activeIndex = getStepIndex(order.status);
                    const isCompleted = i <= activeIndex;
                    const isCurrent = i === activeIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center px-2">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                            isCompleted ? 'bg-brand text-white shadow-md' : 'bg-gray-100 text-gray-400 border'
                          }`}
                        >
                          {isCompleted ? <FiCheckCircle /> : i + 1}
                        </div>
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-brand' : 'text-gray-900'}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Line */}
                <div className="hidden sm:block absolute top-4 left-1/8 right-1/8 h-0.5 bg-gray-200 -z-0">
                  <div
                    className="bg-brand h-full transition-all duration-500"
                    style={{ width: `${(getStepIndex(order.status) / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded border border-red-200 text-red-700 text-xs">
              This order was marked as cancelled. For inquiries, please contact our support team at 0300-0606664.
            </div>
          )}

          {/* Items & Shipping Address Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t text-xs">
            <div>
              <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-3">
                Items in Package
              </h4>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-10 h-12 object-cover rounded bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.size || 'Standard'} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-gray-800">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold uppercase tracking-wider text-gray-900 mb-3">
                Delivery Destination
              </h4>
              <div className="p-4 rounded bg-gray-50 border border-gray-100 space-y-1 text-gray-700">
                <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.line1}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
                <p className="text-gray-500 mt-2">Contact: {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !loading && !order && (
        <div className="text-center py-8 text-xs text-gray-500">
          No records found for the details entered. Need help? Call WhatsApp Support at <strong>0300-0606664</strong>.
        </div>
      )}
    </div>
  );
}
