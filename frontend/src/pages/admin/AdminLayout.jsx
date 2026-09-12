import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiTag, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="space-y-1">
        <div className="mb-4">
          <p className="font-heading font-bold text-lg">Admin Panel</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                isActive ? 'bg-brand text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <l.icon /> {l.label}
          </NavLink>
        ))}
        {user?.role === 'superadmin' && (
          <NavLink
            to="/admin/create-admin"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                isActive ? 'bg-brand text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <FiUserPlus /> Create Admin
          </NavLink>
        )}
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
