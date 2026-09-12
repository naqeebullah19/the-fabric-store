import React from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ value = 0, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar key={n} size={size} fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}
