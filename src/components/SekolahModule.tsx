'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, School, MapPin, Phone, UserCheck, Pencil, Trash2 } from 'lucide-react';
import { Badge, BadgeTone } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PageHeader } from './ui/PageHeader';
import { toast } from '../store/useToastStore';

interface Sekolah {
  id: string;
  namaSekolah: string;
  alamat: string;
  penanggungJawab: string;
  kontak: string;
  statusProspek: 'Cold' | 'Warm' | 'Hot' | 'Mitra';
  marketingPIC: string;
}

const STATUS_TONE: Record<Sekolah['statusProspek'], BadgeTone> = {
  Cold: 'neutral',
  Warm: 'warning',
  Hot: 'danger',
  Mitra: 'success',
};

const INITIAL_SEKOLAH: Sekolah[] = [
  { id: '1', namaSekolah: 'SMKN 1 Bandung', alamat: 'Jl. Wastukencana No. 3, Bandung', penanggungJawab: 'Drs. Herman', kontak: '081234567890', statusProspek: 'Hot', marketingPIC: 'Budi (Team Marketing)' },
  { id: '2', namaSekolah: 'SMK Taruna Karya', alamat: 'Jl. Soekarno Hatta No. 45, Bekasi', penanggungJawab: 'Bpk. Ahmad S.Pd', kontak: '085678901234', statusProspek: 'Mitra', marketingPIC: 'Budi (Team Marketing)' },
  { id: '3', namaSekolah: 'SMKN 2 Bogor', alamat: 'Jl. Raya Pajajaran No. 12, Bogor', penanggungJawab: 'Ibu Ratna S.Pd', kontak: '082134567890', statusProspek: 'Warm', marketingPIC: 'Citra (Team Marketing)' },
];

interface FormState {
  namaSekolah: string;
  alamat: string;
  penanggungJawab: string;
  kontak: string;
  statusProspek: Sekolah['statusProspek'];
}

const EMPTY_FORM: FormState = {
  namaSekolah: '',
  alamat: '',
  penanggungJawab: '',
  kontak: '',
  statusProspek: 'Cold',
};

export const SekolahModule: React.FC = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sekolah | null>(null);
  const [statusFilter, setStatusFilter] = useState<'Semua' | Sekolah['statusProspek']>('Semua');

  const [sekolahList, setSekolahList] = useState<Sekolah[]>(INITIAL_SEKOLAH);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (s: Sekolah) => {
    setEditingId(s.id);
    setFormData({
      namaSekolah: s.namaSekolah,
      alamat: s.alamat,
      penanggungJawab: s.penanggungJawab,
      kontak: s.kontak,
      statusProspek: s.statusProspek,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setSekolahList((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      );
      toast.success(`Sekolah ${formData.namaSekolah} berhasil diperbarui`);
    } else {
      const newSekolah: Sekolah = {
        id: String(Date.now()),
        ...formData,
        marketingPIC: user?.name || 'Marketing',
      };
      setSekolahList((prev) => [newSekolah, ...prev]);
      toast.success(`Sekolah ${newSekolah.namaSekolah} berhasil dicatat`);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setSekolahList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success(`Sekolah ${deleteTarget.namaSekolah} dihapus`);
    setDeleteTarget(null);
  };

  const filteredList = sekolahList.filter(
    (s) => statusFilter === 'Semua' || s.statusProspek === statusFilter
  );

  const countByStatus = (status: Sekolah['statusProspek']) =>
    sekolahList.filter((s) => s.statusProspek === status).length;

  const canAdd = user?.role === 'marketing' || user?.role === 'pusat';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Data Sekolah Prospek"
        subtitle="Pendataan sekolah binaan dan status perkembangan sosialisasi marketing."
        actions={
          canAdd && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/25"
            >
              <Plus size={16} /> Catat Sekolah Prospek
            </button>
          )
        }
      />

      {/* Pipeline status chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            { label: 'Cold', count: countByStatus('Cold'), tone: 'neutral' as BadgeTone },
            { label: 'Warm', count: countByStatus('Warm'), tone: 'warning' as BadgeTone },
            { label: 'Hot', count: countByStatus('Hot'), tone: 'danger' as BadgeTone },
            { label: 'Mitra', count: countByStatus('Mitra'), tone: 'success' as BadgeTone },
          ]
        ).map((chip) => (
          <button
            key={chip.label}
            onClick={() => setStatusFilter(statusFilter === chip.label ? 'Semua' : chip.label as Sekolah['statusProspek'])}
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((s) => (
          <div
            key={s.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4 hover:shadow-pop hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <School size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{s.namaSekolah}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin size={12} className="shrink-0" /> {s.alamat}
                  </p>
                </div>
              </div>
              <Badge tone={STATUS_TONE[s.statusProspek]}>{s.statusProspek}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div className="min-w-0">
                <p className="text-slate-400">Penanggung Jawab:</p>
                <p className="font-semibold text-slate-700 truncate">{s.penanggungJawab}</p>
              </div>
              <div className="min-w-0">
                <p className="text-slate-400">Kontak HP/WA:</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1 truncate">
                  <Phone size={12} className="shrink-0" /> {s.kontak}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-500">
              <span className="flex items-center gap-1.5 min-w-0">
                <UserCheck size={12} className="shrink-0" />
                <span className="truncate">PIC: {s.marketingPIC}</span>
              </span>
              {canAdd && (
                <span className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-brand-600 hover:bg-white transition"
                    aria-label={`Edit ${s.namaSekolah}`}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-white transition"
                    aria-label={`Hapus ${s.namaSekolah}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-400">
            Tidak ada sekolah dengan status tersebut.
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        title={editingId ? 'Edit Prospek Sekolah' : 'Tambah Prospek Sekolah'}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Sekolah</label>
            <input
              type="text"
              required
              value={formData.namaSekolah}
              onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              placeholder="Contoh: SMKN 2 Bogor"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
            <textarea
              required
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kontak/Kepala Hubin</label>
              <input
                type="text"
                required
                value={formData.penanggungJawab}
                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. HP / Whatsapp</label>
              <input
                type="text"
                required
                value={formData.kontak}
                onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status Prospek</label>
            <select
              value={formData.statusProspek}
              onChange={(e) => setFormData({ ...formData, statusProspek: e.target.value as Sekolah['statusProspek'] })}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-brand-500 bg-white"
            >
              <option value="Cold">Cold (Baru Dihubungi)</option>
              <option value="Warm">Warm (Respon Positif)</option>
              <option value="Hot">Hot (Akan Presentasi)</option>
              <option value="Mitra">Mitra (Sudah MoU)</option>
            </select>
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
        title="Hapus Data Sekolah"
        message={`Yakin ingin menghapus sekolah "${deleteTarget?.namaSekolah}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
