'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, Building2, Users, AlertCircle } from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '../store/useAuthStore';

interface DemoCard {
  role: keyof typeof DEMO_ACCOUNTS;
  label: string;
  email: string;
  password: string;
  description: string;
  icon: React.ReactNode;
}

const DEMO_CARDS: DemoCard[] = [
  {
    role: 'pusat',
    label: 'Pusat',
    email: 'admin@prodigi.id',
    password: 'admin123',
    description: 'Monitoring seluruh operasional',
    icon: <ShieldCheck size={18} />,
  },
  {
    role: 'marketing',
    label: 'Marketing',
    email: 'budi@prodigi.id',
    password: 'marketing123',
    description: 'Sekolah & LPK Penyangga',
    icon: <Users size={18} />,
  },
  {
    role: 'lpk_penyangga',
    label: 'LPK Penyangga',
    email: 'lpk.binakarya@gmail.com',
    password: 'lpk123',
    description: 'LPK Bina Karya',
    icon: <Building2 size={18} />,
  },
];

export const LoginPage: React.FC = () => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login gagal');
        setLoading(false);
      }
    }, 400);
  };

  const fillDemo = (demo: DemoCard) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-ink-950 text-white flex-col justify-between p-12">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-600/40">
              P
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wide">LPK SO PRODIGI</h1>
              <p className="text-xs text-slate-500">Sistem Informasi Pengelolaan LPK</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Satu platform untuk seluruh{' '}
            <span className="text-brand-500">ekosistem penempatan kerja</span>.
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Kelola data siswa, sekolah prospek, LPK Penyangga, dan tim marketing
            dalam satu dashboard yang cepat dan mudah digunakan.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
            {[
              { icon: <GraduationCap size={18} />, value: '1.240+', label: 'Siswa' },
              { icon: <Building2 size={18} />, value: '28', label: 'LPK Mitra' },
              { icon: <SchoolIcon />, value: '145', label: 'Sekolah' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-brand-400 mb-2">{item.icon}</div>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-[11px] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} LPK SO PRODIGI. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-600/30">
              P
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900">LPK SO PRODIGI</h1>
              <p className="text-xs text-slate-500">Sistem Informasi Pengelolaan LPK</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Selamat Datang 👋</h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Masuk ke akun Anda untuk mengelola data LPK SO PRODIGI.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@prodigi.id"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Tampilkan password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-brand-600/25"
            >
              {loading ? 'Memproses...' : 'Masuk'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Akun Demo
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_CARDS.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => fillDemo(demo)}
                  className="flex items-center gap-3 text-left bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-card transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition">
                    {demo.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800">{demo.label}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {demo.email} · {demo.password}
                    </p>
                  </div>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-brand-600 transition shrink-0" />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Klik kartu untuk mengisi kredensial, lalu tekan <span className="font-semibold">Masuk</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SchoolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default LoginPage;
