import { create } from 'zustand';

export type Role = 'pusat' | 'marketing' | 'lpk_penyangga';
export type Page = 'dashboard' | 'siswa' | 'sekolah' | 'lpk_penyangga' | 'marketing_team';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  penyanggaName?: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthState {
  user: User | null;
  activePage: Page;
  setActivePage: (page: Page) => void;
  login: (email: string, password: string) => LoginResult;
  loginAs: (role: Role) => void;
  logout: () => void;
}

/** Demo accounts used by the login page. */
export const DEMO_ACCOUNTS: Record<Role, User> = {
  pusat: {
    id: '1',
    name: 'Admin Prodigi',
    email: 'admin@prodigi.id',
    role: 'pusat',
  },
  marketing: {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi@prodigi.id',
    role: 'marketing',
  },
  lpk_penyangga: {
    id: '3',
    name: 'Siti Rahayu',
    email: 'lpk.binakarya@gmail.com',
    role: 'lpk_penyangga',
    penyanggaName: 'LPK Bina Karya',
  },
};

const DEMO_CREDENTIALS: Record<string, { role: Role; password: string }> = {
  'admin@prodigi.id': { role: 'pusat', password: 'admin123' },
  'budi@prodigi.id': { role: 'marketing', password: 'marketing123' },
  'lpk.binakarya@gmail.com': { role: 'lpk_penyangga', password: 'lpk123' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activePage: 'dashboard',
  setActivePage: (page: Page) => set({ activePage: page }),

  login: (email, password) => {
    const normalized = email.trim().toLowerCase();
    const credential = DEMO_CREDENTIALS[normalized];

    if (!credential) {
      return { success: false, error: 'Email tidak terdaftar. Gunakan akun demo di bawah.' };
    }
    if (credential.password !== password) {
      return { success: false, error: 'Password salah. Coba lagi.' };
    }

    const account = DEMO_ACCOUNTS[credential.role];
    set({ user: account, activePage: 'dashboard' });
    return { success: true };
  },

  loginAs: (role: Role) => {
    set({ user: DEMO_ACCOUNTS[role], activePage: 'dashboard' });
  },

  logout: () => set({ user: null, activePage: 'dashboard' }),
}));
