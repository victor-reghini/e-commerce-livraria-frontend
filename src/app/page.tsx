'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTenantStore } from '@/lib/stores/tenantStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  WifiOff,
  Server,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { tenantInfo } = useTenantStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base leading-none block">
                {tenantInfo?.name || 'Ecossistema Livraria'}
              </span>
              <span className="text-xs text-muted-foreground">Plataforma Multi-Tenant</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Logado como <strong className="text-foreground">{user?.name}</strong>
                </span>
                <Link href="/admin">
                  <Button size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Acessar Backoffice
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Entrar no Sistema</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary">
            Next.js 15 • React 19 • Java 21 LTS Backend
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Ecossistema Completo para Gestão de Livrarias & E-Commerce
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Backoffice unificado com catálogo e NF-e, PDV PWA offline-first com bipagem ótica e loja
            virtual pública de alta performance.
          </p>
        </div>

        {/* 3 Main Portals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Backoffice SPA */}
          <Card className="flex flex-col justify-between border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="w-fit text-[11px] mb-2">
                Painel Administrativo
              </Badge>
              <CardTitle className="text-xl">Backoffice SPA</CardTitle>
              <CardDescription className="text-sm mt-2">
                Gestão completa de catálogo com kits fiscais, múltiplos estoques, romaneio de
                transferência, feiras com auditoria cega e faturamento NF-e 55.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Link href="/admin">
                <Button className="w-full">
                  Abrir Backoffice
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: PDV Mobile PWA */}
          <Card className="flex flex-col justify-between border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="w-fit text-[11px] mb-2">
                Offline-First PWA
              </Badge>
              <CardTitle className="text-xl">PDV Balcão & Feira</CardTitle>
              <CardDescription className="text-sm mt-2">
                Terminal de caixa com IndexedDB (Dexie.js), bipagem por câmera e laser USB, split de
                pagamentos, fechamento cego de turno e sincronização delta idempotente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Link href="/pdv">
                <Button variant="outline" className="w-full">
                  Abrir PDV Terminal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Loja E-Commerce */}
          <Card className="flex flex-col justify-between border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="w-fit text-[11px] mb-2">
                E-Commerce SSR
              </Badge>
              <CardTitle className="text-xl">Loja Pública</CardTitle>
              <CardDescription className="text-sm mt-2">
                Vitrine com busca facetada e autocomplete, variações de SKU (Capa Dura, Brochura,
                E-book), simulador de frete e checkout transparente Pagar.me V5.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Link href="/store">
                <Button variant="outline" className="w-full">
                  Visitar Loja Virtual
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Multi-Tenancy RLS</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Isolamento estrito por cabeçalho X-Tenant-ID garantindo segurança e branding por loja.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Venda Offline Instantânea</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Operação de vendas e sangrias ininterrupta em feiras sem conexão com a internet.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Rotação de Token Concorrente</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Axios interceptor com fila assíncrona automática para respostas 401 sem desconexão.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Backend Spring Boot 3.3.5</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Virtual Threads do Java 21 com endpoints REST de alta vazão rodando em localhost:8080.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Ecossistema Livraria Multi-Tenant • Desenvolvido com Next.js 15 & Spring Boot 3.3.5
      </footer>
    </div>
  );
}

