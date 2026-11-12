'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTenantStore } from '@/lib/stores/tenantStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { BookOpen, ShieldAlert, Sparkles, Store, KeyRound, Building2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  tenantId: z.string().min(1, 'O identificador do tenant é obrigatório'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();
  const { tenantInfo, tenantId, setTenantId } = useTenantStore();
  const [showTenantConfig, setShowTenantConfig] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantId: tenantId || '00000000-0000-0000-0000-000000000001',
    },
  });

  // Helper para carregar credenciais padrão de desenvolvimento
  const handleQuickSeed = () => {
    setValue('email', 'admin@livrariamatriz.com.br', { shouldValidate: true });
    setValue('password', 'Admin@123456', { shouldValidate: true });
    setValue('tenantId', '00000000-0000-0000-0000-000000000001', { shouldValidate: true });
    setTenantId('00000000-0000-0000-0000-000000000001');
  };

  const onSubmit = async (data: LoginFormData) => {
    if (data.tenantId !== tenantId) {
      setTenantId(data.tenantId);
    }

    try {
      await login({ email: data.email, password: data.password });
      const user = useAuthStore.getState().user;

      if (!user) {
        router.push('/admin');
        return;
      }

      // Redirecionamento baseado em RBAC
      if (['SUPER_ADMIN', 'TENANT_ADMIN', 'STORE_MANAGER'].includes(user.role)) {
        router.push('/admin');
      } else if (user.role === 'ATTENDANT') {
        router.push('/pdv');
      } else {
        router.push('/store');
      }
    } catch {
      // O erro já é tratado no authStore e exibido na UI
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Header com branding do Tenant */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {tenantInfo?.name || 'Ecossistema Livraria'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma Multi-Tenant de E-Commerce, PDV e Gestão
          </p>
        </div>

        <Card className="shadow-xl border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Acessar Plataforma</CardTitle>
            <CardDescription>
              Informe suas credenciais para entrar no seu painel
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo ou pessoal</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@livrariamatriz.com.br"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha de acesso</Label>
                  <a
                    href="#"
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Recuperação de senha: entre em contato com o administrador do tenant.');
                    }}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Seletor de Tenant ID opcional */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowTenantConfig(!showTenantConfig)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {showTenantConfig ? 'Ocultar ID do Tenant' : 'Configurar Tenant ID'}
                </button>

                {showTenantConfig && (
                  <div className="mt-2 space-y-1">
                    <Label htmlFor="tenantId" className="text-xs">
                      X-Tenant-ID
                    </Label>
                    <Input
                      id="tenantId"
                      type="text"
                      className="text-xs font-mono"
                      {...register('tenantId')}
                    />
                    {errors.tenantId && (
                      <p className="text-xs text-destructive">{errors.tenantId.message}</p>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                <KeyRound className="w-4 h-4 mr-2" />
                Entrar no Sistema
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t border-border pt-4">
            {/* Quick Fill para Desenvolvimento */}
            <div className="w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-foreground border-dashed"
                onClick={handleQuickSeed}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Preencher Credenciais Padrão (Seed Admin)
              </Button>
            </div>

            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                Livraria Matriz
              </span>
              <span>v1.0.0 (Sprint 1)</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

