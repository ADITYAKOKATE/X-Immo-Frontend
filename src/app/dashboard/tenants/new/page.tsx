'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch properties for dropdown
  const { data: properties } = useSWR('/api/v1/properties', fetcher);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '', // Add property field
    status: 'active',
    employmentStatus: 'Employed',
    monthlyIncome: '',
    profilePhoto: '',
    leaseStart: '',
    leaseEnd: '',
    notes: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
    documents: [] as { name: string; url: string }[],
  });

  const EMPLOYMENT_STATUSES = ['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      monthlyIncome: Number(formData.monthlyIncome),
    };

    const token = localStorage.getItem('token');
    const response = await fetch('/api/v1/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to create tenant');
      setLoading(false);
      return;
    }

    router.push('/dashboard/tenants');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, profilePhoto: data.url }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      return await res.json();
    });

    try {
      const results = await Promise.all(uploadPromises);
      const newDocs = results.map((r, i) => ({
        name: files[i].name,
        url: r.url,
      }));
      setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
    } catch (err) {
      console.error(err);
      setError('One or more files failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Add New Tenant</h1>
        <p className="mt-2 text-slate-400">Onboard a new tenant to your properties</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Personal Info */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400">1</span>
                Personal Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-white">Select Property <span className="text-red-400">*</span></label>
                  <select
                    required
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="" className="bg-slate-900">Select a property...</option>
                    {properties?.map((p: any) => (
                      <option key={p._id} value={p._id} className="bg-slate-900">
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    {EMPLOYMENT_STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </section>

            {/* Emergency Contact */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400">2</span>
                Emergency Contact
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-white">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Relation</label>
                  <input
                    type="text"
                    value={formData.emergencyContact.relation}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relation: e.target.value } })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="Spouse, Parent..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="(555) 999-9999"
                  />
                </div>
              </div>
            </section>

            {/* Lease Info */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400">3</span>
                Lease Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-white">Lease Start Date</label>
                  <input
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white">Lease End Date</label>
                  <input
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-white">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                    placeholder="Any additional notes about the tenant..."
                  />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400">4</span>
                Documents & Identity
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📂</span>
                    <p className="text-sm font-medium text-white">Upload Leases, IDs, or Agreements</p>
                    <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleDocUpload}
                      disabled={uploading}
                      className="hidden"
                      id="doc-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                    />
                    <label
                      htmlFor="doc-upload"
                      className="mt-2 cursor-pointer rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-slate-700"
                    >
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </label>
                  </div>
                </div>

                {/* File List */}
                {formData.documents.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900 px-4 py-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-lg">📄</span>
                          <span className="truncate text-sm text-slate-300" title={doc.name}>{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDoc(index)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Photo & Actions */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <label className="block text-sm font-semibold text-white mb-4">Profile Photo</label>
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-white/20 bg-slate-900">
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-slate-600">👤</div>
                  )}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                  onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
                >
                  {uploading ? 'Uploading...' : 'Click to Upload'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50"
              >
                {loading ? 'Adding Tenant...' : 'Add Tenant'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
