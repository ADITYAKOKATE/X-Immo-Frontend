'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface RentPayment {
  _id: string;
  amount: number;
  deposit?: number;
  dueDate: string;
  paid: boolean;
  paidAt?: string;
  property?: {
    _id: string;
    title: string;
  };
  tenant?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function RentPage() {
  const { data: payments, error, isLoading, mutate } = useSWR<RentPayment[]>(
    '/api/v1/rent',
    fetcher
  );

  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Stats Calculation
  const stats = useMemo(() => {
    if (!payments) return { total: 0, collected: 0, pending: 0, rate: 0 };

    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const collected = payments.filter(p => p.paid).reduce((acc, curr) => acc + curr.amount, 0);
    const pending = total - collected;
    const rate = total > 0 ? Math.round((collected / total) * 100) : 0;

    return { total, collected, pending, rate };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    if (filter === 'all') return payments;
    return payments.filter(p => (filter === 'paid' ? p.paid : !p.paid));
  }, [payments, filter]);

  const handleTogglePaid = async (id: string, currentPaid: boolean) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/rent/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paid: !currentPaid }),
    });

    if (response.ok) {
      mutate();
    }
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString()}`;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Rent Tracking</h1>
          <p className="mt-2 text-slate-400">Financial overview and payment history</p>
        </div>
        <Link
          href="/dashboard/rent/new"
          className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:shadow-cyan-500/30 md:w-auto"
        >
          💰 Record Payment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm font-medium text-slate-400">Total Expected</p>
          <p className="mt-2 text-2xl font-bold text-white">{formatCurrency(stats.total)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-emerald-500/10 p-5">
          <p className="text-sm font-medium text-emerald-200">Collected</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{formatCurrency(stats.collected)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-orange-500/10 p-5">
          <p className="text-sm font-medium text-orange-200">Pending</p>
          <p className="mt-2 text-2xl font-bold text-orange-400">{formatCurrency(stats.pending)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm font-medium text-slate-400">Collection Rate</p>
          <div className="flex items-center gap-2">
            <p className="mt-2 text-2xl font-bold text-white">{stats.rate}%</p>
            <div className="mt-2 h-2 w-16 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-emerald-500" style={{ width: `${stats.rate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'paid', 'unpaid'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${filter === f
              ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading payments...</div>
        </div>
      )}

      {!isLoading && filteredPayments.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-400">No rent records found based on current filters.</p>
        </div>
      )}

      {!isLoading && filteredPayments.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date Due</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tenant</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {new Date(payment.dueDate).toLocaleDateString()}
                      {new Date(payment.dueDate) < new Date() && !payment.paid && (
                        <span className="ml-2 inline-flex items-center text-[10px] text-red-400 font-bold uppercase">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                          {payment.tenant?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{payment.tenant?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">{payment.tenant?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {payment.property?.title || 'Unknown Property'}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${payment.paid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                        {payment.paid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleTogglePaid(payment._id, payment.paid)}
                        className={`text-xs font-bold uppercase tracking-wide transition ${payment.paid
                          ? 'text-orange-400 hover:text-orange-300'
                          : 'text-emerald-400 hover:text-emerald-300'
                          }`}
                      >
                        {payment.paid ? 'Mark Unpaid' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
