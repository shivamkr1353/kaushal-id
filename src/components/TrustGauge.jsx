'use client';

import { useEffect, useState } from 'react';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

export default function TrustGauge({ score = 0, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size * 0.65} viewBox="0 0 180 117" className="overflow-visible">
        {/* Track */}
        <path
          d="M 15 100 A 70 70 0 0 1 165 100"
          className="gauge-track"
          strokeWidth="12"
        />
        {/* Fill */}
        <path
          d="M 15 100 A 70 70 0 0 1 165 100"
          className="gauge-fill"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
        {/* Score text */}
        <text x="90" y="85" textAnchor="middle" className="fill-white text-3xl font-bold" style={{ fontSize: '36px' }}>
          {animatedScore}
        </text>
        <text x="90" y="108" textAnchor="middle" className="fill-white/50 text-xs" style={{ fontSize: '12px' }}>
          {label}
        </text>
      </svg>
      <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Safety Score</span>
    </div>
  );
}
