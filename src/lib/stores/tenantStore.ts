import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../api/auth';
import {
  DEFAULT_TENANT_ID,
  getStoredTenantId,
  setStoredTenantId,
} from '../api/tokens';
import type { TenantInfo } from '@/types/auth';

interface TenantState {
  tenantId: string;
  tenantInfo: TenantInfo | null;
  isLoading: boolean;
  error: string | null;
  setTenantId: (id: string) => void;
  fetchTenantInfo: () => Promise<TenantInfo | null>;
  applyBrandColors: (colorHex?: string | null) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      tenantId: getStoredTenantId() || DEFAULT_TENANT_ID,
      tenantInfo: null,
      isLoading: false,
      error: null,

      setTenantId: (id: string) => {
        setStoredTenantId(id);
        set({ tenantId: id });
        get().fetchTenantInfo();
      },

      fetchTenantInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          const info = await authApi.getTenantInfo();
          set({ tenantInfo: info, isLoading: false });
          if (info.primaryColor) {
            get().applyBrandColors(info.primaryColor);
          }
          return info;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Falha ao buscar informações do tenant';
          set({ error: msg, isLoading: false });
          return null;
        }
      },

      applyBrandColors: (primaryHex?: string | null) => {
        if (typeof document === 'undefined') return;
        const color = primaryHex || '#2563eb'; // Default royal blue
        document.documentElement.style.setProperty('--primary', color);
        // Calculate a darker hover shade if simple hex
        document.documentElement.style.setProperty('--primary-hover', color);
        document.documentElement.style.setProperty('--ring', color);
      },
    }),
    {
      name: 'ecommerce_tenant_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tenantId: state.tenantId,
        tenantInfo: state.tenantInfo,
      }),
    }
  )
);

