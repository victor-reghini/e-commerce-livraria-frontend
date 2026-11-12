'use client';

import React from 'react';
import Link from 'next/link';
import { useTenantStore } from '@/lib/stores/tenantStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, User, Search, Store } from 'lucide-react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const { tenantInfo } = useTenantStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4 text-center text-xs font-medium">
        Frete grátis para todo o Brasil em compras acima de R$ 150,00!
      </div>

      {/* Main Store Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/store" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              {tenantInfo?.name || 'Livraria Virtual'}
            </span>
          </Link>

          {/* Search Bar Placeholder */}
          <div className="flex-1 max-w-md hidden md:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar livros por título, autor ou ISBN..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-input bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-xs">
                  <User className="w-4 h-4 mr-1.5" />
                  {user?.name?.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Entrar
                </Button>
              </Link>
            )}

            <Button size="sm" className="relative">
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Carrinho</span>
              <span className="ml-1 bg-white text-primary rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                0
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Store Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p>© 2026 {tenantInfo?.name || 'Livraria Matriz'}. Todos os direitos reservados.</p>
          <p className="flex items-center justify-center gap-2">
            <Store className="w-3.5 h-3.5" />
            Plataforma E-Commerce Headless Multi-Tenant
          </p>
        </div>
      </footer>
    </div>
  );
}

