import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import EmptyState from '../components/EmptyState';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data));
  }, []);

  if (orders === null) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        subtitle="Once you place an order, it will show up here."
        action={<Link to="/" className="btn-primary">Start Shopping</Link>}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="block border rounded-lg p-4 hover:shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                {o.status}
              </span>
            </div>
            <p className="text-sm mt-2">{o.items.length} item(s) &middot; Rs. {o.total.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
