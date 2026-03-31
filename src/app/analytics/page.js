import { IMPACT_STATS } from '@/lib/constants';

export const metadata = {
  title: 'Viksit Bharat & Analytics — Kaushal-ID',
  description: 'Impact metrics and analytics for India\'s verified service workforce.',
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heritage Header */}
      <div className="relative glass-strong rounded-3xl p-12 mb-12 overflow-hidden text-center animate-fadeIn">
        {/* Decorative mandala-like pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0deg 30deg, rgba(99,102,241,0.3) 30deg 60deg)`,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Viksit Bharat 🇮🇳
          </h1>
          <p className="text-white/50 text-base max-w-2xl mx-auto mb-2">
            Digitizing the Ancient Tradition of Vishwakarma (Craftsmanship)
          </p>
          <p className="text-white/30 text-sm max-w-xl mx-auto">
            Measuring the impact of organized, verified services on India&apos;s workforce.
          </p>
        </div>
      </div>

      {/* Impact Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: '🏪', value: `${IMPACT_STATS.verifiedHubs}+`, label: 'Verified Hubs', color: '#6366f1' },
          { icon: '👷', value: `${IMPACT_STATS.professionals.toLocaleString()}+`, label: 'Professionals', color: '#10b981' },
          { icon: '🛡️', value: `${IMPACT_STATS.safetyIncidents}`, label: 'Safety Incidents', color: '#f59e0b' },
          { icon: '🌆', value: `${IMPACT_STATS.citiesActive}+`, label: 'Cities Active', color: '#3b82f6' },
        ].map((stat, i) => (
          <div key={i} className={`glass rounded-2xl p-6 text-center hover-lift animate-slideUp delay-${(i + 1) * 100}`}>
            <span className="text-3xl block mb-3">{stat.icon}</span>
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Workers Growth Metrics */}
      <section className="mb-16 animate-slideUp delay-200">
        <h2 className="text-2xl font-bold text-white mb-8">Workers' Growth Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm text-white/50 mb-4 uppercase tracking-wider">Employability Rate</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-emerald-400">87%</span>
              <span className="text-sm text-emerald-400/60 mb-1">↑ 12% vs last quarter</span>
            </div>
            {/* Bar chart mock */}
            <div className="mt-6 flex items-end gap-2 h-24">
              {[45, 55, 62, 70, 78, 87].map((v, i) => (
                <div key={i} className="flex-1 rounded-t-md transition-all"
                     style={{
                       height: `${v}%`,
                       background: `linear-gradient(to top, rgba(16,185,129,0.3), rgba(16,185,129,${0.3 + i * 0.1}))`,
                     }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/20">Q1</span>
              <span className="text-[10px] text-white/20">Q6</span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm text-white/50 mb-4 uppercase tracking-wider">Average Trust Score</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-blue-400">84</span>
              <span className="text-sm text-blue-400/60 mb-1">/ 100</span>
            </div>
            <div className="mt-6 flex items-end gap-2 h-24">
              {[60, 65, 72, 76, 80, 84].map((v, i) => (
                <div key={i} className="flex-1 rounded-t-md transition-all"
                     style={{
                       height: `${v}%`,
                       background: `linear-gradient(to top, rgba(59,130,246,0.3), rgba(59,130,246,${0.3 + i * 0.1}))`,
                     }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/20">Month 1</span>
              <span className="text-[10px] text-white/20">Month 6</span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm text-white/50 mb-4 uppercase tracking-wider">Income Growth</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-amber-400">42%</span>
              <span className="text-sm text-amber-400/60 mb-1">avg increase</span>
            </div>
            <div className="mt-6 flex items-end gap-2 h-24">
              {[30, 35, 38, 40, 41, 42].map((v, i) => (
                <div key={i} className="flex-1 rounded-t-md transition-all"
                     style={{
                       height: `${v * 2.3}%`,
                       background: `linear-gradient(to top, rgba(245,158,11,0.3), rgba(245,158,11,${0.3 + i * 0.1}))`,
                     }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/20">Month 1</span>
              <span className="text-[10px] text-white/20">Month 6</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="mb-16 animate-slideUp delay-300">
        <h2 className="text-2xl font-bold text-white mb-8">Organized vs Unorganized Sector</h2>
        <div className="glass rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Unorganized */}
            <div>
              <h3 className="text-sm font-semibold text-red-400/80 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/30" />
                India&apos;s Informal Sector (Current)
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Identity Verification', value: 5 },
                  { label: 'Skill Certification', value: 8 },
                  { label: 'Customer Trust', value: 15 },
                  { label: 'Financial Access', value: 10 },
                  { label: 'Digital Presence', value: 3 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-red-400/60">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-red-500/40" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kaushal-ID Enabled */}
            <div>
              <h3 className="text-sm font-semibold text-emerald-400/80 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                Kaushal-ID Enabled Sector
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Identity Verification', value: 98 },
                  { label: 'Skill Certification', value: 85 },
                  { label: 'Customer Trust', value: 92 },
                  { label: 'Financial Access', value: 72 },
                  { label: 'Digital Presence', value: 95 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-emerald-400/80">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full transition-all duration-1000"
                           style={{ width: `${item.value}%`, background: 'var(--gradient-emerald)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="relative overflow-hidden rounded-3xl p-12 text-center animate-fadeIn"
               style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}>
        {/* Mandala decorative background */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0deg 15deg, rgba(255,255,255,0.5) 15deg 30deg)`,
               backgroundSize: '200px 200px',
               backgroundPosition: 'center',
             }}
        />
        <div className="relative z-10">
          <span className="text-5xl block mb-6">🏛️</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Digitizing the Ancient Tradition of Vishwakarma
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            For millennia, India&apos;s craftsmen have passed skills through generations. Kaushal-ID
            honors this heritage by bringing the same trust and mastery into the digital age — where
            every skill is recognized, every professional verified, and every household safe.
          </p>
        </div>
      </section>
    </div>
  );
}
