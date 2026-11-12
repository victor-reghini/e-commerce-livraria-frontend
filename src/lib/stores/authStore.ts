import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../api/auth';
import {
  setStoredTokens,
  clearStoredAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredBranchId,
  setStoredBranchId,
} from '../api/tokens';
import type { User, UserRole, LoginRequest } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  activeBranchId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<User | null>;
  setUser: (user: User) => void;
  setActiveBranchId: (branchId: string) => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccessAdmin: () => boolean;
  canAccessPDV: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: getStoredAccessToken(),
      refreshToken: getStoredRefreshToken(),
      activeBranchId: getStoredBranchId(),
      isAuthenticated: !!getStoredAccessToken(),
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          setStoredTokens(response.accessToken, response.refreshToken);

          const defaultBranch = response.user.allowedBranchIds?.[0] || null;
          if (defaultBranch) {
            setStoredBranchId(defaultBranch);
          }

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            activeBranchId: defaultBranch,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          clearStoredAuth();
          const message =
            err && typeof err === 'object' && 'response' in err
              ? // @ts-expect-error axios response parsing
                err.response?.data?.message || 'Credenciais inválidas. Verifique seu e-mail e senha.'
              : 'Erro ao conectar com o servidor.';
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw new Error(message);
        }
      },

      logout: () => {
        clearStoredAuth();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          activeBranchId: null,
          error: null,
        });
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      fetchProfile: async () => {
        if (!getStoredAccessToken()) return null;
        set({ isLoading: true });
        try {
          const profile = await authApi.getProfile();
          set({ user: profile, isAuthenticated: true, isLoading: false });
          return profile;
        } catch (err) {
          // If profile fails, clear invalid auth
          clearStoredAuth();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return null;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setActiveBranchId: (branchId: string) => {
        setStoredBranchId(branchId);
        set({ activeBranchId: branchId });
      },

      hasRole: (roles: UserRole[]) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        return roles.includes(currentUser.role);
      },

      canAccessAdmin: () => {
        const currentUser = get().user;
        if (!currentUser) return false;
        return ['SUPER_ADMIN', 'TENANT_ADMIN', 'STORE_MANAGER'].includes(currentUser.role);
      },

      canAccessPDV: () => {
        const currentUser = get().user;
        if (!currentUser) return false;
        return ['SUPER_ADMIN', 'TENANT_ADMIN', 'STORE_MANAGER', 'ATTENDANT'].includes(
          currentUser.role
        );
      },
    }),
    {
      name: 'ecommerce_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        activeBranchId: state.activeBranchId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

