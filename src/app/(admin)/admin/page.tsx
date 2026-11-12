'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTenantStore } from '@/lib/stores/tenantStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Boxes,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { tenantInfo } = useTenantStore();

  const quickStats = [
    { title: 'Status do Backend', value: 'Online (Spring Boot 3.3.5)', icon: ShieldCheck, color: 'text-emerald-500' },
    { title: 'Filial Conectada', value: 'Matriz Principal', icon: BookOpen, color: 'text-primary' },
    { title: 'Perfil Ativo', value: user?.role || 'ADMIN', icon: Users, color: 'text-purple-500' },
    { title: 'Modo Fiscal', value: 'Homologação SEFAZ', icon: Receipt, color: 'text-amber-500' },
  ];

  const modules = [
    {
      title: 'Catálogo & SKUs',
      description: 'Gestão de títulos, capas, e-books, kits fiscais e importação XLSX/CSV.',
      href: '/admin/catalog',
      icon: Layers,
      sprint: 'Sprint 2',
    },
    {
      title: 'Estoque & Romaneio',
      description: 'Transferências entre filiais, reservas e conferência de remessas.',
      href: '/admin/stock',
      icon: Boxes,
      sprint: 'Sprint 3',
    },
    {
      title: 'Feiras & Auditoria Cega',
      description: 'Stands itinerantes, conferência de estoque via bipagem e painel em tempo real.',
      href: '/admin/events',
      icon: CalendarCheck,
      sprint: 'Sprint 3',
    },
    {
      title: 'Orçamentos B2B',
      description: 'Cotações para escolas/órgãos públicos com trava automática de inadimplência.',
      href: '/admin/budgets',
      icon: FileSpreadsheet,
      sprint: 'Sprint 5',
    },
    {
      title: 'Fiscal & NF-e / NFC-e',
      description: 'Emissão de Danfe, monitor SEFAZ, contingência offline e exportação XML.',
      href: '/admin/fiscal',
      icon: Receipt,
      sprint: 'Sprint 6',
    },
    {
      title: 'Gestão de Usuários & RBAC',
      description: 'Colaboradores, controle granular de permissões e filiais autorizadas.',
      href: '/admin/users',
      icon: Users,
      sprint: 'Sprint 1',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {user?.name || 'Administrador'}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Painel de gestão unificado da livraria ({tenantInfo?.name || 'Livraria Matriz'})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Multi-Tenant Ativo
          </Badge>
          <Badge variant="default" className="px-3 py-1 text-xs">
            Java 21 / Loom Ready
          </Badge>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-muted ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modules Roadmap Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Módulos Integrados do Backoffice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.href} href={mod.href} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-0.5">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {mod.sprint}
                      </Badge>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {mod.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex justify-end">
                    <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:underline">
                      Acessar módulo <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
