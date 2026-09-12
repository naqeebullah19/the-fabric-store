import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const emptyForm = {
  name: '', description: '', fabric: '', category: '', pieces: 1,
  price: '', compareAtPrice: '', isFeatured: false, isBestSeller: false, isNewArrival: false,
  variants: [{ size: 'M', color: 'Black', stock: 10 }],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);

  const load = () => {
    api.get('/products/admin/all').then((r) => setProducts(r.data.products));
    api.get('/categories/admin/all').then((r) => setCategories(r.data));
  };
  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (p) => {
    setForm({
      name: p.name, description: p.description, fabric: p.fabric,
      category: p.category?._id || '', pieces: p.pieces, price: p.price,
      compareAtPrice: p.compareAtPrice, isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival,
      variants: p.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock })),
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'variants') fd.append(k, JSON.stringify(v));
      else fd.append(k, v);
    });
    images.forEach((img) => fd.append('images', img));

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const updateVariant = (i, key, value) => {
    const next = [...form.variants];
    next[i] = { ...next[i], [key]: value };
    setForm({ ...form, variants: next });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">Products</h1>
        <button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="border rounded-lg p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Product Name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="input" required value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input className="input" placeholder="Fabric (e.g. Lawn, Chiffon)" value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            <input className="input" type="number" placeholder="Pieces" value={form.pieces}
              onChange={(e) => setForm({ ...form, pieces: e.target.value })} />
            <input className="input" type="number" placeholder="Price (Rs.)" required value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" type="number" placeholder="Compare-at Price (Rs.)" value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
          </div>
          <textarea className="input" placeholder="Description" rows={2} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div className="flex gap-4 text-sm">
            {['isFeatured', 'isBestSeller', 'isNewArrival'].map((k) => (
              <label key={k} className="flex items-center gap-1">
                <input type="checkbox" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />
                {k.replace('is', '')}
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Variants (size / color / stock)</p>
            {form.variants.map((v, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input className="input py-1 text-sm" placeholder="Size" value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)} />
                <input className="input py-1 text-sm" placeholder="Color" value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)} />
                <input className="input py-1 text-sm" type="number" placeholder="Stock" value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} />
              </div>
            ))}
            <button type="button" className="text-xs text-brand"
              onClick={() => setForm({ ...form, variants: [...form.variants, { size: '', color: '', stock: 0 }] })}>
              + Add variant
            </button>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Image URLs (comma or line separated)</p>
            <textarea
              className="input text-xs"
              placeholder="https://images.unsplash.com/... (one URL per line)"
              rows={2}
              value={form.imageUrls || ''}
              onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Or Upload Local Images</p>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} />
          </div>

          <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Create Product'}</button>
        </form>
      )}

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3"><img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded" /></td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name}</td>
                <td className="p-3">Rs. {p.price.toLocaleString()}</td>
                <td className="p-3">{p.totalStock <= 0 ? <span className="text-red-500">Out of stock</span> : p.totalStock}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => startEdit(p)} className="text-brand">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
