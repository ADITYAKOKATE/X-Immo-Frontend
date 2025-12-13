'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

interface Tenant {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
}

import { fetcher } from '@/lib/fetcher';

export default function TenantsPage() {
  const { data: tenants, error, isLoading, mutate } = useSWR<any[]>(
    '/api/v1/tenants',
    fetcher
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/tenants/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      mutate();
    }
  };

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

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Tenants</h1>
          <p className="mt-2 text-slate-400">Manage your valuable relationships</p>
        </div>
        <Link
          href="/dashboard/tenants/new"
          className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30 md:w-auto"
        >
          ➕ Add Tenant
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/20 p-4 text-red-200">
          Failed to load tenants. Please try again.
        </div>
      )}

      {tenants && tenants.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-400">No tenants yet. Add your first tenant to get started.</p>
          <Link
            href="/dashboard/tenants/new"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Add Tenant
          </Link>
        </div>
      )}

      {tenants && tenants.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tenants.map((tenant) => (
            <div
              key={tenant._id}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all hover:border-cyan-400/30 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="absolute right-4 top-4">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(tenant.status)}`}>
                  {tenant.status}
                </span>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-slate-800">
                  {tenant.profilePhoto ? (
                    <img src={tenant.profilePhoto} alt={tenant.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white max-w-[150px] truncate" title={tenant.name}>{tenant.name}</h3>
                  <p className="text-sm text-cyan-400">{tenant.employmentStatus || 'Tenant'}</p>
                  {tenant.property && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-400" title={tenant.property.title}>
                      🏠 {tenant.property.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 space-y-3 rounded-xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">📧</span>
                  <p className="truncate text-sm text-slate-300">{tenant.email || 'No email'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">📞</span>
                  <p className="truncate text-sm text-slate-300">{tenant.phone || 'No phone'}</p>
                </div>
                {tenant.monthlyIncome > 0 && (
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5 mt-2">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Income</span>
                    <p className="text-sm font-semibold text-emerald-400">₹{tenant.monthlyIncome.toLocaleString()}/mo</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-3 pt-2">
                <Link
                  href={`/dashboard/tenants/${tenant._id}`}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Profile
                </Link>
                <Link
                  href={`/dashboard/tenants/${tenant._id}/edit`}
                  className="rounded-xl border border-white/10 px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  ✎
                </Link>
                <button
                  onClick={() => handleDelete(tenant._id)}
                  className="rounded-xl border border-red-500/20 px-4 py-3 text-red-400 transition hover:bg-red-500/10"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

