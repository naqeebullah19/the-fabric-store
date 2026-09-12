import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTruck, FiBox, FiPhone, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import api from '../api/client';

const STEPS = [
  { key: 'Pending', label: 'Pending' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try public lookup first so guest orders work
    api
      .get(`/orders/lookup/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => {
        // Fallback to my order
        api
          .get(`/orders/my/${id}`)
          .then((r) => setOrder(r.data))
          .catch(() => null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-gray-500 font-body">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center font-body">
        <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">We could not retrieve this order. Please check your reference link.</p>
        <Link to="/track-order" className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6">
          Track An Order
        </Link>
      </div>
    );
  }

  const currentStep = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 font-body">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand mb-6">
        <FiArrowLeft />
        <span>Return to Store</span>
      </Link>

      {/* Confirmation Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 text-emerald-700 font-semibold mb-2">
          <FiCheckCircle className="text-2xl shrink-0" />
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-950">
            Thank You! Your Order is Confirmed
          </h1>
        </div>
        <p className="text-xs text-gray-600">
          Order Reference: <strong className="text-gray-900">{order.orderNumber || order._id}</strong>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Action Link to Track */}
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            to={`/track-order?orderNumber=${order.orderNumber || order._id}&phone=${order.shippingAddress?.phone || ''}`}
            className="text-brand font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            <FiTruck />
            <span>View Live Shipment Tracker &rarr;</span>
          </Link>

          <a
            href={`https://wa.me/923000606664?text=Hi%20TFS%2C%20inquiry%20regarding%20Order%20${order.orderNumber || order._id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline"
          >
            <FiMessageCircle />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Status Timeline */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gray-800 mb-6">
            Current Status: <span className="text-brand">{order.status}</span>
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center relative">
            {STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                    i <= currentStep ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i <= currentStep ? <FiCheckCircle /> : i + 1}
                </div>
                <span className={`text-[11px] font-semibold ${i <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200 text-xs mb-6">
          This order was marked as cancelled.
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6 space-y-4">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 pb-3 border-b">
          Items Ordered ({order.items?.length})
        </h3>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=100&q=80'}
                  alt=""
                  className="w-12 h-14 object-cover rounded bg-gray-100"
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[11px] text-gray-500">
                    {item.size || 'Standard'} {item.color ? `· ${item.color}` : ''} &middot; Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-900">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing totals */}
        <div className="border-t pt-3 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">Rs. {order.itemsTotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Nationwide Delivery</span>
            <span className="font-medium text-gray-900">
              {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between text-sm font-bold text-gray-950">
            <span>Total</span>
            <span className="text-brand">Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address & Payment */}
      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-1 text-gray-700">
          <h4 className="font-heading font-bold uppercase tracking-wider text-gray-900 mb-2">
            Delivery Destination
          </h4>
          <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.line1}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
          <p className="text-gray-500 pt-1">Phone: {order.shippingAddress?.phone}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-1 text-gray-700">
          <h4 className="font-heading font-bold uppercase tracking-wider text-gray-900 mb-2">
            Payment Mode
          </h4>
          <p className="font-bold text-gray-900">
            {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
          </p>
          <p className="text-gray-500">
            {order.paymentMethod === 'COD'
              ? 'Please have exact cash ready upon arrival of the courier rider.'
              : 'Please send IBFT screenshot to WhatsApp 0300-0606664 with your Order ID.'}
          </p>
        </div>
      </div>
    </div>
  );
}
