'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FiscalAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="w-7 h-7 text-primary" />
            Módulo Fiscal & SEFAZ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Emissão de NF-e Modelo 55, NFC-e 65, espelho do DANFE e contingência offline
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ShieldAlert className="w-4 h-4 mr-1.5" />
          Status SEFAZ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Gestão e Homologação Fiscal (Sprint 6)</CardTitle>
            <Badge variant="secondary">Sprint 6</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/fiscal/*</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de emissão de NF-e, DANFE e chave de 44 dígitos preparado para a Sprint 6.
        </CardContent>
      </Card>
    </div>
  );
}

