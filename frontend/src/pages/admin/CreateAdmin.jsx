import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function CreateAdmin() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/create-admin', form);
      toast.success('Admin account created');
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Create Admin (Super-admin only)</h1>
      <form onSubmit={submit} className="border rounded-lg p-5 max-w-md space-y-3">
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="btn-primary w-full">Create Admin</button>
      </form>
    </div>
  );
}
