'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabase/client';

export default function CustomerRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
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
            full_name: form.name,
            phone: form.phone,
            role: 'customer',
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

      setSuccess('Account created successfully! Check your email for confirmation.');
      // Do not auto-redirect to dashboard because the user still needs to confirm their email
      // and their session won't be active until they do.
      // The success message already tells them to check their email.
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="fixed top-20 left-10 w-72 h-72 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            🏠 Customer Registration
          </span>
        </div>

        <div className="auth-glass p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-sm text-white/40">Join to find verified service professionals</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            <Input id="cust-name" label="Full Name" value={form.name} onChange={update('name')} required />
            <Input id="cust-email" label="Email Address" type="email" value={form.email} onChange={update('email')} required />
            <Input id="cust-phone" label="Phone Number" type="tel" value={form.phone} onChange={update('phone')} required />
            <Input id="cust-password" label="Password" type="password" value={form.password} onChange={update('password')} required />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already registered?{' '}
            <Link href="/customer/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
