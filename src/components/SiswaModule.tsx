'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Upload, FileText, Search, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';
import { Badge, BadgeTone } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PageHeader } from './ui/PageHeader';
import { toast } from '../store/useToastStore';

interface Siswa {
  id: string;
  nama: string;
  nik: string;
  sekolahAsal: string;
  lpkPenyangga: string;
  status: 'Pendaftaran' | 'Pelatihan' | 'Matching' | 'Berangkat';
  pasporUploaded: boolean;
  ijazahUploaded: boolean;
}

const STATUS_TONE: Record<Siswa['status'], BadgeTone> = {
  Pendaftaran: 'neutral',
  Pelatihan: 'info',
  Matching: 'warning',
  Berangkat: 'success',
};

const INITIAL_SISWA: Siswa[] = [
  { id: '1', nama: 'Ahmad Rizky', nik: '3201123456780001', sekolahAsal: 'SMKN 1 Jakarta', lpkPenyangga: 'LPK Bina Karya', status: 'Pelatihan', pasporUploaded: true, ijazahUploaded: true },
  { id: '2', nama: 'Siti Rahma', nik: '3201123456780002', sekolahAsal: 'SMK 2 Depok', lpkPenyangga: 'LPK Mitra Mandiri', status: 'Matching', pasporUploaded: true, ijazahUploaded: false },
  { id: '3', nama: 'Budi Santoso', nik: '3201123456780003', sekolahAsal: 'SMKN 1 Bandung', lpkPenyangga: 'LPK Bina Karya', status: 'Berangkat', pasporUploaded: true, ijazahUploaded: true },
  { id: '4', nama: 'Dewi Lestari', nik: '3201123456780004', sekolahAsal: 'SMK Taruna Karya', lpkPenyangga: 'LPK Sinar Nusantara', status: 'Pendaftaran', pasporUploaded: false, ijazahUploaded: false },
];

interface FormState {
  nama: string;
  nik: string;
  sekolahAsal: string;
  status: Siswa['status'];
  paspor: File | null;
  ijazah: File | null;
}

const EMPTY_FORM: FormState = {
  nama: '',
  nik: '',
  sekolahAsal: '',
  status: 'Pendaftaran',
  paspor: null,
  ijazah: null,
};

export const SiswaModule: React.FC = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Siswa | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | Siswa['status']>('Semua');

  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (s: Siswa) => {
    setEditingId(s.id);
    setFormData({
      nama: s.nama,
      nik: s.nik,
      sekolahAsal: s.sekolahAsal,
      status: s.status,
      paspor: null,
      ijazah: null,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setSiswaList((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                nama: formData.nama,
                nik: formData.nik,
                sekolahAsal: formData.sekolahAsal,
                status: formData.status,
                pasporUploaded: formData.paspor ? true : s.pasporUploaded,
                ijazahUploaded: formData.ijazah ? true : s.ijazahUploaded,
              }
            : s
        )
      );
      toast.success(`Data siswa ${formData.nama} berhasil diperbarui`);
    } else {
      const newSiswa: Siswa = {
        id: String(Date.now()),
        nama: formData.nama,
        nik: formData.nik,
        sekolahAsal: formData.sekolahAsal,
        lpkPenyangga: user?.penyanggaName || 'LPK SO PRODIGI',
        status: formData.status,
        pasporUploaded: !!formData.paspor,
        ijazahUploaded: !!formData.ijazah,
      };
      setSiswaList((prev) => [newSiswa, ...prev]);
      toast.success(`Data siswa ${newSiswa.nama} berhasil disimpan`);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setSiswaList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success(`Data siswa ${deleteTarget.nama} dihapus`);
    setDeleteTarget(null);
  };

  const filteredSiswa = siswaList.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.sekolahAsal.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status: Siswa['status']) =>
    siswaList.filter((s) => s.status === status).length;

  const canAdd = user?.role === 'lpk_penyangga' || user?.role === 'pusat';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Data Siswa"
        subtitle="Kelola informasi siswa, verifikasi dokumen paspor dan ijazah."
        actions={
          canAdd && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/25"
            >
              <Plus size={16} /> Tambah Siswa Baru
            </button>
          )
        }
      />

      {/* Status pipeline chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            { label: 'Pendaftaran', count: countByStatus('Pendaftaran'), tone: 'neutral' as BadgeTone },
            { label: 'Pelatihan', count: countByStatus('Pelatihan'), tone: 'info' as BadgeTone },
            { label: 'Matching', count: countByStatus('Matching'), tone: 'warning' as BadgeTone },
            { label: 'Berangkat', count: countByStatus('Berangkat'), tone: 'success' as BadgeTone },
          ]
        ).map((chip) => (
          <button
            key={chip.label}
            onClick={() => setStatusFilter(statusFilter === chip.label ? 'Semua' : chip.label as Siswa['status'])}
            className={`flex items-center justify-between gap-2 bg-white rounded-xl border px-4 py-3.5 transition-all ${
              statusFilter === chip.label
                ? 'border-brand-600 ring-2 ring-brand-600/15 shadow-card'
                : 'border-slate-200 shadow-card hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-semibold text-slate-600">{chip.label}</span>
            <Badge tone={chip.tone}>{chip.count}</Badge>
          </button>
        ))}
      </div>

      {/* Search & Summary */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-card flex-1 sm:max-w-md">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari nama siswa / sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
          Menampilkan <span className="font-bold text-slate-800">{filteredSiswa.length}</span> dari {siswaList.length} siswa
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b">
              <tr>
                <th className="p-4">Nama / NIK</th>
                <th className="p-4">Sekolah Asal</th>
                <th className="p-4">LPK Penyangga</th>
                <th className="p-4">Dokumen (Paspor / Ijazah)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSiswa.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{s.nama}</p>
                    <p className="text-xs text-slate-400">NIK: {s.nik}</p>
                  </td>
                  <td className="p-4">{s.sekolahAsal}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs bg-slate-100 rounded text-slate-700 font-medium">
                      {s.lpkPenyangga}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 text-xs ${s.pasporUploaded ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                        {s.pasporUploaded ? <CheckCircle size={14} /> : <Clock size={14} />} Paspor
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${s.ijazahUploaded ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                        {s.ijazahUploaded ? <CheckCircle size={14} /> : <Clock size={14} />} Ijazah
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                        aria-label={`Edit ${s.nama}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        aria-label={`Hapus ${s.nama}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-slate-400">
                    Tidak ada data siswa yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit Siswa */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        title={editingId ? 'Edit Data Siswa' : 'Tambah Data Siswa Baru'}
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Siswa</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full text-sm border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">NIK</label>
              <input
                type="text"
                required
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full text-sm border border-slate-300 p-2.5 rounded-lg outline-brand-500"
                placeholder="16 digit NIK"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sekolah Asal</label>
              <input
                type="text"
                required
                value={formData.sekolahAsal}
                onChange={(e) => setFormData({ ...formData, sekolahAsal: e.target.value })}
                className="w-full text-sm border border-slate-300 p-2.5 rounded-lg outline-brand-500"
                placeholder="Contoh: SMKN 1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Siswa['status'] })}
              className="w-full text-sm border border-slate-300 p-2.5 rounded-lg outline-brand-500 bg-white"
            >
              <option value="Pendaftaran">Pendaftaran</option>
              <option value="Pelatihan">Pelatihan</option>
              <option value="Matching">Matching</option>
              <option value="Berangkat">Berangkat</option>
            </select>
          </div>

          {/* Upload Dokumen */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-slate-700">Upload Berkas Dokumen</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-dashed border-slate-300 p-3 rounded-lg text-center hover:bg-slate-50 transition">
                <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 font-medium block">Scan Paspor</span>
                <input
                  type="file"
                  className="hidden"
                  id="paspor-file"
                  onChange={(e) => setFormData({ ...formData, paspor: e.target.files?.[0] || null })}
                />
                <label htmlFor="paspor-file" className="text-[10px] text-brand-600 hover:underline cursor-pointer">
                  {formData.paspor ? formData.paspor.name : 'Pilih File (PDF/JPG)'}
                </label>
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg text-center hover:bg-slate-50 transition">
                <FileText size={20} className="mx-auto text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 font-medium block">Scan Ijazah</span>
                <input
                  type="file"
                  className="hidden"
                  id="ijazah-file"
                  onChange={(e) => setFormData({ ...formData, ijazah: e.target.files?.[0] || null })}
                />
                <label htmlFor="ijazah-file" className="text-[10px] text-brand-600 hover:underline cursor-pointer">
                  {formData.ijazah ? formData.ijazah.name : 'Pilih File (PDF/JPG)'}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
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
              {editingId ? 'Simpan Perubahan' : 'Simpan Data Siswa'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Data Siswa"
        message={`Yakin ingin menghapus data siswa "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
