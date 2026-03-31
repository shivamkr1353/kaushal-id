import Link from 'next/link';
import { getScoreColor } from '@/lib/utils';
import TrustBadges from './TrustBadges';

export default function WorkerCard({ worker }) {
  const scoreColor = getScoreColor(worker.safetyScore);

  return (
    <div className="glass rounded-2xl p-5 hover-lift group">
      {/* Top row: Avatar + Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
             style={{ background: 'var(--gradient-primary)' }}>
          {worker.skillIcon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{worker.name}</h3>
          <p className="text-white/50 text-xs mt-0.5">{worker.id}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/60">{worker.skill}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/40">{worker.experience}</span>
          </div>
        </div>

        {/* Safety Score */}
        <div className="flex flex-col items-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2"
            style={{ borderColor: scoreColor, color: scoreColor }}
          >
            {worker.safetyScore}
          </div>
          <span className="text-[10px] text-white/30 mt-0.5">Safety</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-1">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-white text-sm font-medium">{worker.rating}</span>
          <span className="text-white/30 text-xs">({worker.totalReviews})</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/40">🔄 {worker.repeatHireRate}% repeat</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mb-4">
        <TrustBadges verified={worker.verified} compact />
      </div>

      {/* Badges */}
      {worker.badges && worker.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {worker.badges.slice(0, 3).map((badge, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/50 border border-white/5">
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/verify/${worker.id}`}
          className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/5"
        >
          View Profile
        </Link>
        <button className="flex-1 text-xs font-medium py-2 rounded-lg text-white hover:opacity-90 transition-all"
                style={{ background: 'var(--gradient-emerald)' }}>
          📞 Call Now
        </button>
      </div>
    </div>
  );
}
