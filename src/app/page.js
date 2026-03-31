import Link from 'next/link';
import PillarCard from '@/components/PillarCard';
import { ROLE_CONFIG, SERVICES, IMPACT_STATS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="relative">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-hero min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />

        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#6366f1]/10 blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#10b981]/8 blur-[120px] animate-float delay-300" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-8 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            India&apos;s First Phygital Service Platform
          </div>

          {/* Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 animate-slideUp">
            Trust{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Digitized
            </span>
            ,<br />
            Skills{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-emerald)' }}>
              Recognized
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/50 leading-relaxed mb-10 animate-slideUp delay-200">
            Connecting verified local talent with trusted households through our neighborhood hardware store hubs. 
            Every worker verified, every service trusted.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp delay-300">
            <Link
              href="/marketplace"
              className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Find a Worker →
            </Link>
            <Link
              href="/worker/register"
              className="px-8 py-3.5 rounded-xl text-white/80 font-semibold text-sm bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25 transition-all"
            >
              Register as Worker / Partner
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THREE PILLARS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-fadeIn">
            Choose Your Path
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Whether you&apos;re looking for trusted services, building your career, or becoming a verification hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(ROLE_CONFIG).map(([key, role], index) => (
            <PillarCard
              key={key}
              icon={role.icon}
              tagline={role.tagline}
              description={role.description}
              cta={role.cta}
              ctaLink={role.ctaLink}
              color={role.color}
              delay={String((index + 1) * 100)}
            />
          ))}
        </div>
      </section>

      {/* ===== SERVICE CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Services We Cover</h2>
          <p className="text-white/40">Verified professionals across all essential trades</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="glass rounded-2xl p-6 text-center hover-lift group cursor-pointer"
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                {service.icon}
              </span>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== IMPACT COUNTER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeIn">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{IMPACT_STATS.verifiedHubs}+</div>
              <div className="text-sm text-white/40">Verified Hubs</div>
            </div>
            <div className="animate-fadeIn delay-100">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{IMPACT_STATS.professionals.toLocaleString()}+</div>
              <div className="text-sm text-white/40">Professionals</div>
            </div>
            <div className="animate-fadeIn delay-200">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{IMPACT_STATS.safetyIncidents}</div>
              <div className="text-sm text-white/40">Safety Incidents</div>
            </div>
            <div className="animate-fadeIn delay-300">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{IMPACT_STATS.citiesActive}+</div>
              <div className="text-sm text-white/40">Cities Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
             style={{ background: 'var(--gradient-primary)' }}>
          <div className="absolute inset-0 bg-[url(\'data:image/svg+xml;base64,...\')] opacity-10" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to Join the Trust Network?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8 relative z-10">
            Register today and be part of India&apos;s largest verified service community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/worker/register" className="px-8 py-3.5 rounded-xl bg-white text-[#4f46e5] font-semibold text-sm hover:bg-white/90 transition-all">
              Create Worker Profile
            </Link>
            <Link href="/agent/register" className="px-8 py-3.5 rounded-xl bg-white/20 text-white font-semibold text-sm border border-white/30 hover:bg-white/30 transition-all">
              Partner as Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
