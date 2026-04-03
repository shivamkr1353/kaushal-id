'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { formatINR } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AgentDashboardPage() {
  const [agent, setAgent] = useState(null);
  const [vouchedWorkers, setVouchedWorkers] = useState([]);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAgentData() {
      try {
        const supabase = createClient();

        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/agent/login');
          return;
        }

        // 2. Get agent record
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .single();

        let finalAgentData = agentData;

        if (agentError || !agentData) {
          const meta = user.user_metadata || {};
          // Agent record doesn't exist yet. Attempt auto-creation.
          const { data: newAgent, error: insertError } = await supabase
            .from('agents')
            .insert({
              user_id: user.id,
              store_name: meta.store_name || 'Your Store',
              owner_name: meta.full_name || 'Store Owner',
              location: meta.store_location || null,
              phone: meta.phone || '',
              workers_vouched: 0,
              total_commission: 0,
              is_active: true,
            })
            .select()
            .single();

          if (!insertError && newAgent) {
            finalAgentData = newAgent;
          } else {
            // Auto creation failed (table might not exist), show pending state
            setAgent({
              storeName: meta.store_name || 'Your Store',
              ownerName: meta.full_name || 'Store Owner',
              location: meta.store_location || 'Location not set',
              workersVouched: 0,
              pendingVerification: 0,
              commissionEarned: 0,
              isPending: true,
            });
            setLoading(false);
            return;
          }
        }

        // 3. Get verifications made by this agent (vouched workers)
        const { data: verifications } = await supabase
          .from('verifications')
          .select('*, workers!inner(id, kaushal_id, skill, user_id, safety_score, is_active)')
          .eq('agent_id', finalAgentData.id);

        // Separate into vouched and pending
        const vouched = [];
        const pending = [];

        if (verifications) {
          for (const v of verifications) {
            // Get worker profile name
            const { data: workerProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', v.workers.user_id)
              .single();

            const SKILL_ICONS = {
              'Electrician': '💡', 'Plumber': '🛠️', 'Carpenter': '🪚',
              'Technician': '🧰', 'Locksmith': '🔐', 'Painter': '🖌️',
              'Cleaner': '🧹', 'Gardener': '🌿',
            };

            const workerInfo = {
              id: v.workers.kaushal_id,
              name: workerProfile?.full_name || 'Worker',
              skill: v.workers.skill,
              skillIcon: SKILL_ICONS[v.workers.skill] || '👷',
              safetyScore: v.workers.safety_score || 0,
              fullyVerified: v.aadhaar_verified && v.police_verified && v.store_vouched,
            };

            if (workerInfo.fullyVerified) {
              vouched.push(workerInfo);
            } else {
              pending.push(workerInfo);
            }
          }
        }

        // 4. Get commissions
        const { data: commData } = await supabase
          .from('commissions')
          .select('*')
          .eq('agent_id', finalAgentData.id)
          .order('created_at', { ascending: false });

        // Calculate total commission
        const totalCommission = (commData || []).reduce((sum, c) => sum + c.amount, 0);

        // Build monthly earnings from commission data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyMap = {};
        (commData || []).forEach(c => {
          const month = monthNames[new Date(c.created_at).getMonth()];
          monthlyMap[month] = (monthlyMap[month] || 0) + c.amount;
        });
        const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));

        setAgent({
          storeName: finalAgentData.store_name,
          ownerName: finalAgentData.owner_name,
          location: finalAgentData.location || 'Location not set',
          workersVouched: finalAgentData.workers_vouched || vouched.length,
          pendingVerification: pending.length,
          commissionEarned: finalAgentData.total_commission || totalCommission,
          monthlyEarnings,
          isPending: false,
        });

        setVouchedWorkers(vouched);
        setPendingWorkers(pending);
        setCommissions(commData || []);
      } catch (err) {
        console.error('Agent dashboard fetch error:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchAgentData();
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
            <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
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
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--gradient-amber)' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!agent) return null;

  const avgMonthly = agent.monthlyEarnings && agent.monthlyEarnings.length > 0
    ? Math.round(agent.monthlyEarnings.reduce((s, m) => s + m.amount, 0) / agent.monthlyEarnings.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Pending Banner */}
      {agent.isPending && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <h3 className="text-sm font-semibold text-amber-400">Store Profile Setting Up</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Your agent profile is being configured. You can start onboarding workers once setup is complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-fadeIn">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            🏪 Agent Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{agent.storeName}</h1>
          <p className="text-white/40 text-sm mt-1">{agent.location}</p>
        </div>
        <Button className="shrink-0">
          📷 Scan & Onboard Worker
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="👷" value={agent.workersVouched} label="Workers Vouched" trend={agent.workersVouched > 0 ? 15 : 0} />
        <StatsCard icon="⏳" value={agent.pendingVerification} label="Pending Verification" />
        <StatsCard icon="💰" value={formatINR(agent.commissionEarned)} label="Commission Earned" trend={agent.commissionEarned > 0 ? 22 : 0} />
        <StatsCard icon="📊" value={formatINR(avgMonthly)} label="Avg Monthly Earning" />
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
            {pendingWorkers.length === 0 ? (
              <GlassCard className="animate-slideUp">
                <div className="text-center py-6">
                  <span className="text-3xl mb-3 block">✅</span>
                  <p className="text-sm text-white/40">No pending verifications</p>
                  <p className="text-xs text-white/20 mt-1">Onboard new workers to get started</p>
                </div>
              </GlassCard>
            ) : (
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
            )}
          </div>

          {/* Verified Workers */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Verified Workers ({vouchedWorkers.length})
            </h2>
            {vouchedWorkers.length === 0 ? (
              <GlassCard className="animate-slideUp">
                <div className="text-center py-6">
                  <span className="text-3xl mb-3 block">👷</span>
                  <p className="text-sm text-white/40">No verified workers yet</p>
                  <p className="text-xs text-white/20 mt-1">Workers you verify will appear here</p>
                </div>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {vouchedWorkers.map((worker, i) => (
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
            )}
          </div>
        </div>

        {/* Commission Tracker */}
        <div className="space-y-6">
          <GlassCard className="animate-slideUp delay-200">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Commission Tracker</h3>
            {agent.monthlyEarnings && agent.monthlyEarnings.length > 0 ? (
              <div className="space-y-3">
                {agent.monthlyEarnings.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-white/30 w-8">{item.month}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full"
                           style={{
                             width: `${Math.min((item.amount / Math.max(...agent.monthlyEarnings.map(m => m.amount), 1)) * 100, 100)}%`,
                             background: 'var(--gradient-amber)',
                           }}
                      />
                    </div>
                    <span className="text-xs text-white/50 w-12 text-right">{formatINR(item.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-white/30">No commissions yet</p>
                <p className="text-xs text-white/20 mt-1">Commission will appear as you onboard workers</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Total Earned</span>
                <span className="text-sm font-bold text-amber-400">{formatINR(agent.commissionEarned)}</span>
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
