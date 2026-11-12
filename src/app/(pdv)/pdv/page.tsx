'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  ScanBarcode,
  Coins,
  RefreshCw,
  LogOut,
  Wifi,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function PdvDashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">PDV Móvel & Balcão</h1>
            <p className="text-xs text-slate-400">Operador: {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 gap-1.5 py-1">
            <Wifi className="w-3.5 h-3.5" />
            Offline-First Ready
          </Badge>
          <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-1.5" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-white">Controle de Turno</h3>
            <p className="text-xs text-slate-400 mt-2">
              Abertura de caixa com fundo de troco, sangria, suprimento e fechamento cego de turno.
            </p>
          </div>
          <Button className="mt-6 bg-blue-600 hover:bg-blue-500" disabled>
            Turno em Preparação (Sprint 4)
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-white">Frente de Caixa</h3>
            <p className="text-xs text-slate-400 mt-2">
              Bipagem de código de barras/ISBN via câmera ou leitor laser USB com split de pagamentos e NFC-e.
            </p>
          </div>
          <Button className="mt-6 bg-emerald-600 hover:bg-emerald-500" disabled>
            Terminal em Preparação (Sprint 4)
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-white">Fila de Sincronização</h3>
            <p className="text-xs text-slate-400 mt-2">
              Monitor de vendas offline salvas localmente no Dexie.js e envio idempotente ao backend.
            </p>
          </div>
          <Button className="mt-6 bg-amber-600 hover:bg-amber-500" disabled>
            Sincronizador (Sprint 4)
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          IndexedDB PdvOfflineDb configurado
        </span>
        <Link href="/admin" className="text-blue-400 hover:underline flex items-center gap-1">
          Ir para o Backoffice <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

