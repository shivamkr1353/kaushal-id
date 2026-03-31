'use client';

import { useState } from 'react';
import StatsCard from '@/components/StatsCard';
import GlassCard from '@/components/GlassCard';
import { MOCK_WORKERS } from '@/lib/constants';

export default function CustomerDashboardPage() {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const recentBookings = MOCK_WORKERS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-8 animate-fadeIn">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
          🏠 Customer Dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back!</h1>
        <p className="text-white/40 text-sm mt-1">Manage your bookings and reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="📋" value="12" label="Total Bookings" trend={8} />
        <StatsCard icon="⭐" value="8" label="Reviews Given" />
        <StatsCard icon="❤️" value="5" label="Favorite Workers" />
        <StatsCard icon="🛡️" value="100%" label="Verified Services" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((worker, i) => (
              <GlassCard key={worker.id} className={`animate-slideUp delay-${(i + 1) * 100}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                       style={{ background: 'var(--gradient-primary)' }}>
                    {worker.skillIcon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{worker.name}</h3>
                    <p className="text-xs text-white/40">{worker.skill} · {worker.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-400">Completed</span>
                    <p className="text-xs text-white/30 mt-0.5">2 days ago</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
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
