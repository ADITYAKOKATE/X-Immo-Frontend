'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function NewTicketPage() {
    const router = useRouter();
    const { data: properties } = useSWR('/api/v1/properties', fetcher);
    // Fetch all tenants, then filter client-side
    const { data: allTenants } = useSWR('/api/v1/tenants', fetcher);

    const [formData, setFormData] = useState({
        property: '',
        tenant: '',
        title: '',
        description: '',
        priority: 'medium',
        attachments: [] as string[],
    });

    const [availableTenants, setAvailableTenants] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // SMART LINKING
    useEffect(() => {
        if (formData.property && allTenants) {
            const residents = allTenants.filter((t: any) => {
                const pId = t.property?._id || t.property;
                return pId === formData.property;
            });
            setAvailableTenants(residents);
        } else {
            setAvailableTenants([]);
        }
    }, [formData.property, allTenants]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.property) {
            setError('Please select a property');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to create ticket');
            setLoading(false);
            return;
        }

        router.push('/dashboard/tickets');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formPayload = new FormData();
        formPayload.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/uploads', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formPayload,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Upload failed');
            }
            const data = await res.json();

            if (res.ok) {
                setFormData({ ...formData, attachments: [...(formData.attachments || []), data.url] });
            } else {
                alert('Upload failed');
                setError('Failed to upload file');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveAttachment = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((a) => a !== url),
        }));
    };

    return (
        <div className="p-6 lg:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-white">Create Ticket</h1>
                <p className="mt-2 text-slate-400">Report a new maintenance issue</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>
                )}

                <div className="space-y-8">
                    {/* Location Details */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="property" className="block text-sm font-semibold text-white">
                                Property <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="property"
                                required
                                value={formData.property}
                                onChange={(e) => setFormData({ ...formData, property: e.target.value, tenant: '' })}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                            >
                                <option value="" className="bg-slate-900">Select Property</option>
                                {properties?.map((p: any) => (
                                    <option key={p._id} value={p._id} className="bg-slate-900">
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tenant" className="block text-sm font-semibold text-white">
                                Tenant (Optional)
                            </label>
                            <select
                                id="tenant"
                                value={formData.tenant}
                                onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                                disabled={!formData.property}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white disabled:opacity-50 focus:border-cyan-400/50 focus:outline-none"
                            >
                                <option value="" className="bg-slate-900">
                                    {!formData.property ? 'Select Property First' : 'Select Tenant (or leave empty)'}
                                </option>
                                {availableTenants.map((t: any) => (
                                    <option key={t._id} value={t._id} className="bg-slate-900">
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                            {formData.property && availableTenants.length === 0 && (
                                <p className="mt-1 text-xs text-orange-400">No active tenants found here.</p>
                            )}
                        </div>
                    </div>

                    {/* Issue Details */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Issue Details</h2>

                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-white">
                                Issue Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                                placeholder="e.g., Leaky faucet in kitchen"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-white">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                                placeholder="Detailed description of the issue..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white">Priority</label>
                            <div className="mt-3 flex gap-4">
                                {['low', 'medium', 'high'].map((p) => (
                                    <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition ${formData.priority === p
                                        ? 'border-cyan-500 bg-cyan-500/20'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={p}
                                            checked={formData.priority === p}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="hidden"
                                        />
                                        <div className={`h-3 w-3 rounded-full ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}></div>
                                        <span className="capitalize text-slate-200 font-medium">{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-white">Attachments</label>
                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400 file:hidden hover:bg-white/10 transition border-dashed"
                                accept="image/*,application/pdf"
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition">
                                {uploading ? 'Uploading...' : 'Click to upload photos or documents'}
                            </div>
                        </div>

                        {formData.attachments.length > 0 && (
                            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                {formData.attachments.map((url, idx) => (
                                    <li key={url + idx} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm text-white border border-white/10">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-800">
                                                {/* Simple preview logic */}
                                                <img src={url} alt="" className="h-full w-full object-cover rounded opacity-80" />
                                            </div>
                                            <span className="truncate text-xs text-slate-300">Attachment {idx + 1}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(url)}
                                            className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-red-500/40 disabled:opacity-50 sm:flex-1"
                        >
                            {loading ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
