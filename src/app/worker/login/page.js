'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabase/client';

export default function WorkerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push('/worker/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="fixed top-20 left-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
            👷 Worker Portal
          </span>
        </div>

        <div className="auth-glass p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Worker Login</h1>
            <p className="text-sm text-white/40">Access your Kaushal-ID profile and dashboard</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input id="worker-email" label="Email or Phone" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="worker-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            New to Kaushal-ID?{' '}
            <Link href="/worker/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Create your profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
