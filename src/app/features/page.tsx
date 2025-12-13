import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GetStartedButton from '@/components/GetStartedButton';

const features = [
  {
    title: 'Property Listing',
    description:
      'Publish rich property profiles with photos, documents, and essential details landlords need at a glance. Organize multiple units, track occupancy, and maintain comprehensive property records.',
    icon: '🏠',
    color: 'cyan',
  },
  {
    title: 'Tenant Management',
    description:
      'Organized tenant records with documents, agreements, and clear occupancy status. Track lease terms, contact information, and tenant history in one centralized system.',
    icon: '👥',
    color: 'indigo',
  },
  {
    title: 'Rent Tracker',
    description:
      'Track monthly rent, deposits, payment history, and overdue reminders without spreadsheets. Automate rent collection tracking and get instant visibility into payment status.',
    icon: '💵',
    color: 'emerald',
  },
  {
    title: 'Maintenance Tickets',
    description:
      'Simple ticket workflow for tenants and landlords with status tracking, SLAs, and quick updates. Manage maintenance requests efficiently with priority levels and attachment support.',
    icon: '🔧',
    color: 'orange',
  },
  {
    title: 'Document Storage',
    description:
      'Secure uploads for leases, IDs, insurance, and statements—always accessible when needed. Keep all property and tenant documents organized and easily retrievable.',
    icon: '📂',
    color: 'purple',
  },
  {
    title: 'Smart Dashboard',
    description:
      'A unified command center surfacing portfolio health, dues, and tickets in real time. Get instant insights into your property management operations with key performance indicators.',
    icon: '⚡',
    color: 'blue',
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-12 top-12 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute right-20 top-10 h-96 w-96 rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
            >
              ← Back to home
            </Link>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
            Core Features
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
            Everything You Need to Manage Properties
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            X'Immo provides a complete suite of tools to streamline your property management
            operations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 transition-all hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100`} />
              <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-white/5 blur-2xl transition group-hover:bg-cyan-500/10" />

              <div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-inner text-3xl mb-6 group-hover:scale-110 transition duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-slate-900 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Ready to Get Started?</h2>
          <p className="mt-2 text-slate-300">
            Start managing your properties with X'Immo today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <GetStartedButton />
            <a
              href="/contact"
              className="min-w-[140px] rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
