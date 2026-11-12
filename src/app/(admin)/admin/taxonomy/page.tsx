'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaxonomyAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Tags className="w-7 h-7 text-primary" />
            Taxonomia (Categorias, Autores & Editoras)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão estruturada das entidades de classificação do acervo
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Adicionar Entrada
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Taxonomia e Metadados (Sprint 2)</CardTitle>
            <Badge variant="secondary">Sprint 2</Badge>
          </div>
          <CardDescription>Consome endpoints /api/v1/taxonomy/*</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Módulo de taxonomia pronto para integração na Sprint 2.
        </CardContent>
      </Card>
    </div>
  );
}

