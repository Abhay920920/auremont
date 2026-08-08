import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user, token, refreshToken) => set({ user, token, ...(refreshToken ? { refreshToken } : {}) }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'rarenuts-auth',
    }
  )
);
