import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Supabase Connection Test — Kaushal-ID',
};

export default async function TestSupabasePage() {
  let connectionStatus = 'unknown';
  let authInfo = null;
  let errorMsg = null;

  try {
    const supabase = await createClient();

    // Test 1: Check if we can reach Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && authError.message !== 'Auth session missing!') {
      throw authError;
    }

    connectionStatus = 'connected';
    authInfo = user ? { email: user.email, id: user.id } : 'No user signed in (expected)';

  } catch (err) {
    connectionStatus = 'failed';
    errorMsg = err?.message || String(err);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-white mb-6">Supabase Connection Test</h1>

      <div className="glass rounded-2xl p-6 space-y-6">
        {/* Connection Status */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Connection Status</h2>
          {connectionStatus === 'connected' ? (
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">✅ Connected to Supabase</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-red-400 font-semibold">❌ Connection Failed</span>
            </div>
          )}
        </div>

        {/* Env Vars */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Environment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/40">URL:</span>
              <code className="text-white/60 bg-white/5 px-2 py-0.5 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40">Key:</span>
              <code className="text-white/60 bg-white/5 px-2 py-0.5 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '✅ Set' : '❌ Missing'}
              </code>
            </div>
          </div>
        </div>

        {/* Auth Info */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Auth Status</h2>
          <pre className="text-xs text-white/50 bg-white/5 rounded-xl p-4 overflow-auto">
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </div>

        {/* Error (if any) */}
        {errorMsg && (
          <div>
            <h2 className="text-sm font-semibold text-red-400/70 uppercase tracking-wider mb-2">Error Details</h2>
            <pre className="text-xs text-red-400/60 bg-red-500/5 border border-red-500/10 rounded-xl p-4 overflow-auto">
              {errorMsg}
            </pre>
          </div>
        )}
      </div>

      <p className="text-xs text-white/20 mt-6 text-center">
        This page is for development testing only. Remove before production.
      </p>
    </div>
  );
}
