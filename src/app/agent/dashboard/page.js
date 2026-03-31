'use client';

import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { MOCK_AGENT, MOCK_WORKERS } from '@/lib/constants';
import { formatINR } from '@/lib/utils';

export default function AgentDashboardPage() {
  const pendingWorkers = MOCK_WORKERS.filter((w) => !w.verified.police);
  const verifiedWorkers = MOCK_WORKERS.filter((w) => w.verified.police && w.verified.aadhaar && w.verified.storeVouch);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-fadeIn">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            🏪 Agent Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{MOCK_AGENT.storeName}</h1>
          <p className="text-white/40 text-sm mt-1">{MOCK_AGENT.location}</p>
        </div>
        <Button className="shrink-0">
          📷 Scan & Onboard Worker
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="👷" value={MOCK_AGENT.workersVouched} label="Workers Vouched" trend={15} />
        <StatsCard icon="⏳" value={MOCK_AGENT.pendingVerification} label="Pending Verification" />
        <StatsCard icon="💰" value={formatINR(MOCK_AGENT.commissionEarned)} label="Commission Earned" trend={22} />
        <StatsCard icon="📊" value="₹750" label="Avg Monthly Earning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Worker List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Verification */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Pending Verification ({pendingWorkers.length})
            </h2>
            <div className="space-y-3">
              {pendingWorkers.map((worker, i) => (
                <GlassCard key={worker.id} className={`animate-slideUp delay-${(i + 1) * 100}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                         style={{ background: 'var(--gradient-amber)' }}>
                      {worker.skillIcon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{worker.name}</h3>
                      <p className="text-xs text-white/40">{worker.skill} · {worker.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        ✓ Verify
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition-all">
                        Details
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Verified Workers */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Verified Workers ({verifiedWorkers.length})
            </h2>
            <div className="space-y-3">
              {verifiedWorkers.map((worker, i) => (
                <GlassCard key={worker.id} className={`animate-slideUp delay-${(i + 2) * 100}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                         style={{ background: 'var(--gradient-emerald)' }}>
                      {worker.skillIcon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{worker.name}</h3>
                      <p className="text-xs text-white/40">{worker.skill} · {worker.id}</p>
                    </div>
                    <span className="badge-verified">{worker.safetyScore}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Commission Tracker */}
        <div className="space-y-6">
          <GlassCard className="animate-slideUp delay-200">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Commission Tracker</h3>
            <div className="space-y-3">
              {MOCK_AGENT.monthlyEarnings.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-8">{item.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5">
                    <div className="h-full rounded-full"
                         style={{
                           width: `${(item.amount / 1000) * 100}%`,
                           background: 'var(--gradient-amber)',
                         }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-12 text-right">{formatINR(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Total Earned</span>
                <span className="text-sm font-bold text-amber-400">{formatINR(MOCK_AGENT.commissionEarned)}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="animate-slideUp delay-300">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--gradient-amber)' }}>
                📷 Scan & Onboard New Worker
              </button>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                📋 Request Police Verification
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
