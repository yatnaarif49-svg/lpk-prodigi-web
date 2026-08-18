'use client';

import React, { useState } from 'react';
import { UserCheck, School, GraduationCap, Search, Phone, Mail, Pencil, Trash2, Plus } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PageHeader } from './ui/PageHeader';
import { StatCard } from './ui/StatCard';
import { toast } from '../store/useToastStore';

interface MarketingMember {
  id: string;
  nama: string;
  wilayah: string;
  kontak: string;
  email: string;
  sekolahHandled: number;
  lpkDidampingi: number;
  siswaDiakuisisi: number;
  status: 'Aktif' | 'Cuti' | 'Baru';
}

const INITIAL_MEMBERS: MarketingMember[] = [
  { id: '1', nama: 'Budi Santoso', wilayah: 'Jabodetabek', kontak: '081234567890', email: 'budi@soprodigi.id', sekolahHandled: 18, lpkDidampingi: 4, siswaDiakuisisi: 156, status: 'Aktif' },
  { id: '2', nama: 'Citra Amelia', wilayah: 'Jawa Barat', kontak: '085678901234', email: 'citra@soprodigi.id', sekolahHandled: 15, lpkDidampingi: 3, siswaDiakuisisi: 98, status: 'Aktif' },
  { id: '3', nama: 'Dedi Kurniawan', wilayah: 'Jawa Tengah', kontak: '082134567890', email: 'dedi@soprodigi.id', sekolahHandled: 9, lpkDidampingi: 2, siswaDiakuisisi: 61, status: 'Cuti' },
  { id: '4', nama: 'Eka Pratiwi', wilayah: 'Jawa Timur', kontak: '083198765432', email: 'eka@soprodigi.id', sekolahHandled: 5, lpkDidampingi: 1, siswaDiakuisisi: 23, status: 'Baru' },
];

interface FormState {
  nama: string;
  wilayah: string;
  kontak: string;
  email: string;
  status: MarketingMember['status'];
}

const EMPTY_FORM: FormState = {
  nama: '',
  wilayah: '',
  kontak: '',
  email: '',
  status: 'Baru',
};

export const MarketingTeamModule: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketingMember | null>(null);

  const [members, setMembers] = useState<MarketingMember[]>(INITIAL_MEMBERS);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (m: MarketingMember) => {
    setEditingId(m.id);
    setFormData({
      nama: m.nama,
      wilayah: m.wilayah,
      kontak: m.kontak,
      email: m.email,
      status: m.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...formData } : m))
      );
      toast.success(`Data ${formData.nama} berhasil diperbarui`);
    } else {
      const newMember: MarketingMember = {
        id: String(Date.now()),
        ...formData,
        sekolahHandled: 0,
        lpkDidampingi: 0,
        siswaDiakuisisi: 0,
      };
      setMembers((prev) => [newMember, ...prev]);
      toast.success(`Marketing ${newMember.nama} berhasil ditambahkan`);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    toast.success(`Data marketing ${deleteTarget.nama} dihapus`);
    setDeleteTarget(null);
  };

  const filtered = members.filter(
    (m) =>
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.wilayah.toLowerCase().includes(search.toLowerCase())
  );

  const totalSiswa = members.reduce((sum, m) => sum + m.siswaDiakuisisi, 0);
  const totalSekolah = members.reduce((sum, m) => sum + m.sekolahHandled, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Tim Marketing"
        subtitle="Monitoring kinerja marketing, sekolah handled, dan akuisisi siswa."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/25"
          >
            <Plus size={16} /> Tambah Marketing
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Marketing"
          value={members.length}
          delta={0}
          icon={<UserCheck size={20} className="text-brand-600" />}
          iconBgClass="bg-brand-50"
        />
        <StatCard
          label="Sekolah Terhandled"
          value={totalSekolah}
          delta={9}
          icon={<School size={20} className="text-amber-600" />}
          iconBgClass="bg-amber-50"
        />
        <StatCard
          label="Akuisisi Siswa"
          value={totalSiswa}
          delta={14}
          icon={<GraduationCap size={20} className="text-emerald-600" />}
          iconBgClass="bg-emerald-50"
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-card flex-1 sm:max-w-md">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari nama / wilayah marketing..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4 hover:shadow-pop hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-ink-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {m.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{m.nama}</h3>
                  <p className="text-xs text-slate-500 truncate">Wilayah: {m.wilayah}</p>
                </div>
              </div>
              <Badge tone={m.status === 'Aktif' ? 'success' : m.status === 'Cuti' ? 'warning' : 'info'}>
                {m.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">{m.sekolahHandled}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sekolah</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">{m.lpkDidampingi}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">LPK</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">{m.siswaDiakuisisi}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Siswa</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-500 min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Phone size={12} className="shrink-0" /> {m.kontak}
                </span>
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Mail size={12} className="shrink-0" /> {m.email}
                </span>
              </div>
              <span className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => openEdit(m)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                  aria-label={`Edit ${m.nama}`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(m)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  aria-label={`Hapus ${m.nama}`}
                >
                  <Trash2 size={13} />
                </button>
              </span>
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
        title={editingId ? 'Edit Data Marketing' : 'Tambah Marketing Baru'}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="Nama marketing"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Wilayah</label>
              <input
                type="text"
                required
                value={formData.wilayah}
                onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
                placeholder="Contoh: Jawa Barat"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MarketingMember['status'] })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500 bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Baru">Baru</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">No. HP / Whatsapp</label>
            <input
              type="text"
              required
              value={formData.kontak}
              onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="nama@soprodigi.id"
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
              {editingId ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Data Marketing"
        message={`Yakin ingin menghapus data marketing "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
