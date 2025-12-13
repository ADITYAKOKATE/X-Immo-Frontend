'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

interface Activity {
  _id: string;
  type: 'ticket' | 'rent' | 'tenant';
  message: string;
  subtext: string;
  date: string;
  href: string;
}

interface DashboardSummary {
  totalProperties: number;
  totalTenants: number;
  rentDueThisMonth: number;
  activeTickets: number;
  recentActivity: Activity[];
}

import { fetcher } from '@/lib/fetcher';

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR<DashboardSummary>(
    '/api/v1/dashboard/summary',
    fetcher
  );

  const stats = [
    {
      label: 'Total Properties',
      value: data?.totalProperties ?? 0,
      icon: '🏠',
      color: 'cyan',
      href: '/dashboard/properties',
    },
    {
      label: 'Total Tenants',
      value: data?.totalTenants ?? 0,
      icon: '👥',
      color: 'indigo',
      href: '/dashboard/tenants',
    },
    {
      label: 'Rent Due This Month',
      value: `₹${data?.rentDueThisMonth?.toLocaleString() ?? 0}`,
      icon: '💰',
      color: 'emerald',
      href: '/dashboard/rent',
    },
    {
      label: 'Active Tickets',
      value: data?.activeTickets ?? 0,
      icon: '🎫',
      color: 'orange',
      href: '/dashboard/tickets',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket': return '🎫';
      case 'rent': return '💰';
      case 'tenant': return '👤';
      default: return '📝';
    }
  };

  return (
    <div className="relative overflow-hidden p-4 sm:p-6 lg:p-10">
      <div className="pointer-events-none gradient-grid absolute inset-0 -z-10">
        <div className="absolute left-10 top-0 h-56 w-56 rounded-full bg-cyan-500/15 blur-[120px] floating" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-indigo-500/15 blur-[140px] floating-delayed" />
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-cyan-500/10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-200">
            Live workspace
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-slate-400">Monitor properties, tenants, rent, and tickets in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
          >
            ← Back to home
          </Link>
          <Link
            href="/dashboard/properties/new"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30"
          >
            + Add property
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/20 p-4 text-red-200">
          Failed to load dashboard data. Please try again.
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-md shadow-cyan-500/5 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 shimmer-border"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-3xl">{stat.icon}</div>
                  <div
                    className={`h-2 w-2 rounded-full bg-${stat.color}-400 opacity-0 transition group-hover:opacity-100`}
                  />
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-cyan-200 underline-offset-4 group-hover:underline">
                  View details →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-indigo-500/10 p-4 sm:p-6 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">
                  Workspace
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <Link
                  href="/dashboard/properties/new"
                  className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10"
                >
                  ➕ Add New Property
                </Link>
                <Link
                  href="/dashboard/tenants/new"
                  className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10"
                >
                  ➕ Add New Tenant
                </Link>
                <Link
                  href="/dashboard/tickets/new"
                  className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10"
                >
                  ➕ Create Maintenance Ticket
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">
                  Live
                </span>
              </div>

              {!data.recentActivity || data.recentActivity.length === 0 ? (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">No recent activity.</p>
                  <p className="text-xs text-slate-500">Create properties or tickets to see them here.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.recentActivity.map((activity) => (
                    <Link
                      key={activity._id}
                      href={activity.href}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
                    >
                      <div className="flex items-start gap-3 w-full sm:w-auto">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0 sm:hidden">
                          <p className="truncate text-sm font-medium text-white">{activity.message}</p>
                          <p className="truncate text-xs text-slate-400">{activity.subtext}</p>
                        </div>
                      </div>

                      <div className="hidden sm:block flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">{activity.message}</p>
                        <p className="truncate text-xs text-slate-400">{activity.subtext}</p>
                      </div>

                      <div className="pl-11 sm:pl-0 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

