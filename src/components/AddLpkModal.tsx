import React, { useState } from 'react';
import { adminService, LpkData } from '../services/adminService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddLpkModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<LpkData>({
    name: '',
    email: '',
    password: '',
    namaLpk: '',
    penanggungJawab: '',
    wilayah: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await adminService.createLpk(formData);
    if (res.success) {
      alert('LPK Penyangga berhasil ditambahkan!');
      onSuccess();
      onClose();
    } else {
      alert('Gagal menambahkan LPK: ' + res.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Tambah LPK Penyangga Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nama LPK (contoh: LPK Bina Karya)"
            className="w-full p-2 border rounded"
            required
            onChange={(e) => setFormData({ ...formData, namaLpk: e.target.value })}
          />
          <input
            type="text"
            placeholder="Penanggung Jawab"
            className="w-full p-2 border rounded"
            required
            onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Wilayah (contoh: Jawa Tengah)"
            className="w-full p-2 border rounded"
            required
            onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Login"
            className="w-full p-2 border rounded"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};