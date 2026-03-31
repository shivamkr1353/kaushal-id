'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loginDropdown, setLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLoginDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loginOptions = [
    { label: 'Customer Login', href: '/customer/login', icon: '🏠', color: '#3b82f6' },
    { label: 'Agent Login', href: '/agent/login', icon: '🏪', color: '#f59e0b' },
    { label: 'Worker Login', href: '/worker/login', icon: '👷', color: '#10b981' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Kaushal-ID Logo" 
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}
            />
          </Link>

          {/* Search/Verify Bar — Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Worker ID or Phone to Verify"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#6366f1]/50 focus:bg-white/8 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Actions — Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/marketplace" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2">
              Marketplace
            </Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2">
              Analytics
            </Link>

            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLoginDropdown(!loginDropdown)}
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Login
                <svg className={`w-3.5 h-3.5 transition-transform ${loginDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {loginDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-strong p-2 animate-scaleIn origin-top-right">
                  {loginOptions.map((opt) => (
                    <Link
                      key={opt.href}
                      href={opt.href}
                      onClick={() => setLoginDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{opt.icon}</span>
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[10px] text-white/30">
                          {opt.label.includes('Agent') && 'Hardware Store Hub'}
                          {opt.label.includes('Customer') && 'Find Services'}
                          {opt.label.includes('Worker') && 'Manage Profile'}
                        </div>
                      </div>
                      <div className="ml-auto w-2 h-2 rounded-full opacity-60" style={{ background: opt.color }} />
                    </Link>
                  ))}
                  <div className="mt-1 pt-1 border-t border-white/5">
                    <Link
                      href="/agent/register"
                      onClick={() => setLoginDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
                    >
                      <span>🤝</span>
                      <span>Partner as Agent</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/worker/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Register as Worker
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter Worker ID or Phone to Verify"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#6366f1]/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/marketplace" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Marketplace
              </Link>
              <Link href="/analytics" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Analytics
              </Link>

              <div className="my-2 border-t border-white/5" />
              <span className="px-3 text-[10px] text-white/20 uppercase tracking-widest">Login As</span>

              {loginOptions.map((opt) => (
                <Link
                  key={opt.href}
                  href={opt.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  <div className="ml-auto w-2 h-2 rounded-full opacity-60" style={{ background: opt.color }} />
                </Link>
              ))}

              <div className="my-2 border-t border-white/5" />

              <Link
                href="/agent/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-amber-400/70 hover:text-amber-400 transition-colors px-3 py-2 rounded-lg hover:bg-amber-500/5"
              >
                🤝 Partner as Agent
              </Link>
              <Link
                href="/worker/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold mt-2 text-center px-5 py-2.5 rounded-xl text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Register as Worker
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
