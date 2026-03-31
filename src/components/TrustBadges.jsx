export default function TrustBadges({ verified, compact = false }) {
  const badges = [
    { key: 'aadhaar', label: 'Aadhaar Linked', icon: '🪪' },
    { key: 'police', label: 'Police Clearance (PCC)', icon: '🛡️' },
    { key: 'storeVouch', label: verified?.storeName || 'Store Vouched', icon: '🏪' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {badges.map((b) => (
          <span
            key={b.key}
            title={b.label}
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
              verified?.[b.key] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'
            }`}
          >
            {b.icon}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {badges.map((b) => (
        <div key={b.key} className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
              verified?.[b.key] ? 'text-emerald-400' : 'text-white/20'
            }`}
          >
            {verified?.[b.key] ? '✅' : '⬜'}
          </span>
          <span className={`text-sm ${verified?.[b.key] ? 'text-white/80' : 'text-white/30'}`}>
            {b.key === 'storeVouch' && verified?.[b.key]
              ? `Vouched by: ${verified.storeName}`
              : b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
