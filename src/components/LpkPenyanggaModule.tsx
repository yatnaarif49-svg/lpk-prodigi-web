'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Building2, ShieldCheck, Mail, Users, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PageHeader } from './ui/PageHeader';
import { StatCard } from './ui/StatCard';
import { toast } from '../store/useToastStore';

interface LpkPenyangga {
  id: string;
  namaLpk: string;
  penanggungJawab: string;
  email: string;
  wilayah: string;
  jumlahSiswaActive: number;
  marketingPendamping: string;
  targetKeberangkatan: number;
  akreditasi: 'Terakreditasi' | 'Proses';
}

const INITIAL_LPK: LpkPenyangga[] = [
  {
    id: '1',
    namaLpk: 'LPK Bina Karya Mandiri',
    penanggungJawab: 'Dra. Endang Rahayu',
    email: 'admin@binakarya.com',
    wilayah: 'Jawa Barat',
    jumlahSiswaActive: 42,
    marketingPendamping: 'Budi (Team Marketing)',
    targetKeberangkatan: 50,
    akreditasi: 'Terakreditasi',
  },
  {
    id: '2',
    namaLpk: 'LPK Sinar Nusantara',
    penanggungJawab: 'Bpk. Triyono M.Pd',
    email: 'sinar.nusantara@gmail.com',
    wilayah: 'Jawa Tengah',
    jumlahSiswaActive: 28,
    marketingPendamping: 'Budi (Team Marketing)',
    targetKeberangkatan: 35,
    akreditasi: 'Terakreditasi',
  },
  {
    id: '3',
    namaLpk: 'LPK Harapan Bangsa',
    penanggungJawab: 'Ibu Marlina S.Sos',
    email: 'harapan.bangsa@gmail.com',
    wilayah: 'Jawa Timur',
    jumlahSiswaActive: 15,
    marketingPendamping: 'Citra (Team Marketing)',
    targetKeberangkatan: 30,
    akreditasi: 'Proses',
  },
];

interface FormState {
  namaLpk: string;
  penanggungJawab: string;
  email: string;
  wilayah: string;
  marketingPendamping: string;
}

const EMPTY_FORM: FormState = {
  namaLpk: '',
  penanggungJawab: '',
  email: '',
  wilayah: '',
  marketingPendamping: '',
};

export const LpkPenyanggaModule: React.FC = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LpkPenyangga | null>(null);

  const [lpkList, setLpkList] = useState<LpkPenyangga[]>(INITIAL_LPK);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (lpk: LpkPenyangga) => {
    setEditingId(lpk.id);
    setFormData({
      namaLpk: lpk.namaLpk,
      penanggungJawab: lpk.penanggungJawab,
      email: lpk.email,
      wilayah: lpk.wilayah,
      marketingPendamping: lpk.marketingPendamping,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setLpkList((prev) =>
        prev.map((l) => (l.id === editingId ? { ...l, ...formData } : l))
      );
      toast.success(`Mitra LPK ${formData.namaLpk} berhasil diperbarui`);
    } else {
      const newLpk: LpkPenyangga = {
        id: String(Date.now()),
        ...formData,
        jumlahSiswaActive: 0,
        targetKeberangkatan: 0,
        akreditasi: 'Proses',
      };
      setLpkList((prev) => [newLpk, ...prev]);
      toast.success(`Mitra LPK ${newLpk.namaLpk} berhasil didaftarkan`);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setLpkList((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    toast.success(`Mitra LPK ${deleteTarget.namaLpk} dihapus`);
    setDeleteTarget(null);
  };

  const totalSiswa = lpkList.reduce((sum, l) => sum + l.jumlahSiswaActive, 0);
  const totalTarget = lpkList.reduce((sum, l) => sum + l.targetKeberangkatan, 0);

  const canAdd = user?.role === 'pusat';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Profil & Kemitraan LPK Penyangga"
        subtitle="Pusat kontrol pendaftaran LPK Penyangga mitra LPK SO PRODIGI."
        actions={
          canAdd && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/25"
            >
              <Plus size={16} /> Tambah Mitra LPK Penyangga
            </button>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Mitra LPK"
          value={lpkList.length}
          delta={10}
          icon={<Building2 size={20} className="text-brand-600" />}
          iconBgClass="bg-brand-50"
        />
        <StatCard
          label="Siswa Aktif Total"
          value={totalSiswa}
          delta={12}
          icon={<Users size={20} className="text-sky-600" />}
          iconBgClass="bg-sky-50"
        />
        <StatCard
          label="Target Keberangkatan"
          value={totalTarget}
          delta={8}
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          iconBgClass="bg-emerald-50"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lpkList.map((lpk) => (
          <div
            key={lpk.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4 hover:shadow-pop hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{lpk.namaLpk}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={12} className="text-emerald-500 shrink-0" /> Wilayah: {lpk.wilayah}
                  </p>
                </div>
              </div>
              <Badge tone={lpk.akreditasi === 'Terakreditasi' ? 'success' : 'warning'}>
                {lpk.akreditasi}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div className="min-w-0">
                <p className="text-slate-400">Penanggung Jawab:</p>
                <p className="font-semibold text-slate-700 truncate">{lpk.penanggungJawab}</p>
              </div>
              <div className="min-w-0">
                <p className="text-slate-400">Email Akses Login:</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1 truncate">
                  <Mail size={12} className="shrink-0" /> {lpk.email}
                </p>
              </div>
            </div>

            {/* Progress towards target */}
            <div className="bg-slate-50 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <Users size={14} /> Total Siswa Aktif:
                </span>
                <span className="font-bold text-brand-600">{lpk.jumlahSiswaActive} Siswa</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Target keberangkatan</span>
                  <span>
                    {lpk.jumlahSiswaActive}/{lpk.targetKeberangkatan}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((lpk.jumlahSiswaActive / (lpk.targetKeberangkatan || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">
                Marketing Pendamping: <span className="font-semibold text-slate-700">{lpk.marketingPendamping}</span>
              </span>
              {canAdd && (
                <span className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => openEdit(lpk)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                    aria-label={`Edit ${lpk.namaLpk}`}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(lpk)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    aria-label={`Hapus ${lpk.namaLpk}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        title={editingId ? 'Edit Mitra LPK Penyangga' : 'Registrasi LPK Penyangga Baru'}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama LPK Penyangga</label>
            <input
              type="text"
              required
              value={formData.namaLpk}
              onChange={(e) => setFormData({ ...formData, namaLpk: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="Contoh: LPK Jaya Mandiri"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Kredensial Akses</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="email@lpk.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Penanggung Jawab</label>
              <input
                type="text"
                required
                value={formData.penanggungJawab}
                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Wilayah Operasional</label>
              <input
                type="text"
                required
                value={formData.wilayah}
                onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
                placeholder="Contoh: Jawa Barat"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Marketing Pendamping</label>
            <input
              type="text"
              required
              value={formData.marketingPendamping}
              onChange={(e) => setFormData({ ...formData, marketingPendamping: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="Nama Marketing"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingId(null);
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-sm transition"
            >
              {editingId ? 'Simpan Perubahan' : 'Buat Akun LPK'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Mitra LPK"
        message={`Yakin ingin menghapus mitra "${deleteTarget?.namaLpk}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
