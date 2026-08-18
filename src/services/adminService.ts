export interface LpkData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  namaLpk: string;
  penanggungJawab: string;
  wilayah: string;
}

export interface StudentData {
  id?: string;
  namaLengkap: string;
  nik: string;
  sekolahAsal: string;
  lpkPenyanggaId: string;
  status: 'Pendaftaran' | 'Pelatihan' | 'Matching' | 'Berangkat';
}

export const adminService = {
  // Stats
  getStats: () => fetch('/api/admin/stats').then((res) => res.json()),

  // LPK CRUD
  getLpkList: () => fetch('/api/admin/lpk').then((res) => res.json()),
  createLpk: (data: LpkData) =>
    fetch('/api/admin/lpk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteLpk: (id: string) =>
    fetch(`/api/admin/lpk/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  // Student CRUD
  getStudents: () => fetch('/api/admin/students').then((res) => res.json()),
  createStudent: (data: StudentData) =>
    fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateStudent: (id: string, data: Partial<StudentData>) =>
    fetch(`/api/admin/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteStudent: (id: string) =>
    fetch(`/api/admin/students/${id}`, { method: 'DELETE' }).then((res) => res.json()),
};