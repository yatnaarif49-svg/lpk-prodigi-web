'use client';

import React, { useState } from 'react';
import { useAuthStore, Role, Page } from '../store/useAuthStore';
import {
  LayoutDashboard,
  School,
  GraduationCap,
  Building2,
  Users,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  Search,
  UserCircle2,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  page: Page;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['pusat', 'marketing', 'lpk_penyangga'] },
  { page: 'sekolah', label: 'Data Sekolah', icon: <School size={18} />, roles: ['pusat', 'marketing'] },
  { page: 'lpk_penyangga', label: 'LPK Penyangga', icon: <Building2 size={18} />, roles: ['pusat', 'marketing'] },
  { page: 'marketing_team', label: 'Tim Marketing', icon: <Users size={18} />, roles: ['pusat'] },
  { page: 'siswa', label: 'Data Siswa', icon: <GraduationCap size={18} />, roles: ['pusat', 'marketing', 'lpk_penyangga'] },
];

const ROLE_COPY: Record<Role, string> = {
  pusat: 'Pusat',
  marketing: 'Marketing',
  lpk_penyangga: 'LPK Penyangga',
};

const NOTIFICATIONS = [
  { id: 1, title: 'Siswa baru didaftarkan', desc: 'Ahmad Rizky — LPK Bina Karya', time: '5 menit lalu', unread: true },
  { id: 2, title: 'Dokumen perlu verifikasi', desc: 'Paspor Siti Rahma menunggu review', time: '1 jam lalu', unread: true },
  { id: 3, title: 'Kunjungan sekolah tercatat', desc: 'SMKN 1 Bandung — status Hot', time: '3 jam lalu', unread: false },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, activePage, setActivePage, loginAs, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold text-brand-500">LPK SO PRODIGI</h1>
          <p className="mt-2 text-slate-400">Silakan login terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => n.unread).length;
  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const navItemClass = (page: Page) =>
    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-all w-full text-left ${
      activePage === page
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-brand-600/30">
            P
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide leading-tight">LPK SO PRODIGI</h1>
            <p className="text-[10px] text-slate-500">Sistem Informasi Pengelolaan LPK</p>
          </div>
        </div>
      </div>

      {/* User summary */}
      <div className="px-4 pt-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink-800 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs uppercase shrink-0">
              {user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-600/15 border border-brand-600/30 text-brand-400 text-[10px] font-bold uppercase tracking-wide">
            <ShieldCheck size={11} /> {ROLE_COPY[user.role]}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu Utama</p>
        {visibleNav.map((item) => (
          <button
            key={item.page}
            onClick={() => {
              setActivePage(item.page);
              setMobileOpen(false);
            }}
            className={navItemClass(item.page)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Role simulator + logout */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div>
          <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Simulasi Role (Testing)</p>
          <div className="grid grid-cols-3 gap-1">
            {(['pusat', 'marketing', 'lpk_penyangga'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => loginAs(r)}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg border text-[10px] font-semibold transition ${
                  user.role === r
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'border-white/10 text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                {user.role === r && <Check size={9} />}
                {ROLE_COPY[r]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full text-xs font-medium text-slate-500 hover:text-brand-500 transition px-1 py-1.5"
        >
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 bg-ink-950 z-40">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-ink-950/60 z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-72 h-full bg-ink-950 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 -right-11 p-2 bg-white rounded-lg text-slate-700"
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 md:px-8 h-16">
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-900 capitalize">
                {activePage.replace('_', ' ')}
              </span>
            </div>

            {/* Search (decorative) */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md ml-6 bg-slate-100 rounded-xl px-3.5 py-2 text-slate-400 text-sm">
              <Search size={15} />
              <input
                type="text"
                placeholder="Cari data..."
                className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-1.5">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                  aria-label="Notifikasi"
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600 border-2 border-white" />
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-pop border border-slate-200 animate-scale-in overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">Notifikasi</p>
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Tandai semua dibaca
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition flex gap-3"
                        >
                          <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.unread ? 'bg-brand-500' : 'bg-slate-200'}`} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center text-[11px] font-bold uppercase">
                    {user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-pop border border-slate-200 animate-scale-in overflow-hidden">
                    <div className="px-4 py-3.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-flex mt-1.5 items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 text-[10px] font-bold uppercase tracking-wide">
                        <UserCircle2 size={11} /> {ROLE_COPY[user.role]}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>

        {/* Footer */}
        <footer className="px-4 md:px-8 py-4 border-t border-slate-200 text-xs text-slate-400">
          © {new Date().getFullYear()} LPK SO PRODIGI — Sistem Informasi Pengelolaan LPK
        </footer>
      </div>
    </div>
  );
};
