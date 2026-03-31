import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                   style={{ background: 'var(--gradient-primary)' }}>
                K
              </div>
              <span className="text-lg font-bold text-white">Kaushal-ID</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              India&apos;s first phygital platform connecting verified local talent with trusted households.
            </p>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">For Users</h4>
            <div className="flex flex-col gap-2">
              <Link href="/customer/register" className="text-sm text-white/40 hover:text-white/80 transition-colors">Customer Registration</Link>
              <Link href="/marketplace" className="text-sm text-white/40 hover:text-white/80 transition-colors">Find a Worker</Link>
              <Link href="/customer/login" className="text-sm text-white/40 hover:text-white/80 transition-colors">Customer Login</Link>
            </div>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">For Professionals</h4>
            <div className="flex flex-col gap-2">
              <Link href="/worker/register" className="text-sm text-white/40 hover:text-white/80 transition-colors">Create Profile</Link>
              <Link href="/worker/login" className="text-sm text-white/40 hover:text-white/80 transition-colors">Worker Login</Link>
              <Link href="/agent/register" className="text-sm text-white/40 hover:text-white/80 transition-colors">Partner as Agent</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/40">Helpline: 1800-XXX-XXXX</span>
              <span className="text-sm text-white/40">support@kaushal-id.in</span>
              <Link href="/analytics" className="text-sm text-white/40 hover:text-white/80 transition-colors">Impact & Analytics</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Kaushal-ID. Trust Digitized, Skills Recognized.
          </p>
          <p className="text-xs text-white/30">
            Built for Viksit Bharat 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
