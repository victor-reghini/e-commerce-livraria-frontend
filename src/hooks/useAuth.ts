import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // If we have an access token stored but no user profile loaded in memory, fetch it
    if (store.accessToken && !store.user && !store.isLoading) {
      store.fetchProfile();
    }
  }, [store.accessToken, store.user, store.isLoading, store]);

  return store;
}

