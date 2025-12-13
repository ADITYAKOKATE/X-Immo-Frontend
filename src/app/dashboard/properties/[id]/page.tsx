'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

interface Property {
  _id: string;
  title: string;
  address?: string;
  description?: string;
  photos?: string[];
  createdAt?: string;
  type?: string;
  status?: string;
  monthlyRent?: number;
  size?: number;
  amenities?: string[];
}

interface Tenant {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  monthlyIncome?: number;
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return `₹${value.toLocaleString()}`;
};

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Property
  const {
    data: property,
    error: propertyError,
    isLoading: propertyLoading,
    mutate: mutateProperty,
  } = useSWR<Property>(`/api/v1/properties/${params.id}`, fetcher);

  // Fetch Tenants assigned to this property
  const {
    data: tenants,
    isLoading: tenantsLoading,
  } = useSWR<Tenant[]>(
    property?._id ? `/api/v1/tenants?property=${property._id}` : null,
    fetcher
  );

  const handleDelete = async () => {
    if (!property?._id) return;
    if (!confirm('Delete this property? This cannot be undone.')) return;

    setIsDeleting(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/properties/${property._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await mutateProperty(undefined, { revalidate: false });
      router.push('/dashboard/properties');
    } else {
      setIsDeleting(false);
    }
  };

  const mapLink = property?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`
    : undefined;

  const tenantCount = tenants?.length || 0;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Property Details</p>
            {property?.status && (
              <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${property.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' :
                property.status === 'Rented' ? 'bg-indigo-500/20 text-indigo-300' :
                  'bg-orange-500/20 text-orange-300'
                }`}>
                {property.status}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-white">{property?.title || 'Property'}</h1>
          {property?.address && <p className="mt-1 text-slate-400">{property.address}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/properties"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ← Back to list
          </Link>
          {property?._id && (
            <Link
              href={`/dashboard/properties/${property._id}/edit`}
              className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/60 hover:bg-cyan-400/20"
            >
              Edit
            </Link>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {propertyLoading && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
          Loading property details...
        </div>
      )}

      {propertyError && (
        <div className="rounded-xl bg-red-500/20 p-4 text-red-200">
          Failed to load property. Please try again.
        </div>
      )}

      {property && (
        <div className="space-y-8">
          {/* Main Info Grid */}
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Left: Photos & Description */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
                {property.photos?.length ? (
                  <div className={`grid gap-4 p-4 ${property.photos.length > 1 ? 'sm:grid-cols-[2fr,1fr]' : 'grid-cols-1'}`}>
                    <div className="relative h-72 overflow-hidden rounded-xl bg-white/5 sm:h-96">
                      <img
                        src={property.photos[0]}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {property.photos.length > 1 && (
                      <div className="grid h-72 grid-cols-1 gap-3 sm:h-96 sm:grid-cols-2">
                        {property.photos.slice(1, 4).map((photo, idx) => (
                          // Correct logic for slice and map
                          <div
                            key={photo + idx}
                            className="overflow-hidden rounded-xl border border-white/5 bg-white/5"
                          >
                            <img src={photo} alt={`Photo ${idx + 2}`} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-center text-slate-200">
                    <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                      No photos yet
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">About this property</h2>
                  {mapLink && (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      View on maps ↗
                    </a>
                  )}
                </div>
                <p className="mt-3 text-slate-200 leading-relaxed">
                  {property.description || 'No description provided for this property yet.'}
                </p>

                {/* Amenities List */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map(amenity => (
                        <span key={amenity} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                          ✅ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Key Details */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
                <div>
                  <p className="text-sm text-slate-400">Monthly Rent</p>
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(property.monthlyRent)}<span className="text-sm font-normal text-slate-400">/mo</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Type</p>
                    <p className="font-semibold text-white">{property.type || 'Property'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Size</p>
                    <p className="font-semibold text-white">{property.size ? `${property.size} sqft` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Tenants</p>
                    <p className="font-semibold text-white">{tenantCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="font-semibold text-white">{property.status}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500">Property ID: <span className="font-mono text-slate-400">{property._id}</span></p>
                  <p className="text-xs text-slate-500 mt-1">Added: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Residents / Tenants</h2>
              <p className="text-sm text-slate-400">People currently living in this property</p>
            </div>

            {tenantsLoading && <p className="mt-4 text-slate-400">Loading residents...</p>}

            {!tenantsLoading && tenantCount === 0 && (
              <div className="mt-6 text-center rounded-xl bg-white/5 p-8">
                <p className="text-slate-400">No active tenants linked to this property.</p>
                <Link href="/dashboard/tenants/new" className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300">
                  + Add a Tenant
                </Link>
              </div>
            )}

            {tenantCount > 0 && (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tenants?.map((tenant) => (
                  <div key={tenant._id} className="group relative rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{tenant.name}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tenant.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
                            }`}>
                            {tenant.status}
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/tenants/${tenant._id}`} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                        View
                      </Link>
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-slate-300 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Email</span>
                        <span className="text-slate-300">{tenant.email || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Phone</span>
                        <span className="text-slate-300">{tenant.phone || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
