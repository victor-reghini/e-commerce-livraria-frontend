'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTenantStore } from '@/lib/stores/tenantStore';
import { useAuthStore } from '@/lib/stores/authStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos de cache
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const fetchTenantInfo = useTenantStore((state) => state.fetchTenantInfo);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Carrega branding do tenant e perfil do usuário na inicialização
    fetchTenantInfo();
    if (accessToken) {
      fetchProfile();
    }
  }, [fetchTenantInfo, fetchProfile, accessToken]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

