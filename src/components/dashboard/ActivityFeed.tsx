import React from 'react';
import { UserPlus, FileCheck2, CalendarCheck, BadgeCheck } from 'lucide-react';

interface Activity {
  id: number;
  icon: 'siswa' | 'dokumen' | 'sekolah' | 'lpk';
  title: string;
  desc: string;
  time: string;
}

const iconMap: Record<Activity['icon'], { node: React.ReactNode; bg: string }> = {
  siswa: { node: <UserPlus size={14} />, bg: 'bg-brand-50 text-brand-600' },
  dokumen: { node: <FileCheck2 size={14} />, bg: 'bg-emerald-50 text-emerald-600' },
  sekolah: { node: <CalendarCheck size={14} />, bg: 'bg-amber-50 text-amber-600' },
  lpk: { node: <BadgeCheck size={14} />, bg: 'bg-sky-50 text-sky-600' },
};

const ACTIVITIES: Activity[] = [
  { id: 1, icon: 'siswa', title: 'Siswa baru terdaftar', desc: 'Ahmad Rizky — LPK Bina Karya', time: '5 menit lalu' },
  { id: 2, icon: 'dokumen', title: 'Dokumen terverifikasi', desc: 'Paspor Siti Rahma disetujui', time: '1 jam lalu' },
  { id: 3, icon: 'sekolah', title: 'Kunjungan sekolah', desc: 'SMKN 1 Bandung status menjadi Hot', time: '3 jam lalu' },
  { id: 4, icon: 'lpk', title: 'LPK Penyangga baru', desc: 'LPK Sinar Nusantara bergabung', time: 'Kemarin' },
];

export const ActivityFeed: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-slate-800">Aktivitas Terbaru</h3>
      <button className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition">
        Lihat semua
      </button>
    </div>

    <div className="space-y-1">
      {ACTIVITIES.map((a) => {
        const icon = iconMap[a.icon];
        return (
          <div key={a.id} className="flex gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${icon.bg}`}>
              {icon.node}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-800">{a.title}</p>
              <p className="text-xs text-slate-500 truncate">{a.desc}</p>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 pt-1">{a.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);
