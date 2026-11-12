'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function PdvLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requirePDV>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col select-none">
        {children}
      </div>
    </ProtectedRoute>
  );
}

