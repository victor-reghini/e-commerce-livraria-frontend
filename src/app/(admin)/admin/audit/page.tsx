'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuditAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Trilha Imutável de Auditoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logs de conformidade com mascaramento LGPD / PCI-DSS de dados sensíveis
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1.5" />
          Filtrar Eventos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Auditoria & Telemetria (Sprint 6)</CardTitle>
            <Badge variant="secondary">Sprint 6</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/audit/logs e /api/v1/observability/summary</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de trilha de auditoria e métricas JVM Loom preparado para a Sprint 6.
        </CardContent>
      </Card>
    </div>
  );
}

