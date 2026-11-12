'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BudgetsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-primary" />
            Orçamentos Corporativos B2B
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cotações institucionais a prazo com trava automática contra inadimplência
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Novo Orçamento B2B
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Orçamentos & Trava de Inadimplência (Sprint 5)</CardTitle>
            <Badge variant="secondary">Sprint 5</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/budgets/*</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de cotações B2B com trava 422 Unprocessable Entity preparado para a Sprint 5.
        </CardContent>
      </Card>
    </div>
  );
}

