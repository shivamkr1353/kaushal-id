'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabase/client';
import { SERVICES } from '@/lib/constants';

export default function WorkerRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', skill: '', experience: '', aadhaar: '', password: '' });
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
            role: 'worker',
            skill: form.skill,
            experience_years: form.experience,
            aadhaar: form.aadhaar,
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

      setSuccess('Kaushal-ID profile created! Check your email for confirmation.');
      setTimeout(() => router.push('/worker/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="fixed bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
            👷 Create Your Kaushal-ID
          </span>
        </div>

        <div className="auth-glass p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Build Your Reputation</h1>
            <p className="text-sm text-white/40">Turn your skills into a verified digital identity</p>
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
            <Input id="worker-name" label="Full Name" value={form.name} onChange={update('name')} required />
            <Input id="worker-email" label="Email Address" type="email" value={form.email} onChange={update('email')} required />
            <Input id="worker-phone" label="Phone Number" type="tel" value={form.phone} onChange={update('phone')} required />

            <div>
              <label className="text-xs text-white/40 mb-1 block">Primary Skill</label>
              <select
                value={form.skill}
                onChange={update('skill')}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#10b981]/50 transition-all"
                required
              >
                <option value="" className="bg-[#1a1a2e]">Select your skill</option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.name} className="bg-[#1a1a2e]">
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <Input id="worker-exp" label="Years of Experience" type="number" value={form.experience} onChange={update('experience')} required />
            <Input id="worker-aadhaar" label="Aadhaar Number" type="text" value={form.aadhaar} onChange={update('aadhaar')} required />
            <Input id="worker-password" label="Password" type="password" value={form.password} onChange={update('password')} required />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Kaushal-ID'}
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already registered?{' '}
            <Link href="/worker/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign In
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[11px] text-white/20 text-center">
              After registration, visit your nearest hardware store hub to complete physical verification and activate your Kaushal-ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
