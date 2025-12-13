'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function NewRentPage() {
    const router = useRouter();

    // Fetch Data
    const { data: properties } = useSWR('/api/v1/properties', fetcher);
    // We fetch all tenants initially, then filter locally for speed and reactivity
    const { data: allTenants } = useSWR('/api/v1/tenants', fetcher);

    const [formData, setFormData] = useState({
        property: '',
        tenant: '',
        amount: '',
        startDate: new Date().toISOString().split('T')[0], // Default to today
        deposit: '',
        notes: '',
    });

    const [availableTenants, setAvailableTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // SMART LINKING: When Property changes
    useEffect(() => {
        if (formData.property && properties && allTenants) {
            // 1. Filter Tenants who live in this property
            // Note: Tenant objects have a 'property' field which is an object { _id, title } or ID string
            const residents = allTenants.filter((t: any) => {
                const pId = t.property?._id || t.property;
                return pId === formData.property;
            });
            setAvailableTenants(residents);

            // 2. Auto-fill Rent Amount
            const selectedProp = properties.find((p: any) => p._id === formData.property);
            if (selectedProp && selectedProp.monthlyRent) {
                setFormData(prev => ({ ...prev, amount: String(selectedProp.monthlyRent) }));
            }
        } else {
            setAvailableTenants([]);
        }
    }, [formData.property, properties, allTenants]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.property || !formData.tenant) {
            setError('Please select a property and tenant');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                property: formData.property,
                tenant: formData.tenant,
                amount: Number(formData.amount),
                deposit: Number(formData.deposit) || 0,
                dueDate: formData.startDate,
                notes: formData.notes
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to create rent record');
            setLoading(false);
            return;
        }

        router.push('/dashboard/rent');
    };

    return (
        <div className="p-6 lg:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-white">Record Rent</h1>
                <p className="mt-2 text-slate-400">Log a new rent payment expectation</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>
                )}

                <div className="space-y-8">
                    {/* Section 1: Who and Where */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="property" className="block text-sm font-semibold text-white">
                                Property <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="property"
                                required
                                value={formData.property}
                                onChange={(e) => setFormData({ ...formData, property: e.target.value, tenant: '' })} // Reset tenant on property change
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
                                Tenant <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="tenant"
                                required
                                disabled={!formData.property}
                                value={formData.tenant}
                                onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white disabled:opacity-50 focus:border-cyan-400/50 focus:outline-none"
                            >
                                <option value="" className="bg-slate-900">
                                    {!formData.property ? 'Select Property First' : 'Select Tenant'}
                                </option>
                                {availableTenants.map((t: any) => (
                                    <option key={t._id} value={t._id} className="bg-slate-900">
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                            {formData.property && availableTenants.length === 0 && (
                                <p className="mt-1 text-xs text-orange-400">No active tenants found in this property.</p>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Financials */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Payment Details</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-semibold text-white">
                                    Rent Amount ($) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    required
                                    min="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-semibold text-white">
                                    Due Date <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div>
                                <label htmlFor="deposit" className="block text-sm font-semibold text-white">
                                    Security Deposit (Optional)
                                </label>
                                <input
                                    type="number"
                                    id="deposit"
                                    min="0"
                                    value={formData.deposit}
                                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-semibold text-white">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                            placeholder="Check #, Bank Transfer Ref, etc."
                        />
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
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 sm:flex-1"
                        >
                            {loading ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
