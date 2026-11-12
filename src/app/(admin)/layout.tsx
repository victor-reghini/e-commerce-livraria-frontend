'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTenantStore } from '@/lib/stores/tenantStore';
import { authApi } from '@/lib/api/auth';
import type { Branch } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Tags,
  Boxes,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  Users,
  ShieldCheck,
  UserCircle,
  LogOut,
  Building2,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Catálogo & SKUs', href: '/admin/catalog', icon: Layers },
  { name: 'Taxonomia', href: '/admin/taxonomy', icon: Tags },
  { name: 'Estoque & Romaneio', href: '/admin/stock', icon: Boxes },
  { name: 'Feiras & Stands', href: '/admin/events', icon: CalendarCheck },
  { name: 'Orçamentos B2B', href: '/admin/budgets', icon: FileSpreadsheet },
  { name: 'Fiscal & NF-e', href: '/admin/fiscal', icon: Receipt },
  { name: 'Usuários & Equipe', href: '/admin/users', icon: Users },
  { name: 'Trilha de Auditoria', href: '/admin/audit', icon: ShieldCheck },
  { name: 'Meu Perfil', href: '/admin/profile', icon: UserCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, activeBranchId, setActiveBranchId } = useAuthStore();
  const { tenantInfo } = useTenantStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Carrega filiais para o seletor de filial
    authApi
      .getCompanies()
      .then((data) => {
        setBranches(data);
        if (data.length > 0 && !activeBranchId) {
          setActiveBranchId(data[0].id);
        }
      })
      .catch(() => {
        // Fallback filial default
        if (!activeBranchId) {
          setActiveBranchId('filial-matriz-01');
        }
      });
  }, [activeBranchId, setActiveBranchId]);

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border bg-card shrink-0">
          {/* Logo & Tenant */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm leading-tight truncate">
                {tenantInfo?.name || 'Livraria Matriz'}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">Backoffice Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Atalho Loja e PDV */}
          <div className="p-3 border-t border-border space-y-1.5">
            <Link
              href="/pdv"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir PDV Balcão
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                PWA
              </Badge>
            </Link>
            <Link
              href="/store"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Ver Loja E-Commerce
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                SSR
              </Badge>
            </Link>
          </div>

          {/* User Profile Bar */}
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium truncate">{user?.name || 'Administrador'}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Seletor de Filial / Empresa */}
              <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border text-xs">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground hidden sm:inline">Filial Ativa:</span>
                <select
                  value={activeBranchId || ''}
                  onChange={(e) => setActiveBranchId(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none cursor-pointer pr-2 text-foreground"
                >
                  {branches.length > 0 ? (
                    branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-card text-foreground">
                        {b.name} {b.isHeadquarters ? '(Matriz)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value="filial-matriz-01" className="bg-card text-foreground">
                      Filial Matriz (São Paulo)
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs hidden md:inline-flex">
                Tenant: {tenantInfo?.slug || 'matriz'}
              </Badge>
              <Badge variant="secondary" className="text-xs font-semibold">
                {user?.role || 'ADMIN'}
              </Badge>
            </div>
          </header>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-b border-border bg-card p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

