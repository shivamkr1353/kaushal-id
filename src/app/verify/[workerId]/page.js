import { MOCK_WORKERS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import TrustGauge from '@/components/TrustGauge';
import TrustBadges from '@/components/TrustBadges';
import QRGenerator from '@/components/QRGenerator';

export const metadata = {
  title: 'Worker Verification — Kaushal-ID',
  description: 'View real-time verified worker details and safety score.',
};

export default async function VerifyWorkerPage({ params }) {
  const { workerId } = await params;
  // In production, fetch from Supabase. Using mock data for scaffold.
  const worker = MOCK_WORKERS.find((w) => w.id === workerId) || MOCK_WORKERS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Status Bar */}
      <div className="badge-verified inline-flex items-center gap-2 mb-8 animate-fadeIn">
        <span>✅</span>
        <span>IDENTITY VERIFIED & ACTIVE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Worker Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="glass rounded-2xl p-6 animate-slideUp">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                   style={{ background: 'var(--gradient-primary)' }}>
                {worker.skillIcon}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">{worker.name}</h1>
                <p className="text-white/40 text-sm mb-2">{worker.id}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-white/60">{worker.skill}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/60">{worker.experience}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/60">{worker.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Score Gauge */}
          <div className="glass rounded-2xl p-8 text-center animate-slideUp delay-100">
            <h2 className="text-lg font-semibold text-white mb-6">Safety Index</h2>
            <TrustGauge score={worker.safetyScore} size={220} />
          </div>

          {/* Verification Checklist */}
          <div className="glass rounded-2xl p-6 animate-slideUp delay-200">
            <h2 className="text-lg font-semibold text-white mb-4">Trust Evidence</h2>
            <TrustBadges verified={worker.verified} />

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-sm text-white/40">
                🔏 Electronically Verified by{' '}
                <span className="text-white/70 font-medium">{worker.agentName}</span> on{' '}
                <span className="text-white/70">{formatDate(worker.verifiedDate)}</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 animate-slideUp delay-300">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-amber-400 mb-1">★ {worker.rating}</div>
              <div className="text-xs text-white/40">{worker.totalReviews} reviews</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-white mb-1">{worker.repeatHireRate}%</div>
              <div className="text-xs text-white/40">Repeat Hire Rate</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-white mb-1">{worker.experience}</div>
              <div className="text-xs text-white/40">Experience</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="glass rounded-2xl p-6 text-center animate-slideUp delay-100">
            <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Scan to Verify</h3>
            <QRGenerator
              value={`https://kaushal-id.vercel.app/verify/${worker.id}`}
              size={160}
            />
            <p className="text-xs text-white/30 mt-3">Live Safety Score</p>
          </div>

          {/* Badges */}
          <div className="glass rounded-2xl p-6 animate-slideUp delay-200">
            <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Badges Earned</h3>
            <div className="flex flex-wrap gap-2">
              {worker.badges.map((badge, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/5">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 animate-slideUp delay-300">
            <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <a href={`tel:${worker.phone || '+919876543210'}`} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 text-center block"
                      style={{ background: 'var(--gradient-emerald)' }}>
                📞 Call Now
              </a>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                ⭐ View Reviews
              </button>
            </div>
          </div>

          {/* Joining Info */}
          <div className="glass-subtle rounded-2xl p-5 animate-slideUp delay-400">
            <p className="text-xs text-white/30">
              Member since {formatDate(worker.joinDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
