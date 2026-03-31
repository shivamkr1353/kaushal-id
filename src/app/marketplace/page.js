'use client';

import { useState } from 'react';
import WorkerCard from '@/components/WorkerCard';
import { MOCK_WORKERS, SERVICES } from '@/lib/constants';

export default function MarketplacePage() {
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filteredWorkers = MOCK_WORKERS
    .filter((w) => selectedSkill === 'All' || w.skill === selectedSkill)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'safety') return b.safetyScore - a.safetyScore;
      if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Marketplace</h1>
        <p className="text-white/40 max-w-xl">
          Find verified service professionals in your area. Every worker is background-checked and rated.
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-8 animate-slideUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Skill Filter */}
          <div className="flex-1 w-full">
            <label className="text-xs text-white/40 mb-2 block">Filter by Skill</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSkill('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSkill === 'All'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {SERVICES.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setSelectedSkill(s.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSkill === s.name
                      ? 'bg-[#6366f1] text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="shrink-0">
            <label className="text-xs text-white/40 mb-2 block">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition-all"
            >
              <option value="rating">Rating</option>
              <option value="safety">Safety Score</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Worker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredWorkers.map((worker, index) => (
          <div key={worker.id} className={`animate-slideUp delay-${(index + 1) * 100}`}>
            <WorkerCard worker={worker} />
          </div>
        ))}
        {filteredWorkers.length === 0 && (
          <div className="col-span-full text-center py-16">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-white/40">No workers found for this category yet.</p>
          </div>
        )}
      </div>

      {/* Top Rated Hubs */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Top Rated Hubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Sharma Hardware', location: 'Lajpat Nagar', workers: 12, rating: 4.8 },
            { name: 'Gupta Sanitary', location: 'Karol Bagh', workers: 8, rating: 4.6 },
            { name: 'Delhi Timber House', location: 'Kirti Nagar', workers: 15, rating: 4.9 },
          ].map((hub, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏪</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{hub.name}</h3>
                  <p className="text-xs text-white/40">{hub.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{hub.workers} verified workers</span>
                <span className="text-amber-400">★ {hub.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Info */}
      <div className="glass-subtle rounded-2xl p-6 text-center">
        <p className="text-xs text-white/30">
          💡 Discovery Fee: ₹100 (₹50 Agent Commission + ₹50 Platform Maintenance) · Service Commission: 5-8% on repeat hiring
        </p>
      </div>
    </div>
  );
}
