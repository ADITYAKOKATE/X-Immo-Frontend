'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

interface PropertyForm {
  title: string;
  address?: string;
  description?: string;
  type: string;
  status: string;
  monthlyRent: string;
  size: string;
  amenities: string[];
  photos: string[];
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch property');
  return response.json();
};

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: property, error } = useSWR<PropertyForm & { _id: string, monthlyRent: number, size: number }>(
    id ? `/api/v1/properties/${id}` : null,
    fetcher
  );

  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    address: '',
    description: '',
    type: 'Apartment',
    status: 'Available',
    monthlyRent: '',
    size: '',
    amenities: [],
    photos: [],
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const AMENITIES_LIST = ['Parking', 'Gym', 'Pool', 'WiFi', 'Elevator', 'Security', 'Balcony', 'Garden', 'AC', 'Heating'];
  const PROPERTY_TYPES = ['Apartment', 'House', 'Commercial', 'Condo'];
  const STATUS_TYPES = ['Available', 'Rented', 'Maintenance'];

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        address: property.address || '',
        description: property.description || '',
        type: property.type || 'Apartment',
        status: property.status || 'Available',
        monthlyRent: property.monthlyRent ? String(property.monthlyRent) : '',
        size: property.size ? String(property.size) : '',
        amenities: property.amenities || [],
        photos: property.photos || [],
      });
    }
  }, [property]);

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), data.url] }));
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    const payload = {
      ...formData,
      monthlyRent: Number(formData.monthlyRent),
      size: Number(formData.size),
    };

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      setSubmitError(errorData.message || 'Failed to update property');
      setLoading(false);
      return;
    }

    router.push(`/dashboard/properties/${id}`);
  };

  if (!property && !error) return <div className="p-10 text-center text-slate-400">Loading property...</div>;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Edit Property</h1>
        <p className="mt-2 text-slate-400">Update property details and features</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
        {submitError && (
          <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-sm text-red-200">{submitError}</div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-cyan-200">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-white">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                >
                  {STATUS_TYPES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white">Size (sq ft)</label>
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Media & Amenities */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-cyan-200">Media & Features</h2>

            {/* Photos */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Property Photos</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-slate-400 file:hidden hover:bg-white/10 cursor-pointer"
                  accept="image/*"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                  {uploading ? 'Uploading...' : 'Click to Upload Image'}
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {formData.photos.map((photo, idx) => (
                    <div key={photo + idx} className="group relative overflow-hidden rounded-xl border border-white/10 aspect-video">
                      <img src={photo} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                        className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${formData.amenities.includes(amenity)
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
