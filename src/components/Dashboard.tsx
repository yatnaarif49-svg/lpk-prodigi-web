'use client';

import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Building2, School, GraduationCap, Plus, ArrowRight, CalendarCheck, UserCheck } from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { Barchart } from './dashboard/Barchart';
import { PipelineOverview } from './dashboard/PipelineOverview';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { Badge, BadgeTone } from './ui/Badge';
import { toast } from '../store/useToastStore';

interface RecentSiswaRow {
  nama: string;
  sekolah: string;
  lpk: string;
  status: string;
  tone: BadgeTone;
}

const RECENT_SISWA: RecentSiswaRow[] = [
  { nama: 'Ahmad Rizky', sekolah: 'SMKN 1 Jakarta', lpk: 'LPK Bina Karya', status: 'Pelatihan', tone: 'info' },
  { nama: 'Siti Rahma', sekolah: 'SMK 2 Depok', lpk: 'LPK Mitra Mandiri', status: 'Matching', tone: 'warning' },
  { nama: 'Budi Santoso', sekolah: 'SMKN 1 Bandung', lpk: 'LPK Bina Karya', status: 'Berangkat', tone: 'success' },
  { nama: 'Dewi Lestari', sekolah: 'SMK Taruna Karya', lpk: 'LPK Sinar Nusantara', status: 'Pendaftaran', tone: 'neutral' },
];

export const Dashboard: React.FC = () => {
  const { user, setActivePage } = useAuthStore();

  if (!user) return null;

  const role = user.role;
  const isPusat = role === 'pusat';
  const isMarketing = role === 'marketing';
  const isLpk = role === 'lpk_penyangga';

  const greeting =
    role === 'pusat'
      ? 'Pantau seluruh operasional LPK secara real-time.'
      : role === 'marketing'
        ? 'Kelola prospek sekolah dan pendampingan LPK Penyangga Anda.'
        : `Panel pengelolaan data siswa — ${user.penyanggaName || 'LPK Anda'}.`;

  const quickActionLabel = role === 'lpk_penyangga'
    ? 'Tambah Data Siswa'
    : role === 'marketing'
      ? 'Catat Kunjungan Sekolah'
      : 'Tambah Data Baru';

  const handleQuickAction = () => {
    if (role === 'lpk_penyangga') {
      setActivePage('siswa');
      toast.success('Formulir tambah siswa telah dibuka');
    } else if (role === 'marketing') {
      setActivePage('sekolah');
      toast.success('Formulir prospek sekolah telah dibuka');
    } else {
      setActivePage('siswa');
      toast.info('Silakan pilih modul untuk mulai menambahkan data');
    }
  };

  const stats = isPusat
    ? [
        { label: 'Total Marketing', value: 12, delta: 0, icon: <Users size={20} className="text-brand-600" />, iconBg: 'bg-brand-50' },
        { label: 'LPK Penyangga', value: 28, delta: 8, icon: <Building2 size={20} className="text-sky-600" />, iconBg: 'bg-sky-50' },
        { label: 'Sekolah Binaan', value: 145, delta: 12, icon: <School size={20} className="text-amber-600" />, iconBg: 'bg-amber-50' },
        { label: 'Total Siswa', value: 1240, delta: 5.2, icon: <GraduationCap size={20} className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
      ]
    : isMarketing
      ? [
          { label: 'Sekolah Handled', value: 18, delta: 3, icon: <School size={20} className="text-amber-600" />, iconBg: 'bg-amber-50' },
          { label: 'LPK Didampingi', value: 4, delta: 0, icon: <Building2 size={20} className="text-sky-600" />, iconBg: 'bg-sky-50' },
          { label: 'Akuisisi Siswa', value: 156, delta: 14, icon: <GraduationCap size={20} className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
          { label: 'Prospek Aktif', value: 32, delta: -2, icon: <CalendarCheck size={20} className="text-brand-600" />, iconBg: 'bg-brand-50' },
        ]
      : [
          { label: 'Siswa Terdaftar', value: 45, delta: 8, icon: <GraduationCap size={20} className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
          { label: 'Lolos Selection', value: 32, delta: 10, icon: <UserCheck size={20} className="text-brand-600" />, iconBg: 'bg-brand-50' },
          { label: 'Proses Keberangkatan', value: 13, delta: 4, icon: <Building2 size={20} className="text-sky-600" />, iconBg: 'bg-sky-50' },
          { label: 'Dokumen Lengkap', value: 21, delta: 6, icon: <School size={20} className="text-amber-600" />, iconBg: 'bg-amber-50' },
        ];

  const chartData = isPusat
    ? [
        { label: 'Jan', value: 41 },
        { label: 'Feb', value: 58 },
        { label: 'Mar', value: 47 },
        { label: 'Apr', value: 82 },
        { label: 'Mei', value: 96 },
        { label: 'Jun', value: 110 },
      ]
    : isMarketing
      ? [
          { label: 'Jan', value: 12 },
          { label: 'Feb', value: 18 },
          { label: 'Mar', value: 15 },
          { label: 'Apr', value: 24 },
          { label: 'Mei', value: 28 },
          { label: 'Jun', value: 32 },
        ]
      : [
          { label: 'Jan', value: 8 },
          { label: 'Feb', value: 14 },
          { label: 'Mar', value: 11 },
          { label: 'Apr', value: 19 },
          { label: 'Mei', value: 23 },
          { label: 'Jun', value: 45 },
        ];

  const pipelineSteps = isLpk
    ? [
        { label: 'Pendaftaran', value: 6, colorClass: 'text-slate-500', barClass: 'bg-slate-400' },
        { label: 'Pelatihan', value: 8, colorClass: 'text-sky-600', barClass: 'bg-sky-500' },
        { label: 'Matching', value: 15, colorClass: 'text-amber-600', barClass: 'bg-amber-500' },
        { label: 'Berangkat', value: 3, colorClass: 'text-emerald-600', barClass: 'bg-emerald-500' },
      ]
    : [
        { label: 'Pendaftaran', value: 320, colorClass: 'text-slate-500', barClass: 'bg-slate-400' },
        { label: 'Pelatihan', value: 240, colorClass: 'text-sky-600', barClass: 'bg-sky-500' },
        { label: 'Matching', value: 180, colorClass: 'text-amber-600', barClass: 'bg-amber-500' },
        { label: 'Berangkat', value: 64, colorClass: 'text-emerald-600', barClass: 'bg-emerald-500' },
      ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Greeting banner */}
      <div className="relative overflow-hidden bg-ink-950 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-pop">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-brand-600/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Dashboard</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
              Selamat Datang, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 max-w-xl">{greeting}</p>
          </div>

          <button
            onClick={handleQuickAction}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/30"
          >
            <Plus size={16} /> {quickActionLabel}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={s.icon}
            iconBgClass={s.iconBg}
            index={i}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Barchart
            title="Rekrutmen Siswa"
            subtitle="Jumlah pendaftar 6 bulan terakhir"
            data={chartData}
            highlightKey="Jun"
          />
        </div>
        <PipelineOverview
          title={isLpk ? 'Pipeline Siswa LPK' : 'Pipeline Siswa Nasional'}
          subtitle="Status per tahap seleksi"
          steps={pipelineSteps}
        />
      </div>

      {/* Bottom row: activity + recent siswa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityFeed />

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Siswa Terbaru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Data pendaftaran paling anyar</p>
            </div>
            <button
              onClick={() => setActivePage('siswa')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
            >
              Lihat semua <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b">
                <tr>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">Asal Sekolah</th>
                  <th className="p-3.5">LPK Penyangga</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {RECENT_SISWA.map((row) => (
                  <tr key={row.nama} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-semibold text-slate-800">{row.nama}</td>
                    <td className="p-3.5">{row.sekolah}</td>
                    <td className="p-3.5">{row.lpk}</td>
                    <td className="p-3.5">
                      <Badge tone={row.tone}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
