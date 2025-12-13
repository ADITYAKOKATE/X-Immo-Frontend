'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function TenantProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const { data: tenant, error, isLoading } = useSWR(
        id ? `/api/v1/tenants/${id}` : null,
        fetcher
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20';
            case 'vacant':
                return 'bg-slate-500/20 text-slate-300 border-slate-500/20';
            case 'notice':
                return 'bg-orange-500/20 text-orange-200 border-orange-500/20';
            case 'evicted':
                return 'bg-red-500/20 text-red-200 border-red-500/20';
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/20';
        }
    };

    if (isLoading) return <div className="text-center py-20 text-slate-400">Loading profile...</div>;
    if (error) return <div className="text-center py-20 text-red-400">Failed to load tenant.</div>;
    if (!tenant) return null;

    return (
        <div className="p-6 lg:p-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="rounded-full bg-white/5 p-3 text-slate-400 hover:bg-white/10 hover:text-white transition">
                        ←
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-slate-800">
                            {tenant.profilePhoto ? (
                                <img src={tenant.profilePhoto} alt={tenant.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl">👤</div>
                            )}
                        </div>
                        <div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{tenant.name}</h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(tenant.status)}`}>
                                        {tenant.status}
                                    </span>
                                    <span className="text-sm text-slate-400">• {tenant.employmentStatus}</span>
                                    {tenant.property && (
                                        <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                                            🏠 {tenant.property.title || 'Property'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link
                    href={`/dashboard/tenants/${id}/edit`}
                    className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* Contact Info */}
                    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                        <h2 className="mb-6 text-xl font-semibold text-white">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Email</span>
                                <span className="text-white">{tenant.email || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Phone</span>
                                <span className="text-white">{tenant.phone || '-'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Employment & Financial */}
                    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                        <h2 className="mb-6 text-xl font-semibold text-white">Financial Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-2xl bg-white/5 p-4">
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Monthly Income</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-400">₹{tenant.monthlyIncome?.toLocaleString() || 0}</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-4">
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Rent Status</p>
                                <p className="mt-1 text-xl font-bold text-white">Good Standing</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Lease Details */}
                    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                        <h2 className="mb-6 text-xl font-semibold text-white">Lease Agreement</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Start Date</span>
                                <span className="text-white">{new Date(tenant.leaseStart).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">End Date</span>
                                <span className="text-white">{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-4 rounded-xl bg-orange-500/10 p-4 border border-orange-500/20">
                                <p className="text-sm text-orange-200">
                                    ℹ Lease expires in {Math.ceil((new Date(tenant.leaseEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contact */}
                    {tenant.emergencyContact && (
                        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                            <h2 className="mb-6 text-xl font-semibold text-white">Emergency Contact</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-xl">🆘</div>
                                <div>
                                    <p className="font-bold text-white">{tenant.emergencyContact.name}</p>
                                    <p className="text-sm text-slate-400">{tenant.emergencyContact.relation} • {tenant.emergencyContact.phone}</p>
                                </div>
                            </div>
                        </section>

                    )}

                    {/* Documents */}
                    {tenant.documents && tenant.documents.length > 0 && (
                        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                            <h2 className="mb-6 text-xl font-semibold text-white">Documents & Identity</h2>
                            <div className="space-y-3">
                                {tenant.documents.map((doc: any, index: number) => (
                                    <a
                                        key={index}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10 hover:border-cyan-500/30 group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl group-hover:bg-cyan-500/20">
                                                📄
                                            </div>
                                            <div className="truncate">
                                                <p className="font-semibold text-white truncate text-sm" title={doc.name}>{doc.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Uploaded'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">View</span>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Notes */}
                    {tenant.notes && (
                        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                            <h2 className="mb-4 text-xl font-semibold text-white">Notes</h2>
                            <p className="text-slate-300 leading-relaxed">{tenant.notes}</p>
                        </section>
                    )}
                </div>
            </div>
        </div >
    );
}
