'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Boxes, Truck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StockAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="w-7 h-7 text-primary" />
            Estoque, Romaneios & Remessas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transferências entre filiais, romaneios de transporte e ledger contábil de estoque
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Truck className="w-4 h-4 mr-1.5" />
            Emitir Romaneio
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Transferência
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Gestão de Estoque Multi-Filial (Sprint 3)</CardTitle>
            <Badge variant="secondary">Sprint 3</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/transfers e /api/v1/stock/movements</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de controle de estoque preparado para a Sprint 3.
        </CardContent>
      </Card>
    </div>
  );
}

