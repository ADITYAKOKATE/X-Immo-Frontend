'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Ticket {
    _id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    property?: { _id: string; title: string; address: string };
    tenant?: { _id: string; name: string; email: string; phone: string };
    createdAt: string;
    attachments?: string[];
    updates?: {
        message: string;
        createdAt: string;
        sender: string;
    }[];
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [updating, setUpdating] = useState(false);

    const { data: ticket, error, isLoading, mutate } = useSWR<Ticket>(
        id ? `/api/v1/tickets/${id}` : null,
        fetcher
    );

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/v1/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                mutate();
            }
        } catch (err) {
            console.error('Failed to update status', err);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'resolved': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-orange-400';
            case 'low': return 'text-blue-400';
            default: return 'text-slate-400';
        }
    };

    if (isLoading) return <div className="text-center py-20 text-slate-400">Loading ticket details...</div>;
    if (error) return <div className="text-center py-20 text-red-400">Failed to load ticket.</div>;
    if (!ticket) return null;

    return (
        <div className="p-6 lg:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                    <Link href="/dashboard/tickets" className="mt-1 text-slate-400 hover:text-white transition">
                        ←
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority} Priority
                            </span>
                            <span className="text-xs text-slate-500">
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="mt-2 text-3xl font-semibold text-white">{ticket.title}</h1>
                    </div>
                </div>

                <div className="flex gap-2">
                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <button
                            onClick={() => handleStatusChange('resolved')}
                            disabled={updating}
                            className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50"
                        >
                            Mark Resolved
                        </button>
                    )}
                    {ticket.status !== 'closed' && (
                        <button
                            onClick={() => handleStatusChange('closed')}
                            disabled={updating}
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600 disabled:opacity-50"
                        >
                            Close Ticket
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-8">
                    {/* Description */}
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Description</h2>
                        <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                            {ticket.description || 'No detailed description provided.'}
                        </p>
                    </div>

                    {/* Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                            <h2 className="mb-4 text-lg font-semibold text-white">Attachments</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {ticket.attachments.map((url, idx) => (
                                    <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/30"
                                    >
                                        <div className="aspect-video bg-slate-800">
                                            <img src={url} alt="Attachment" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                            <p className="text-sm font-medium text-white">View Image ↗</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Property Info */}
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                        <h2 className="mb-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">Property Details</h2>
                        {ticket.property ? (
                            <div>
                                <Link href={`/dashboard/properties/${ticket.property._id}`} className="block group">
                                    <p className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">{ticket.property.title}</p>
                                    <p className="text-sm text-slate-400">{ticket.property.address}</p>
                                </Link>
                            </div>
                        ) : (
                            <p className="text-slate-500">Unassigned</p>
                        )}
                    </div>

                    {/* Tenant Info */}
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                        <h2 className="mb-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">Reported By</h2>
                        {ticket.tenant ? (
                            <Link href={`/dashboard/tenants/${ticket.tenant._id}`} className="flex items-center gap-3 group">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 text-lg group-hover:bg-slate-700">
                                    👤
                                </div>
                                <div>
                                    <p className="font-semibold text-white group-hover:text-cyan-400 transition">{ticket.tenant.name}</p>
                                    <p className="text-xs text-slate-400">{ticket.tenant.email}</p>
                                </div>
                            </Link>
                        ) : (
                            <p className="text-slate-500">Unknown Tenant</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
