import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@armygurl/shared';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        localStorage.setItem('agw_token', accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('agw_token');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...updates } });
      },
    }),
    {
      name: 'agw-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
