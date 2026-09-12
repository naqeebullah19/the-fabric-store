import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-heading font-bold text-brand">404</h1>
      <p className="text-gray-500 mt-2">Page not found.</p>
      <Link to="/" className="btn-primary inline-block mt-6">Back to Home</Link>
    </div>
  );
}
