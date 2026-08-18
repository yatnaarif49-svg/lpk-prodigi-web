import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  login: (email: string, password: string) => Promise<LoginResult>;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activePage: 'dashboard',
      setActivePage: (page: Page) => set({ activePage: page }),

      login: async (email, password) => {
        const normalized = email.trim().toLowerCase();

        // 1. Coba Authenticate via API Backend terlebih dahulu
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email: normalized, password }),
          });

          // Cek apakah response berupa JSON sebelum diparsing
          const contentType = response.headers.get('content-type');
          const isJson = contentType && contentType.includes('application/json');

          if (isJson) {
            const data = await response.json();

            if (response.ok && data.success && data.user) {
              set({ user: data.user, activePage: 'dashboard' });
              return { success: true };
            }

            // Jika API merespons error JSON resmi dan BUKAN email akun demo, kembalikan error API
            if (!response.ok && data.error && !DEMO_CREDENTIALS[normalized]) {
              return { success: false, error: data.error };
            }
          } else {
            console.warn(`API backend mengembalikan status ${response.status} non-JSON. Beralih ke fallback demo.`);
          }
        } catch (error) {
          console.warn('API backend tidak dapat dijangkau, menggunakan autentikasi akun demo:', error);
        }

        // 2. Fallback ke Akun Demo (jika API offline, mengembalikan HTML/405/500, atau dalam tahap development)
        const credential = DEMO_CREDENTIALS[normalized];

        if (!credential) {
          return { success: false, error: 'Email tidak terdaftar.' };
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
    }),
    {
      name: 'auth-storage', // Key di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, activePage: state.activePage }), // Menyimpan field spesifik saja
    }
  )
);