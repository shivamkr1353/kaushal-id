'use client';

import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import TrustGauge from '@/components/TrustGauge';
import QRGenerator from '@/components/QRGenerator';
import { MOCK_WORKERS, ONBOARDING_STEPS, PRICING } from '@/lib/constants';
import { formatINR } from '@/lib/utils';

export default function WorkerDashboardPage() {
  // Using first mock worker as the logged-in worker
  const worker = MOCK_WORKERS[0];
  const amortizationProgress = (worker.amortizationPaid / PRICING.verificationCost) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-8 animate-fadeIn">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          👷 Worker Dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {worker.name}</h1>
        <p className="text-white/40 text-sm mt-1">{worker.id} · {worker.skill}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="⭐" value={worker.rating} label="Rating" trend={3} />
        <StatsCard icon="📝" value={worker.totalReviews} label="Total Reviews" trend={12} />
        <StatsCard icon="🔄" value={`${worker.repeatHireRate}%`} label="Repeat Hire Rate" />
        <StatsCard icon="🏆" value={worker.badges.length} label="Badges Earned" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card with Gauge */}
          <div className="glass-strong rounded-2xl p-8 animate-slideUp">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-3"
                     style={{ background: 'var(--gradient-emerald)' }}>
                  {worker.skillIcon}
                </div>
                <span className="badge-verified">Active</span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white mb-1">{worker.name}</h2>
                <p className="text-sm text-white/40 mb-4">{worker.skill} · {worker.experience} · {worker.location}</p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {worker.badges.map((badge, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 text-white/50 border border-white/5">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <TrustGauge score={worker.safetyScore} size={160} />
            </div>
          </div>

          {/* Phygital Process */}
          <div className="animate-slideUp delay-100">
            <h2 className="text-lg font-semibold text-white mb-6">The Phygital Onboarding Process</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ONBOARDING_STEPS.map((step, i) => {
                const isCompleted = i < 4; // All steps completed for this mock worker
                return (
                  <GlassCard key={step.step} className={`relative animate-slideUp delay-${(i + 1) * 100}`}>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-xs">✓</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                           style={{ background: isCompleted ? 'var(--gradient-emerald)' : 'rgba(255,255,255,0.05)' }}>
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Step {step.step}</span>
                        <h3 className="text-sm font-semibold text-white mt-0.5">{step.title}</h3>
                        <p className="text-xs text-white/40 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Amortization Tracker */}
          <GlassCard className="animate-slideUp delay-300">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Verification Cost Recovery
            </h3>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-white">{formatINR(worker.amortizationPaid)}</span>
              <span className="text-sm text-white/30 mb-1">/ {formatINR(PRICING.verificationCost)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 mb-3">
              <div className="h-full rounded-full transition-all duration-1000"
                   style={{ width: `${amortizationProgress}%`, background: 'var(--gradient-emerald)' }}
              />
            </div>
            <p className="text-xs text-white/30">
              {formatINR(PRICING.amortizationPerHiring)} deducted per hiring · {Math.ceil((PRICING.verificationCost - worker.amortizationPaid) / PRICING.amortizationPerHiring)} hirings remaining
            </p>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <GlassCard className="text-center animate-slideUp delay-100">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Your Kaushal-ID QR</h3>
            <QRGenerator
              value={`https://kaushal-id.in/verify/${worker.id}`}
              size={140}
            />
            <p className="text-xs text-white/30 mt-3">Share with customers for instant verification</p>
          </GlassCard>

          {/* Subscription CTA */}
          <div className="relative overflow-hidden rounded-2xl p-6 text-center animate-slideUp delay-200"
               style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-3xl block mb-3">🚀</span>
            <h3 className="text-base font-bold text-white mb-2">Boost Your Visibility</h3>
            <p className="text-xs text-white/60 mb-4">
              Get featured in top results and receive more referrals
            </p>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white text-[#4f46e5] hover:bg-white/90 transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Profile Completion */}
          <GlassCard className="animate-slideUp delay-300">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Profile Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Basic Info', done: true },
                { label: 'Aadhaar Verification', done: worker.verified.aadhaar },
                { label: 'Police Clearance', done: worker.verified.police },
                { label: 'Store Vouching', done: worker.verified.storeVouch },
                { label: 'Profile Photo', done: false },
                { label: 'Proof of Work', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    item.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'
                  }`}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span className={`text-sm ${item.done ? 'text-white/60' : 'text-white/30'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
