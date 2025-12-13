import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GetStartedButton from '@/components/GetStartedButton';

export default function AboutPage() {
  const stats = [
    { label: 'For Independent', value: 'Landlords' },
    { label: 'For Professional', value: 'Managers' },
    { label: 'For Growing', value: 'Investors' },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in clear communication and open data. No hidden fees, no black boxes.',
      icon: '🔍',
      color: 'cyan',
    },
    {
      title: 'Automation',
      description: 'We automate the boring stuff so you can focus on growing your portfolio.',
      icon: '⚙️',
      color: 'indigo',
    },
    {
      title: 'Security',
      description: 'Bank-grade encryption for your documents and financial data.',
      icon: '🔒',
      color: 'emerald',
    },
    {
      title: 'Simplicity',
      description: 'Powerful tools shouldn’t be complicated. Design comes first.',
      icon: '✨',
      color: 'purple',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <Header />

      <main>
        {/* Hero Section */}
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:py-32">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Our Story
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Redefining Property Management <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              for the Modern Era
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            X'Immo was born from a simple frustration: managing properties is hard, but it doesn't have to be.
            We're building the operating system for the next generation of landlords.
          </p>
        </div>

        {/* Stats Section */}
        <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Mission</h2>
              <p className="text-lg leading-relaxed text-slate-300">
                We are on a mission to democratize professional property management tools. Whether you own one unit or one hundred,
                you deserve software that feels like extended intelligence, not a digital filing cabinet.
              </p>
              <div className="flex flex-col gap-4 border-l-2 border-cyan-500/30 pl-6">
                <blockquote className="text-xl font-medium text-white italic">
                  "The best property management software is the one you don't even notice you're using."
                </blockquote>
                <cite className="text-sm not-italic text-slate-400">— X'Immo</cite>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
              {/* Abstract Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-48 w-48 animate-pulse rounded-full bg-cyan-500/20 blur-3xl"></div>
                <div className="relative flex items-center justify-center h-full w-full">
                  {/* Concentric Circles representing Network/Reach */}
                  <div className="absolute h-[80%] w-[80%] rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute h-[60%] w-[60%] rounded-full border border-white/10" />
                  <div className="absolute h-[40%] w-[40%] rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]" />

                  {/* Center Core */}
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-2xl shadow-cyan-500/40 transform transition hover:scale-110 duration-500">
                    <span className="text-2xl font-bold text-white">XI</span>
                  </div>

                  {/* Satellite Nodes */}
                  <div className="absolute top-[20%] right-[25%] flex items-center gap-2 animate-bounce delay-700">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    <div className="hidden sm:block rounded bg-black/40 px-2 py-0.5 text-[10px] text-emerald-200 backdrop-blur-md">Rent Paid</div>
                  </div>

                  <div className="absolute bottom-[25%] left-[20%] flex items-center gap-2 animate-pulse">
                    <div className="hidden sm:block rounded bg-black/40 px-2 py-0.5 text-[10px] text-indigo-200 backdrop-blur-md">Ticket #124</div>
                    <div className="h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                  </div>

                  <div className="absolute top-[30%] left-[30%] h-1.5 w-1.5 rounded-full bg-white/50" />
                  <div className="absolute bottom-[20%] right-[20%] h-2 w-2 rounded-full bg-cyan-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white">Core Values</h2>
            <p className="mt-4 text-slate-400">The principles that drive every feature we build.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="group rounded-3xl border border-white/10 bg-slate-900/40 p-6 transition hover:bg-slate-900/60 hover:border-cyan-500/30">
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-${value.color}-500/10 text-2xl`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">{value.title}</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 text-center">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white">Join the Movement</h2>
            <p className="mt-4 text-lg text-slate-300">
              Experience the future of property management. It's time to reclaim your time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* Wrapped in a div to pass generic props correctly if needed, or stick to component */}
              <GetStartedButton />
              <a
                href="/contact"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-100"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
