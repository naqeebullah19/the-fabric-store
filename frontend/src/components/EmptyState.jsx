import React from 'react';

export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
