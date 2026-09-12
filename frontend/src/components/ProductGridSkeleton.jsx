import React from 'react';

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5] w-full" />
          <div className="skeleton h-3 w-3/4 mt-2" />
          <div className="skeleton h-3 w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}
