'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const router = useRouter();

  const SKILL_ICONS = {
    'Electrician': '💡', 'Plumber': '🛠️', 'Carpenter': '🪚',
    'Technician': '🧰', 'Locksmith': '🔐', 'Painter': '🖌️',
    'Cleaner': '🧹', 'Gardener': '🌿',
  };

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const supabase = createClient();

        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/customer/login');
          return;
        }

        // 2. Get profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile({
          name: profileData?.full_name || user.user_metadata?.full_name || 'Customer',
          email: user.email,
          phone: profileData?.phone || user.user_metadata?.phone || '',
        });

        // 3. Get bookings with worker info
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, workers!inner(kaushal_id, skill, user_id)')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        // Get worker names for bookings
        const enrichedBookings = [];
        for (const booking of (bookingsData || [])) {
          const { data: workerProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', booking.workers.user_id)
            .single();

          enrichedBookings.push({
            id: booking.id,
            workerId: booking.workers.kaushal_id,
            workerName: workerProfile?.full_name || 'Worker',
            skill: booking.workers.skill,
            skillIcon: SKILL_ICONS[booking.workers.skill] || '👷',
            status: booking.status,
            createdAt: booking.created_at,
            completedAt: booking.completed_at,
          });
        }
        setBookings(enrichedBookings);

        // 4. Get review count
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('customer_id', user.id);
        
        setReviewCount(count || 0);
      } catch (err) {
        console.error('Customer dashboard fetch error:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'in_progress': return 'text-blue-400';
      case 'confirmed': return 'text-amber-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-32 bg-white/5 rounded-lg" />
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
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--gradient-primary)' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-8 animate-fadeIn">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
          🏠 Customer Dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {profile?.name || 'back'}!</h1>
        <p className="text-white/40 text-sm mt-1">Manage your bookings and reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="📋" value={bookings.length} label="Total Bookings" trend={bookings.length > 0 ? 8 : 0} />
        <StatsCard icon="⭐" value={reviewCount} label="Reviews Given" />
        <StatsCard icon="✅" value={completedBookings.length} label="Completed" />
        <StatsCard icon="🛡️" value="100%" label="Verified Services" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <GlassCard className="animate-slideUp">
              <div className="text-center py-10">
                <span className="text-4xl mb-4 block">🔍</span>
                <h3 className="text-base font-semibold text-white mb-2">No bookings yet</h3>
                <p className="text-sm text-white/40 mb-5">Find trusted service professionals on the marketplace</p>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Browse Marketplace
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 10).map((booking, i) => (
                <GlassCard key={booking.id} className={`animate-slideUp delay-${(i + 1) * 100}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                         style={{ background: 'var(--gradient-primary)' }}>
                      {booking.skillIcon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{booking.workerName}</h3>
                      <p className="text-xs text-white/40">{booking.skill} · {booking.workerId}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                      <p className="text-xs text-white/30 mt-0.5">
                        {getTimeAgo(booking.completedAt || booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Review Submission */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Submit a Review</h2>
          <GlassCard className="animate-slideUp delay-200">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-all ${star <= reviewRating ? 'text-amber-400' : 'text-white/10'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366f1]/50 transition-all resize-none"
                  rows={4}
                  placeholder="How was the service?"
                />
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--gradient-primary)' }}>
                Submit Review
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
