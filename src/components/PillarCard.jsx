import Link from 'next/link';

export default function PillarCard({ icon, tagline, description, cta, ctaLink, color, delay = '0' }) {
  return (
    <div
      className={`glass rounded-2xl p-8 hover-lift animate-slideUp group flex flex-col h-full delay-${delay}`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color }}
      >
        {tagline}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
        {description}
      </p>
      <Link
        href={ctaLink}
        className="inline-flex items-center justify-center w-full text-sm font-semibold py-3 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: `linear-gradient(135deg, ${color}cc 0%, ${color} 100%)` }}
      >
        {cta}
      </Link>
    </div>
  );
}
