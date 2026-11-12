'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';

export default function StoreHomePage() {
  const sampleBooks = [
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      price: 'R$ 49,90',
      badge: 'Clássico',
      format: 'Capa Dura / E-book',
    },
    {
      title: 'Memórias Póstumas de Brás Cubas',
      author: 'Machado de Assis',
      price: 'R$ 42,00',
      badge: 'Mais Vendido',
      format: 'Brochura / E-book',
    },
    {
      title: 'Grande Sertão: Veredas',
      author: 'João Guimarães Rosa',
      price: 'R$ 79,90',
      badge: 'Destaque',
      format: 'Edição Especial',
    },
    {
      title: 'A Hora da Estrela',
      author: 'Clarice Lispector',
      price: 'R$ 38,50',
      badge: 'Lançamento',
      format: 'Brochura',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <Badge variant="secondary" className="text-xs bg-white/20 text-white hover:bg-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Lançamentos da Temporada
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Descubra histórias inesquecíveis na sua livraria favorita
          </h1>
          <p className="text-sm opacity-90">
            Livros físicos, edições de luxo e e-books com entrega rápida e download seguro imediato.
          </p>
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center">
          <BookOpen className="w-16 h-16 mb-2" />
          <span className="text-xs font-semibold uppercase tracking-wider">Catálogo Ativo</span>
        </div>
      </div>

      {/* Featured Books Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Destaques & Mais Vendidos
            </h2>
            <p className="text-xs text-muted-foreground">
              Obras selecionadas com variações de SKU e estoque em tempo real
            </p>
          </div>
          <Link href="/admin/catalog">
            <Button variant="ghost" size="sm" className="text-xs">
              Gerenciar no Admin <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleBooks.map((book, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground border-b border-border">
                <BookOpen className="w-12 h-12 opacity-40" />
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {book.badge}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{book.format}</span>
                </div>
                <CardTitle className="text-base line-clamp-1">{book.title}</CardTitle>
                <CardDescription className="text-xs">{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex items-center justify-between border-t border-border mt-2">
                <span className="font-bold text-foreground text-base">{book.price}</span>
                <Button size="sm" variant="default" className="text-xs h-8">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  Comprar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

