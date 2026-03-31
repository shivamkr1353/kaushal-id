import QRGenerator from './QRGenerator';
import TrustGauge from './TrustGauge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function VirtualIDCard({ worker }) {
  return (
    <div className="glass-strong rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 animate-scaleIn max-w-[400px] mx-auto w-full group">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-90 transition-opacity duration-500" 
           style={{ background: 'var(--gradient-primary)' }} />
      
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white to-transparent" style={{ mixBlendMode: 'overlay' }} />

      {/* Header Info */}
      <div className="relative pt-6 px-6 pb-4 flex flex-col items-center">
        {/* Logo / Header Branding */}
        <div className="w-full flex justify-between items-start absolute top-4 left-0 px-4">
           <img src="/logo.png" alt="Logo" className="h-6 brightness-0 invert opacity-90 drop-shadow-md" />
           <span className="badge-verified text-[9px] shadow-lg">ACTIVE ID</span>
        </div>

        {/* Photo */}
        <div className="w-28 h-28 rounded-2xl bg-[#1e2338] border-4 border-[#1e2338] flex items-center justify-center text-5xl shadow-2xl z-10 overflow-hidden mt-6 mb-4 ring-2 ring-white/10"
             style={{ background: 'var(--gradient-emerald)' }}>
          {worker.photo ? <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" /> : <span>{worker.skillIcon}</span>}
        </div>
        
        {/* Name & ID */}
        <h2 className="text-2xl font-bold text-white relative z-10 tracking-tight">{worker.name}</h2>
        <div className="flex flex-col items-center mt-1">
           <span className="text-sm font-medium text-amber-400 mb-1">{worker.skill}</span>
           <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white/80 font-mono text-[11px] tracking-wider shadow-inner">
             ID: {worker.id}
           </span>
        </div>
      </div>

      <div className="px-6 py-4 space-y-5 bg-gradient-to-b from-transparent to-[#0a0a10]">
        
        {/* Key Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/10 glass-subtle rounded-xl p-3 border border-white/5">
          <div className="flex flex-col justify-center">
            <div className="text-sm font-bold text-amber-400">★ {worker.rating}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Rating</div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm font-bold text-white">{worker.experience}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Exp.</div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm font-bold text-emerald-400">{worker.repeatHireRate}%</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Repeat</div>
          </div>
        </div>

        {/* Safety & Joining */}
        <div className="flex items-center justify-between px-2">
           <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Safety Index</p>
              <div className="flex items-center gap-2">
                 <div className="w-10 h-10 -ml-1">
                    <TrustGauge score={worker.safetyScore} size={40} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-base font-bold text-white">{worker.safetyScore}<span className="text-xs text-white/30 font-normal">/100</span></span>
                 </div>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Date Joined</p>
              <p className="text-sm font-medium text-white/90 bg-white/5 px-2 py-1 rounded-md border border-white/5 w-fit ml-auto">
                {formatDate(worker.joinDate)}
              </p>
           </div>
        </div>

        {/* Trust Evidence */}
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2.5">Trust Evidence Checklist</p>
          <div className="space-y-2.5 bg-[#1e2338]/30 p-3.5 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center gap-2.5">
               <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
               <span className="text-white/80 font-medium">Aadhaar Linked</span>
            </div>
            <div className="flex items-center gap-2.5">
               <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
               <span className="text-white/80 font-medium">Police Clearance (PCC) Verified</span>
            </div>
            <div className="flex items-start gap-2.5">
               <div className="w-4 h-4 mt-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">✓</div>
               <div className="text-white/80 leading-snug">
                 Vouched by <span className="text-white font-medium block text-[11px] mt-0.5 bg-white/5 rounded px-1.5 py-0.5 w-fit border border-white/5">[{worker.verified.storeName}]</span>
               </div>
            </div>
          </div>
        </div>

        {/* Media / Feedback Preview */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Proof of Work</p>
            <div className="h-[68px] rounded-xl bg-[#1e2338]/40 border border-white/5 flex flex-col items-center justify-center overflow-hidden hover:bg-[#1e2338]/80 transition-colors cursor-pointer group/media relative">
               <span className="text-xl mb-1 group-hover/media:scale-110 transition-transform duration-300">📸</span>
               <span className="text-[9px] text-white/40">View Media (4)</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Customer Feedback</p>
            <div className="h-[68px] rounded-xl bg-[#1e2338]/40 border border-white/5 p-2.5 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-amber-400/50" />
               <span className="text-[10px] text-white/80 italic leading-snug">
                 "Professional, quick, and very reliable!"
               </span>
               <div className="flex items-center gap-1 mt-1.5">
                 <span className="text-[8px] text-amber-400">★★★★★</span>
                 <span className="text-[8px] text-white/30">— R. Sharma</span>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-[#0a0a10] border-t border-white/5 flex items-center gap-3 relative z-10">
         <a href={`tel:${worker.phone || '+919876543210'}`} 
            className="flex-1 py-3 rounded-xl text-xs font-bold text-white text-center hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-emerald)' }}>
            📞 Call Now
         </a>
         <button className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all bg-[#1e2338] border border-white/10 hover:bg-white/10 hover:-translate-y-0.5">
            ⭐ View Reviews
         </button>
      </div>
    </div>
  );
}
