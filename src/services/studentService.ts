export interface Siswa {
  id: string;
  nama: string;
  nik: string;
  sekolahAsal: string;
  lpkPenyangga: string;
  status: 'Pendaftaran' | 'Pelatihan' | 'Matching' | 'Berangkat';
  pasporUploaded: boolean;
  ijazahUploaded: boolean;
}

export interface StudentInput {
  namaLengkap: string;
  nik: string;
  sekolahAsal: string;
  lpkPenyanggaId?: string;
  status: Siswa['status'];
}

// Helper internal untuk memvalidasi dan mengurai respons JSON dengan aman
async function handleResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!isJson) {
    throw new Error(`Server mengembalikan respons non-JSON (Status ${res.status}). Pastikan endpoint API Express sudah benar.`);
  }

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.error || json.message || `Terjadi kesalahan pada server (Status ${res.status})`);
  }

  return json;
}

export const studentService = {
  // Ambil semua data siswa dari API Express
  getAll: async (): Promise<Siswa[]> => {
    const res = await fetch('/api/admin/students', {
      headers: {
        'Accept': 'application/json',
      },
    });

    const json = await handleResponse<{ success: boolean; data: any[] }>(res);

    // Pastikan json.data adalah array sebelum melakukan mapping
    const rawData = Array.isArray(json.data) ? json.data : [];

    return rawData.map((item: any) => ({
      id: item.id,
      nama: item.namaLengkap,
      nik: item.nik,
      sekolahAsal: item.sekolahAsal,
      lpkPenyangga: item.namaLpk || 'LPK SO PRODIGI',
      status: item.status,
      pasporUploaded: Boolean(item.pasporUploaded),
      ijazahUploaded: Boolean(item.ijazahUploaded),
    }));
  },

  // Simpan data siswa baru
  create: async (payload: StudentInput) => {
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  },

  // Perbarui data siswa
  update: async (id: string, payload: Partial<StudentInput>) => {
    const res = await fetch(`/api/admin/students/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  },

  // Hapus data siswa
  delete: async (id: string) => {
    const res = await fetch(`/api/admin/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    return await handleResponse(res);
  },
};