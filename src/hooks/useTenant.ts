import { useEffect } from 'react';
import { useTenantStore } from '@/lib/stores/tenantStore';

export function useTenant() {
  const store = useTenantStore();

  useEffect(() => {
    if (!store.tenantInfo && !store.isLoading) {
      store.fetchTenantInfo();
    }
  }, [store.tenantInfo, store.isLoading, store]);

  return store;
}

