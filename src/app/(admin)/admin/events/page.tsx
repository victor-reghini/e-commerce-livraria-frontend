'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, ScanBarcode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-primary" />
            Feiras, Stands & Auditoria Cega
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão operacional de eventos itinerantes, bipagem contínua e conciliação de saldo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ScanBarcode className="w-4 h-4 mr-1.5" />
            Conferência Cega
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Stand / Evento
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Operações de Feiras e Auditoria (Sprint 3)</CardTitle>
            <Badge variant="secondary">Sprint 3</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/events e /api/v1/audits</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de eventos e conferência cega preparado para a Sprint 3.
        </CardContent>
      </Card>
    </div>
  );
}

