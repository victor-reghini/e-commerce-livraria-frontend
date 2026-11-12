'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Sparkles, UploadCloud, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CatalogAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Catálogo de Produtos & SKUs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão hierárquica de livros, variações (Brochura, Capa Dura, E-book) e kits fiscais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Importar XLSX/CSV
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Livro / SKU
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Módulo de Catálogo (Sprint 2)</CardTitle>
              <CardDescription>
                Arquitetura de dados integrada com upload S3/MinIO e decomposição de kits
              </CardDescription>
            </div>
            <Badge variant="secondary">Próxima Sprint</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Fundação de Autenticação e Multi-Tenancy (Sprint 1) 100% pronta.
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            O módulo de catálogo será populado via endpoints `/api/v1/products` e presigned URLs
            para capas e e-books.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

