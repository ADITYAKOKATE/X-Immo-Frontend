'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Ticket {
  _id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  property?: { _id: string; title: string };
  tenant?: { _id: string; name: string };
  createdAt: string;
}

export default function TicketsPage() {
  const { data: tickets, error, isLoading } = useSWR<Ticket[]>('/api/v1/tickets', fetcher);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats = useMemo(() => {
    if (!tickets) return { open: 0, progress: 0, high: 0, resolved: 0 };
    return {
      open: tickets.filter((t) => t.status === 'open').length,
      progress: tickets.filter((t) => t.status === 'in_progress').length,
      high: tickets.filter((t) => t.priority === 'high' && t.status !== 'closed').length,
      resolved: tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (filterStatus === 'all') return tickets;
    return tickets.filter((t) => t.status === filterStatus);
  }, [tickets, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>High Priority</span>;
      case 'medium': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-400"><span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>Medium</span>;
      case 'low': return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-400"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Low</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Maintenance Tickets</h1>
          <p className="mt-2 text-slate-400">Track and resolve property issues</p>
        </div>
        <Link
          href="/dashboard/tickets/new"
          className="w-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:shadow-red-500/30 md:w-auto"
        >
          ➕ Create Ticket
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm font-medium text-slate-400">Open Tickets</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.open}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-yellow-500/10 p-5">
          <p className="text-sm font-medium text-yellow-200">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">{stats.progress}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-red-500/10 p-5">
          <p className="text-sm font-medium text-red-200">High Priority</p>
          <p className="mt-2 text-3xl font-bold text-red-400">{stats.high}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-emerald-500/10 p-5">
          <p className="text-sm font-medium text-emerald-200">Resolved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${filterStatus === status
              ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading tickets...</div>
        </div>
      )}

      {!isLoading && filteredTickets.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">🎫</div>
          <p className="text-slate-400">No tickets found.</p>
          {filterStatus !== 'all' && (
            <button onClick={() => setFilterStatus('all')} className="mt-2 text-sm text-cyan-400 hover:text-cyan-300">Clear filters</button>
          )}
        </div>
      )}

      {!isLoading && filteredTickets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:bg-white/5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </div>
                  {getPriorityBadge(ticket.priority)}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-cyan-400 transition">{ticket.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{ticket.description || 'No description provided.'}</p>

                <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">
                  {ticket.property && (
                    <div className="flex items-center gap-2">
                      <span>🏠</span> <span>{ticket.property.title}</span>
                    </div>
                  )}
                  {ticket.tenant && (
                    <div className="flex items-center gap-2">
                      <span>👤</span> <span>{ticket.tenant.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>📅</span> <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/dashboard/tickets/${ticket._id}`}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 hover:text-cyan-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
