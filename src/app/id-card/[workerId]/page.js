import { MOCK_WORKERS } from '@/lib/constants';
import QRGenerator from '@/components/QRGenerator';
import TrustBadges from '@/components/TrustBadges';

export const metadata = {
  title: 'Kaushal-ID Card Preview',
  description: 'Physical ID card layout for verified Kaushal-ID professionals.',
};

export default async function IDCardPage({ params }) {
  const { workerId } = await params;
  const worker = MOCK_WORKERS.find((w) => w.id === workerId) || MOCK_WORKERS[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8 no-print">
        <h1 className="text-2xl font-bold text-white mb-2">Kaushal-ID Card Preview</h1>
        <p className="text-white/40 text-sm mb-4">Print-ready physical ID card layout</p>
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--gradient-primary)' }}
        >
          🖨️ Print Card
        </button>
      </div>

      {/* Card Container */}
      <div className="space-y-8">
        {/* FRONT SIDE */}
        <div className="glass-strong rounded-2xl p-8 relative overflow-hidden" style={{ aspectRatio: '1.586' }}>
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(99,102,241,0.1) 20px, rgba(99,102,241,0.1) 21px)',
            }}
          />

          <div className="relative z-10 h-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                     style={{ background: 'var(--gradient-primary)' }}>
                  K
                </div>
                <span className="text-lg font-bold text-white">Kaushal-ID</span>
              </div>
              <span className="badge-verified text-[10px]">VERIFIED PROFESSIONAL</span>
            </div>

            {/* Main content */}
            <div className="flex items-center gap-6 flex-1">
              {/* Photo */}
              <div className="w-24 h-28 rounded-xl flex items-center justify-center text-4xl shrink-0 border-2 border-white/10"
                   style={{ background: 'var(--gradient-primary)' }}>
                {worker.skillIcon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{worker.name}</h2>
                <p className="text-sm text-white/50 mb-1">{worker.skill} · {worker.experience}</p>
                <p className="text-xs text-white/30 font-mono">{worker.id}</p>
              </div>

              {/* QR Code */}
              <div className="shrink-0">
                <QRGenerator
                  value={`https://kaushal-id.in/verify/${worker.id}`}
                  size={100}
                />
                <p className="text-[9px] text-white/20 text-center mt-1">Scan for Live Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-white/20 text-xs no-print">— FLIP —</div>

        {/* BACK SIDE */}
        <div className="glass-strong rounded-2xl p-8 relative overflow-hidden" style={{ aspectRatio: '1.586' }}>
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Skill */}
            <div className="mb-4">
              <span className="text-xs text-white/40 uppercase tracking-wider">Primary Skill</span>
              <h3 className="text-lg font-bold text-white">{worker.skill}</h3>
            </div>

            {/* Trust Badges */}
            <div className="mb-4">
              <span className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Trust Verification</span>
              <div className="flex items-center gap-3">
                <span className={`text-lg ${worker.verified.aadhaar ? '' : 'opacity-20'}`} title="Aadhaar Verified">🪪</span>
                <span className={`text-lg ${worker.verified.police ? '' : 'opacity-20'}`} title="Police Clearance">🛡️</span>
                <span className={`text-lg ${worker.verified.storeVouch ? '' : 'opacity-20'}`} title="Store Vouched">🏪</span>
              </div>
            </div>

            {/* Security Tip */}
            <div className="glass-subtle rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-400/80 font-medium">
                ⚠️ Security Tip: Never allow entry without scanning this QR code.
              </p>
            </div>

            {/* Helpline */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">Helpline: 1800-XXX-XXXX</span>
              <span className="text-xs text-white/20">kaushal-id.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
