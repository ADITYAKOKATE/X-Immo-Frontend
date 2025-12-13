'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

interface Property {
  _id: string;
  title: string;
  address?: string;
  photos: string[];
  type: string;
  status: string;
  monthlyRent: number;
  size: number;
  amenities: string[];
  units: any[];
}

import { fetcher } from '@/lib/fetcher';

export default function PropertiesPage() {
  const { data: properties, error, isLoading, mutate } = useSWR<Property[]>(
    '/api/v1/properties',
    fetcher
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/properties/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      mutate();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Properties</h1>
          <p className="mt-2 text-slate-400">Manage your property portfolio</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30 md:w-auto"
        >
          ➕ Add Property
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/20 p-4 text-red-200">
          Failed to load properties. Please try again.
        </div>
      )}

      {properties && properties.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-400">No properties yet. Add your first property to get started.</p>
          <Link
            href="/dashboard/properties/new"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Add Property
          </Link>
        </div>
      )}

      {properties && properties.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 transition-all hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                {property.photos && property.photos.length > 0 ? (
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-slate-500">
                    No Image
                  </div>
                )}
                <div className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {property.status || 'Available'}
                </div>
                <div className="absolute left-3 top-3 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-bold text-slate-950 backdrop-blur-md">
                  {property.type || 'Property'}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-white line-clamp-1">{property.title}</h3>
                  <span className="shrink-0 text-lg font-bold text-emerald-400">
                    ₹{property.monthlyRent?.toLocaleString() || 0}<span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                </div>

                {property.address && (
                  <p className="mt-1 line-clamp-1 text-sm text-slate-400">📍 {property.address}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {property.size > 0 && (
                    <span className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300">
                      📏 {property.size} sqft
                    </span>
                  )}
                  {property.units && property.units.length > 0 && (
                    <span className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300">
                      🏢 {property.units.length} Units
                    </span>
                  )}
                  {property.amenities?.slice(0, 3).map(a => (
                    <span key={a} className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300">
                      ✅ {a}
                    </span>
                  ))}
                  {property.amenities && property.amenities.length > 3 && (
                    <span className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300">
                      +{property.amenities.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex gap-3 pt-6 border-t border-white/5">
                  <Link
                    href={`/dashboard/properties/${property._id}`}
                    className="flex-1 rounded-lg bg-white/5 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/10"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/properties/${property._id}/edit`}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="rounded-lg border border-red-500/20 px-4 py-2.5 text-red-400 hover:bg-red-500/10"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

