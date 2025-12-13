import Header from '@/components/Header';
import Footer from '@/components/Footer';

const steps = [
  {
    title: 'Signup',
    description:
      'Create your landlord account and unlock the smart dashboard. Get started in minutes with a simple registration process.',
    details: [
      'Enter your name and email',
      'Create a secure password',
      'Verify your account',
      'Access your dashboard',
    ],
  },
  {
    title: 'Add Property',
    description:
      'Add property details, photos, and tenant information in minutes. Organize all your properties in one place.',
    details: [
      'Enter property address and details',
      'Upload photos and documents',
      'Add unit information',
      'Link tenants to properties',
    ],
  },
  {
    title: 'Manage Everything',
    description:
      'Handle rent, tenants, maintenance, and documents from one unified workspace. Everything you need in one place.',
    details: [
      'Track rent payments and dues',
      'Manage tenant profiles',
      'Handle maintenance tickets',
      'Store and organize documents',
    ],
  },
];

export default function HowItWorksPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
            How It Works
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
            From Signup to Full Control
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Three straightforward steps to get every property, tenant, and process under control.
          </p>
        </div>

          <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
            >
              <div className="absolute right-4 top-4 text-6xl font-black text-white/5">
                0{index + 1}
              </div>
              <div className="relative grid gap-8 md:grid-cols-[200px_1fr]">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl font-semibold text-cyan-200">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{step.title}</h3>
                </div>
                <div>
                  <p className="text-lg text-slate-300">{step.description}</p>
                  <ul className="mt-4 space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-400" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-slate-900 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Ready to Get Started?</h2>
          <p className="mt-2 text-slate-300">
            Join landlords who are already managing their properties with X&apos;Immo.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 sm:w-auto"
            >
              Sign Up Free
            </a>
            <a
              href="/features"
              className="w-full rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100 sm:w-auto"
            >
              Explore Features
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

