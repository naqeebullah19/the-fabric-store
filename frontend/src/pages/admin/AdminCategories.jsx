import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = () => api.get('/categories/admin/all').then((r) => setCategories(r.data));
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', form);
      toast.success('Category created');
      setForm({ name: '', description: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Category deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Categories</h1>
      <form onSubmit={submit} className="border rounded-lg p-5 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Name</label>
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Description</label>
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary">Add</button>
      </form>
      <div className="border rounded-lg divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex justify-between items-center p-3 text-sm">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.description}</p>
            </div>
            <button onClick={() => remove(c._id)} className="text-red-500 text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
