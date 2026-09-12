import React, { useEffect, useState } from 'react';
import api from '../../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/orders/admin/stats').then((r) => setStats(r.data));
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders },
    { label: 'Total Revenue', value: stats ? `Rs. ${stats.totalRevenue.toLocaleString()}` : undefined },
    { label: 'Pending Orders', value: stats?.pendingOrders },
    { label: 'Total Products', value: stats?.totalProducts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-5">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value ?? <span className="skeleton inline-block h-6 w-12" />}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
