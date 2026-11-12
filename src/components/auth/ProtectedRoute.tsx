'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
  requirePDV?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAdmin,
  requirePDV,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && user) {
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }

      if (requireAdmin && !['SUPER_ADMIN', 'TENANT_ADMIN', 'STORE_MANAGER'].includes(user.role)) {
        router.push('/unauthorized');
        return;
      }

      if (
        requirePDV &&
        !['SUPER_ADMIN', 'TENANT_ADMIN', 'STORE_MANAGER', 'ATTENDANT'].includes(user.role)
      ) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, requireAdmin, requirePDV, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

