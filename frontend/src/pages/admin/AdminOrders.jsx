import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    api.get('/orders/admin/all', { params: { status: filter || undefined } }).then((r) => setOrders(r.data.orders));
  };
  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/admin/${id}/status`, { status });
    toast.success('Order status updated');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">Orders</h1>
        <select className="input w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="p-3">{o.user?.name}<br /><span className="text-xs text-gray-400">{o.user?.email}</span></td>
                <td className="p-3">Rs. {o.total.toLocaleString()}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="input py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
