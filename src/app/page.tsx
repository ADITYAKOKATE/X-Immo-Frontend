import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import Tenant from "@/models/Tenant";
import Ticket from "@/models/Ticket";
import GetStartedButton from "@/components/GetStartedButton";
import CountUp from "@/components/CountUp";
import FadeIn from "@/components/FadeIn";


const keyFeatures = [
  {
    title: "Property Listing",
    description: "Publish rich property profiles with photos, docs, and essentials landlords need at a glance.",
    icon: "🏠",
    color: "cyan",
  },
  {
    title: "AI Automation",
    description: "Automated reminders for rent, renewals, and maintenance follow-ups—built to cut manual work.",
    icon: "🤖",
    color: "indigo",
  },
  {
    title: "Smart Dashboard",
    description: "A unified command center surfacing portfolio health, dues, and tickets in real time.",
    icon: "⚡",
    color: "emerald",
  },
];



const operations = [
  {
    title: "Tenant Management",
    description:
      "Organized records, documents, and agreements with a clear view of occupancy status.",
  },
  {
    title: "Rent Tracker",
    description:
      "Track monthly rent, deposits, payment history, and overdue reminders without spreadsheets.",
  },
  {
    title: "Maintenance Tickets",
    description:
      "Simple ticket workflow for tenants and landlords with status, SLAs, and quick updates.",
  },
  {
    title: "Document Storage",
    description:
      "Secure uploads for leases, IDs, insurance, and statements—always accessible when needed.",
  },
];

const workspaceShortcuts = [
  {
    title: "Properties",
    description: "Add units, upload docs, and track occupancy in one place.",
    href: "/dashboard/properties",
    badge: "Dashboard",
  },
  {
    title: "Tenants",
    description: "Manage tenant records, leases, and communication threads.",
    href: "/dashboard/tenants",
    badge: "Workspace",
  },
  {
    title: "Rent",
    description: "Monitor dues, log payments, and nudge tenants automatically.",
    href: "/dashboard/rent",
    badge: "Billing",
  },
  {
    title: "Tickets",
    description: "Create and resolve maintenance requests with real-time status.",
    href: "/dashboard/tickets",
    badge: "Support",
  },
];

const liveActionBadges = [
  { label: "Real-time sync", detail: "Dashboard, rent, and tickets stay live." },
  { label: "Secure by default", detail: "Data encrypted end-to-end in transit and at rest." },
  { label: "Automation-first", detail: "Reminders, nudges, and SLAs run on autopilot." },
];

const automationHighlights = [
  {
    title: "Automation Studio",
    description: "Configure rent nudges, SLA escalations, and move-in tasks once—run forever.",
    pill: "New",
  },
  {
    title: "Health Signals",
    description: "Surface risk on overdue rent, expiring leases, and slow ticket response automatically.",
    pill: "Live",
  },
  {
    title: "Docs AI Guard",
    description: "Smart extraction for lease details and IDs to reduce manual entry and errors.",
    pill: "AI",
  },
];

const steps = [
  {
    title: "Signup",
    description: "Create your landlord account and unlock the smart dashboard.",
  },
  {
    title: "Add Property",
    description: "Add property details, photos, and tenant information in minutes.",
  },
  {
    title: "Manage Everything",
    description:
      "Handle rent, tenants, maintenance, and documents from one unified workspace.",
  },
];

const liveHighlights = [
  { label: "Properties live", helper: "Your total properties sync here in real time." },
  { label: "Occupancy", helper: "Live occupancy updates once you connect your data." },
  { label: "Rent collected", helper: "Shows month-to-date collections from your portfolio." },
  { label: "Active tickets", helper: "Open maintenance items stream from your workspace." },
];

export default async function Home() {
  await connectDB();
  const totalProperties = await Property.countDocuments({});
  const totalUsers = await User.countDocuments({ role: 'landlord' });

  // Calculate growth (new this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newProperties = await Property.countDocuments({ createdAt: { $gte: startOfMonth } });
  const newUsers = await User.countDocuments({ role: 'landlord', createdAt: { $gte: startOfMonth } });

  const prevProperties = totalProperties - newProperties;
  const prevUsers = totalUsers - newUsers;

  const propGrowth = prevProperties > 0 ? Math.round((newProperties / prevProperties) * 100) : (totalProperties > 0 ? 100 : 0);
  const userGrowth = prevUsers > 0 ? Math.round((newUsers / prevUsers) * 100) : (totalUsers > 0 ? 100 : 0);

  // Fetch recent users for avatar stack (limit 3)
  const recentJoiners = await User.find({ role: 'landlord' }).sort({ createdAt: -1 }).limit(3).select('name');

  // Calculate Operational Metrics
  const totalTenants = await Tenant.countDocuments({});
  const activeTickets = await Ticket.countDocuments({ status: { $ne: 'closed' } });

  const occupancyRate = totalProperties > 0 ? Math.round((totalTenants / totalProperties) * 100) : 0;
  // Cap at 100% for visual sanity if tenants > properties (shared units etc)
  const displayOccupancy = Math.min(occupancyRate, 100);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none gradient-grid absolute inset-0 -z-10">
        <div className="absolute left-12 top-12 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px] floating" />
        <div className="absolute right-20 top-10 h-96 w-96 rounded-full bg-indigo-500/15 blur-[140px] floating-delayed" />
        <div className="absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px] floating" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-0 lg:py-20">
        <section
          id="home"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-500/10 sm:p-8 md:p-12"
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent" />
            <div className="relative grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-cyan-200">
                Built for modern landlords
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-6">
                <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  X&apos;Immo: Smart Property Management Platform
                </h1>
                <p className="max-w-2xl text-lg text-slate-300">
                  Manage properties, tenants, rent tracking, and maintenance in one system. Automate
                  the busywork, keep documents organized, and see portfolio health in real time.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <GetStartedButton />
                <Link
                  href="/how-it-works"
                  className="w-full rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-200 sm:w-auto"
                >
                  See How It Works
                </Link>
              </div>
              <div className="hidden flex-wrap items-center gap-3 md:flex">
                {liveActionBadges.map((item) => (
                  <div
                    key={item.label}
                    className="shimmer-border relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <div className="leading-tight">
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>



            </div>

            <div className="relative flex flex-col gap-6">
              <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />

              {/* Properties Visual (Building Icons) */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-500/5 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Properties Managed</p>
                    <p className="text-2xl font-bold text-white"><CountUp end={totalProperties} /></p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                    <span>↑ {propGrowth}%</span>
                  </div>
                </div>

                <div className="relative flex h-32 w-full items-end gap-2 overflow-hidden pb-2">
                  {/* Dynamically show up to 10 icons */}
                  {Array.from({ length: Math.min(totalProperties || 1, 10) }).map((_, i) => (
                    <div key={i} className="group relative flex h-20 w-16 flex-col justify-end">
                      <div
                        className="h-full w-full rounded-t-lg border-x-2 border-t-2 border-cyan-500/30 bg-cyan-500/10 transition-all group-hover:bg-cyan-500/20 animate-bar-grow"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="absolute bottom-2 left-2 right-2 grid gap-1.5">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-sm bg-cyan-400/40" />
                            <span className="h-2 w-2 rounded-sm bg-cyan-400/40" />
                          </div>
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-sm bg-cyan-400/40" />
                            <span className="h-2 w-2 rounded-sm bg-cyan-400/40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {totalProperties > 10 && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">
                      +{totalProperties - 10}
                    </div>
                  )}
                  {totalProperties === 0 && (
                    <div className="flex w-full items-center justify-center text-sm text-slate-500">
                      No properties yet
                    </div>
                  )}
                </div>
              </div>

              {/* Users Visual (Avatar Stack) */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/5 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Active Landlords</p>
                    <p className="text-2xl font-bold text-white"><CountUp end={totalUsers} /></p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400">
                    <span>↑ {userGrowth}%</span>
                  </div>
                </div>

                <div className="flex h-32 items-center gap-4">
                  <div className="flex -space-x-4">
                    {recentJoiners.map((user: any, i: number) => (
                      <div key={user._id} className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 bg-indigo-500 text-sm font-bold text-white shadow-lg ring-2 ring-indigo-500/20">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : 'NM'}
                      </div>
                    ))}
                    {totalUsers > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-xs font-medium text-slate-300">
                        +{totalUsers - 3}
                      </div>
                    )}
                  </div>
                  {totalUsers === 0 && <p className="text-sm text-slate-500">Be the first!</p>}
                  {totalUsers > 0 && (
                    <p className="text-xs font-medium text-slate-400">
                      {totalUsers > 3 ? `and ${totalUsers - 3} others` : 'joined recently'}
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </section >



        <FadeIn delay={100}>
          <section id="features" className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
                  Core features
                </p>
                <h2 className="text-3xl font-semibold text-white">All-in-one command center</h2>
                <p className="mt-2 max-w-2xl text-slate-300">
                  X&apos;Immo centralizes every asset, tenant, and transaction so landlords can act with
                  speed and certainty.
                </p>
              </div>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 underline-offset-4 hover:underline"
              >
                Explore full feature suite
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {keyFeatures.map((feature) => (
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

                  <div className="mt-6 flex items-center text-sm font-semibold text-cyan-300 opacity-0 transform translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Learn more <span className="ml-2">→</span>
                  </div>
                </div>
              ))}
            </div>

          </section>

        </FadeIn>

        <FadeIn delay={200}>
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-indigo-500/5 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-200">
                  Operational excellence
                </p>
                <h2 className="text-3xl font-semibold text-white">Everything organized, nothing missed</h2>
                <p className="text-slate-300">
                  Tenant profiles, rent tracking, maintenance tickets, and secure documents stay in
                  sync—so you always know what’s due, what’s resolved, and what needs your attention.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {operations.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-slate-900 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Portfolio Health</p>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                      Live System Status
                    </span>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center">
                    <div className="relative h-48 w-48">
                      {/* Outer Ring */}
                      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="40"
                          fill="transparent"
                          stroke="rgb(6, 182, 212)"
                          strokeWidth="8"
                          strokeDasharray={`${(displayOccupancy / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        />
                        <circle
                          cx="50" cy="50" r="40"
                          fill="transparent"
                          stroke="rgb(99, 102, 241)"
                          strokeWidth="8"
                          strokeDasharray="50 251.2"
                          strokeDashoffset="-205"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Inner Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{displayOccupancy}%</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Occupancy</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-8 grid w-full grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                        <div className="h-2 w-2 rounded-full bg-cyan-400" />
                        <div>
                          <p className="text-xs text-slate-400">Occupancy</p>
                          <p className="font-semibold text-white">High</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <div>
                          <p className="text-xs text-slate-400">Rent Status</p>
                          <p className="font-semibold text-white">On Track</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:block">
                  <p className="text-sm font-semibold text-white">Why landlords pick X&apos;Immo</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Eliminate manual record-keeping and scattered spreadsheets.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      Simplify tenant, rent, maintenance, and document workflows.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      Get full visibility through the smart dashboard, anytime.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </section>
        </FadeIn>

        <FadeIn delay={200}>
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-cyan-500/10 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
                  New & improved
                </p>
                <h2 className="text-3xl font-semibold text-white">Automation that feels invisible</h2>
                <p className="mt-2 max-w-2xl text-slate-300">
                  Set it once, monitor in real time, and let the platform handle the busywork with clear,
                  professional guardrails.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
              >
                Launch workspace
                <span aria-hidden>↗</span>
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {automationHighlights.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-slate-900/60 to-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/5 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">{item.title}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">
                      {item.pill}
                    </span>
                  </div>
                  <p className="relative mt-3 text-sm text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <section id="workspace" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
                Start managing now
              </p>
              <h2 className="text-3xl font-semibold text-white">Jump into your workspace</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Go directly to properties, tenants, rent, or maintenance tickets without leaving the
                home page.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
            >
              Open dashboard
              <span aria-hidden>↗</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workspaceShortcuts.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/5 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">
                    {item.badge}
                  </span>
                </div>
                <p className="relative mt-2 text-sm text-slate-300">{item.description}</p>
                <p className="relative mt-4 text-xs font-semibold text-cyan-200">
                  Go to {item.title}
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>



        <FadeIn delay={200}>
          <section id="how-it-works" className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
                  How it works
                </p>
                <h2 className="text-3xl font-semibold text-white">From signup to full control</h2>
                <p className="mt-2 max-w-2xl text-slate-300">
                  Three straightforward steps to get every property, tenant, and process under control.
                </p>
              </div>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 underline-offset-4 hover:underline"
              >
                Detailed walkthrough
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6"
                >
                  <div className="absolute right-4 top-4 text-5xl font-black text-white/5">
                    0{index + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-base font-semibold text-cyan-200">
                    Step {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>


        <FadeIn delay={200}>
          <section id="about" className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-cyan-500/5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-200">
                About X&apos;Immo
              </p>
              <h2 className="text-3xl font-semibold text-white">Purpose-built for property leaders</h2>
              <p className="text-slate-300">
                X&apos;Immo is an all-in-one property management solution designed to help landlords manage
                real estate operations digitally and effortlessly.
              </p>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">We solve the hard parts:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Eliminates manual record-keeping and tracking errors.</li>
                  <li>• Simplifies tenant and rent management with automation.</li>
                  <li>• Provides easy access to documents and maintenance workflows.</li>
                  <li>• Delivers complete visibility through a smart dashboard.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Our vision</p>
                <p className="mt-2 text-sm text-slate-300">
                  Create a future where property management is fully automated, transparent, and
                  stress-free for landlords and tenants.
                </p>
              </div>
            </div>

            <div className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-slate-900 p-6 lg:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">System Activity</p>
                  <p className="text-xs text-slate-400">Live request processing</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>

              <div className="relative mt-6 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-4">
                {/* World Map Backdrop (Abstract) */}
                <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 200">
                  <path d="M50 100 Q 100 50 150 100 T 250 100 T 350 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
                  <path d="M20 120 Q 80 160 140 120 T 260 120 T 380 120" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600" />
                  <path d="M80 60 Q 160 20 240 60 T 400 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />

                  {/* Grid lines */}
                  <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                  <line x1="300" y1="0" x2="300" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                </svg>

                {/* Activity Pulses */}
                <div className="absolute left-[30%] top-[40%]">
                  <span className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative flex h-2 w-2 rounded-full bg-cyan-500" />
                </div>
                <div className="absolute left-[60%] top-[60%]">
                  <span className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative flex h-2 w-2 rounded-full bg-indigo-500" />
                </div>
                <div className="absolute left-[80%] top-[30%]">
                  <span className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative flex h-2 w-2 rounded-full bg-emerald-500" />
                </div>

                {/* Processing Stat */}
                <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400">Active Maintenance</p>
                  <p className="font-mono text-sm font-semibold text-emerald-400">{activeTickets}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                “With X&apos;Immo, we always know what's due, what's delayed, and who needs a nudge.”
              </div>
            </div>
          </section>

          <section
            id="get-started"
            className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-slate-900 p-6 text-center shadow-xl shadow-cyan-500/10 sm:p-8"
          >
            <div className="mx-auto max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
                Ready to modernize
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Manage properties, tenants, rent, maintenance, and documents—beautifully.
              </h2>
              <p className="text-slate-200">
                Start with the smart dashboard, import your properties, and automate the busywork in
                under an hour.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Talk to us
                </Link>
                <Link
                  href="/features"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
                >
                  Explore features
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>
      </main >

      <Footer />
    </div >
  );
}
