'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import TrustGauge from '@/components/TrustGauge';
import QRGenerator from '@/components/QRGenerator';
import VirtualIDCard from '@/components/VirtualIDCard';
import { ONBOARDING_STEPS, PRICING, SERVICES } from '@/lib/constants';
import { formatINR } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function WorkerDashboardPage() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkerData() {
      try {
        const supabase = createClient();

        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/worker/login');
          return;
        }

        // --- INJECT DUMMY DATA FOR SPECIFIC TEST ACCOUNT ---
        if (user.email === 'shivamkr997386@gmail.com') {
          setWorker({
            id: 'KID-2026-9912',
            name: user.user_metadata?.full_name || 'Shivam Kumar',
            photo: null,
            skill: user.user_metadata?.skill || 'Electrician',
            skillIcon: '💡',
            experience: `${user.user_metadata?.experience_years || 5} years`,
            joinDate: user.created_at,
            safetyScore: 98,
            rating: 4.9,
            totalReviews: 124,
            repeatHireRate: 85,
            verified: { aadhaar: true, police: true, storeVouch: true, storeName: 'Sharma Hardware' },
            agentName: 'Ramesh Sharma',
            verifiedDate: '2026-02-15',
            phone: user.user_metadata?.phone || '9876543210',
            location: user.user_metadata?.location || 'Mumbai',
            amortizationPaid: 15,
            badges: [
              { id: '1', name: 'Top Rated', icon: '⭐' },
              { id: '2', name: 'Punctual', icon: '⏱️' },
              { id: '3', name: 'Verified', icon: '🛡️' }
            ],
            isPending: false,
          });
          setLoading(false);
          return;
        }
        // ----------------------------------------------------


        // 2. Get profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // 3. Get worker record
        const { data: workerData, error: workerError } = await supabase
          .from('workers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        let finalWorkerData = workerData;

        if (workerError || !workerData) {
          // Worker record doesn't exist yet. Because they are now authenticated,
          // RLS will allow us to create the row here.
          const meta = user.user_metadata || {};
          const num = Math.floor(1000 + Math.random() * 9000);
          const newKaushalId = `KID-2026-${num}`;

          const { data: newWorker, error: insertError } = await supabase
            .from('workers')
            .insert({
              user_id: user.id,
              kaushal_id: newKaushalId,
              skill: meta.skill || 'Not Set',
              experience_years: parseInt(meta.experience_years) || 0,
              location: meta.location || null,
              phone: meta.phone || profile?.phone || '',
              is_active: true,
              safety_score: 0,
              rating: 0,
              total_reviews: 0,
              repeat_hire_rate: 0,
              amortization_paid: 0,
            })
            .select()
            .single();

          if (!insertError && newWorker) {
            finalWorkerData = newWorker;
            // Create verifications placeholder
            await supabase.from('verifications').insert({
              worker_id: newWorker.id,
              aadhaar_verified: false,
              police_verified: false,
              store_vouched: false,
              skill_verified: false,
            });
          } else {
            // If creation fails (e.g. table doesn't exist), fallback to pending view
            setWorker({
              id: 'Pending',
              name: meta.full_name || profile?.full_name || 'New Worker',
              photo: profile?.avatar_url || null,
              skill: meta.skill || 'Not Set',
              skillIcon: SERVICES.find(s => s.name === meta.skill)?.icon || '👷',
              experience: `${meta.experience_years || 0} years`,
              joinDate: user.created_at,
              safetyScore: 0,
              rating: 0,
              totalReviews: 0,
              repeatHireRate: 0,
              verified: { aadhaar: false, police: false, storeVouch: false, storeName: '' },
              agentName: '',
              verifiedDate: '',
              phone: meta.phone || profile?.phone || '',
              location: meta.location || '',
              amortizationPaid: 0,
              badges: [],
              isPending: true,
            });
            setLoading(false);
            return;
          }
        }

        // 4. Get verifications
        const { data: verification } = await supabase
          .from('verifications')
          .select('*')
          .eq('worker_id', finalWorkerData.id)
          .single();

        // 5. Get badges
        const { data: badges } = await supabase
          .from('badges')
          .select('*')
          .eq('worker_id', finalWorkerData.id);

        // 6. Build the worker object for the UI
        const skillIcon = SERVICES.find(s => s.name === finalWorkerData.skill)?.icon || '👷';

        setWorker({
          id: finalWorkerData.kaushal_id,
          name: profile?.full_name || user.user_metadata?.full_name || 'Worker',
          photo: profile?.avatar_url || null,
          skill: finalWorkerData.skill,
          skillIcon,
          experience: `${finalWorkerData.experience_years || 0} years`,
          joinDate: finalWorkerData.created_at,
          safetyScore: finalWorkerData.safety_score || 0,
          rating: parseFloat(finalWorkerData.rating) || 0,
          totalReviews: finalWorkerData.total_reviews || 0,
          repeatHireRate: finalWorkerData.repeat_hire_rate || 0,
          verified: {
            aadhaar: verification?.aadhaar_verified || false,
            police: verification?.police_verified || false,
            storeVouch: verification?.store_vouched || false,
            storeName: verification?.store_name || '',
          },
          agentName: verification?.verified_by_name || '',
          verifiedDate: verification?.store_vouched_at || verification?.aadhaar_verified_at || '',
          phone: workerData.phone || profile?.phone || '',
          location: workerData.location || '',
          amortizationPaid: workerData.amortization_paid || 0,
          badges: (badges || []).map(b => `${b.badge_icon || '🏅'} ${b.badge_name}`),
          isPending: false,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkerData();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-white/5 rounded-lg" />
          <div className="h-4 w-40 bg-white/5 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-96 bg-white/5 rounded-2xl" />
            <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--gradient-primary)' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!worker) return null;

  const amortizationProgress = (worker.amortizationPaid / PRICING.verificationCost) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Pending Banner */}
      {worker.isPending && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <h3 className="text-sm font-semibold text-amber-400">Profile Pending Activation</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Your Kaushal-ID is being set up. Visit your nearest hardware store hub to complete verification.
              </p>
            </div>
          </div>
        </div>
      )}

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
        <StatsCard icon="⭐" value={worker.rating} label="Rating" trend={worker.rating > 0 ? 3 : 0} />
        <StatsCard icon="📝" value={worker.totalReviews} label="Total Reviews" trend={worker.totalReviews > 0 ? 12 : 0} />
        <StatsCard icon="🔄" value={`${worker.repeatHireRate}%`} label="Repeat Hire Rate" />
        <StatsCard icon="🏆" value={worker.badges.length} label="Badges Earned" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Virtual Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <VirtualIDCard worker={worker} />
          
          {/* Subscription CTA moved under card */}
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
        </div>

        {/* Right — Everything else */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phygital Process */}
          <div className="animate-slideUp delay-100">
            <h2 className="text-lg font-semibold text-white mb-6">The Phygital Onboarding Process</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ONBOARDING_STEPS.map((step, i) => {
                // Determine completion based on real data
                const completionMap = [
                  true, // Step 1: Registration — always done if they're here
                  worker.verified.storeVouch, // Step 2: Store vouching
                  worker.verified.aadhaar && worker.verified.police, // Step 3: Digital audit
                  worker.verified.aadhaar && worker.verified.police && worker.verified.storeVouch, // Step 4: ID Activation
                ];
                const isCompleted = completionMap[i] || false;
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Amortization Tracker */}
            <GlassCard className="animate-slideUp delay-300">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                Cost Recovery
              </h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-white">{formatINR(worker.amortizationPaid)}</span>
                <span className="text-sm text-white/30 mb-1">/ {formatINR(PRICING.verificationCost)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 mb-3">
                <div className="h-full rounded-full transition-all duration-1000"
                     style={{ width: `${Math.min(amortizationProgress, 100)}%`, background: 'var(--gradient-emerald)' }}
                />
              </div>
              <p className="text-xs text-white/30">
                {formatINR(PRICING.amortizationPerHiring)} deducted per hiring
              </p>
            </GlassCard>

            {/* Profile Status */}
            <GlassCard className="animate-slideUp delay-300">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Next Steps</h3>
              <div className="space-y-3">
                {[
                  { label: 'Basic Info', done: true },
                  { label: 'Aadhaar Verification', done: worker.verified.aadhaar },
                  { label: 'Police Clearance', done: worker.verified.police },
                  { label: 'Store Vouching', done: worker.verified.storeVouch },
                  { label: 'Profile Photo', done: !!worker.photo },
                  { label: 'First Review', done: worker.totalReviews > 0 },
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

          {/* QR Code */}
          <GlassCard className="text-center animate-slideUp delay-100 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Your Printable QR</h3>
            <div className="bg-white p-2 rounded-xl">
               <QRGenerator
                 value={`https://kaushal-id.vercel.app/verify/${worker.id}`}
                 size={140}
                 fgColor="#000000"
                 bgColor="#ffffff"
               />
            </div>
            <p className="text-xs text-white/30 mt-3">Share with customers for instant verification</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
