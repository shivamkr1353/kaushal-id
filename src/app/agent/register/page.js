'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabase/client';

export default function AgentRegisterPage() {
  const [form, setForm] = useState({ storeName: '', ownerName: '', email: '', phone: '', location: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: form.ownerName,
            phone: form.phone,
            role: 'agent',
            store_name: form.storeName,
            store_location: form.location,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.');
        return;
      }

      setSuccess('Agent account created! Check your email for confirmation.');
      setTimeout(() => router.push('/agent/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="fixed bottom-20 left-10 w-96 h-96 rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
            🏪 Partner Registration
          </span>
        </div>

        <div className="auth-glass p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Partner with Us</h1>
            <p className="text-sm text-white/40">Register your hardware store as a verification hub</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fadeIn">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input id="agent-store" label="Store Name" value={form.storeName} onChange={update('storeName')} required />
            <Input id="agent-owner" label="Owner Name" value={form.ownerName} onChange={update('ownerName')} required />
            <Input id="agent-email" label="Email Address" type="email" value={form.email} onChange={update('email')} required />
            <Input id="agent-phone" label="Phone Number" type="tel" value={form.phone} onChange={update('phone')} required />
            <Input id="agent-location" label="Store Location" value={form.location} onChange={update('location')} required />
            <Input id="agent-password" label="Password" type="password" value={form.password} onChange={update('password')} required />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register as Agent'}
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already a partner?{' '}
            <Link href="/agent/login" className="text-amber-400 hover:text-amber-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
