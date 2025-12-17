import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  rg: string;
  role: "admin" | "teacher" | "student";
  groupId?: number;
  addressId?: number;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await apiService.login(email, password);
          const { user: userData, token: userToken } = response.data;

          set({
            user: userData,
            token: userToken,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          console.error("Erro no login:", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        // Limpar sessionStorage antigo (compatibilidade)
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("adminAuth");
          sessionStorage.removeItem("alunoAuth");
          sessionStorage.removeItem("studentEmail");
        }
      },

      setUser: (user: User | null) => set({ user }),

      setToken: (token: string | null) => set({ token }),

      isAuthenticated: () => {
        const state = get();
        return !!state.user && !!state.token;
      },

      isAdmin: () => {
        const state = get();
        return state.user?.role === "admin";
      },

      isTeacher: () => {
        const state = get();
        return state.user?.role === "teacher";
      },

      isStudent: () => {
        const state = get();
        return state.user?.role === "student";
      },
    }),
    {
      name: "auth-storage", // nome da key no localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
