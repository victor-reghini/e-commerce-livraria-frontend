'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
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
import { Badge } from '@/components/ui/badge';
import { UserCircle, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await authApi.updateProfile({
        name: data.name,
        email: data.email,
      });

      setUser(updated);
      setSuccessMessage('Perfil atualizado com sucesso!');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? // @ts-expect-error axios message
            err.response?.data?.message || 'Erro ao atualizar perfil'
          : 'Falha ao atualizar dados.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UserCircle className="w-7 h-7 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulte e gerencie seus dados cadastrais e credenciais de acesso
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Dados Pessoais</CardTitle>
              <CardDescription>
                Informações da sua conta associada ao endpoint /api/v1/users/me
              </CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-mono text-xs">
              <Shield className="w-3.5 h-3.5 mr-1 text-primary" />
              Role: {user?.role || 'N/A'}
            </Badge>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="p-4 bg-muted/40 rounded-lg border border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tenant ID:</span>
                <span className="font-mono text-foreground">{user?.tenantId || 'Padrão'}</span>
              </div>
              <div className="flex justify-between">
                <span>Filiais Permitidas:</span>
                <span className="font-medium text-foreground">
                  {user?.allowedBranchIds?.length
                    ? `${user.allowedBranchIds.length} filial(is)`
                    : 'Acesso Global'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status da Conta:</span>
                <span className="text-emerald-500 font-semibold">Ativo</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Alterar Senha</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••••••"
                    {...register('currentPassword')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 dígitos"
                    {...register('newPassword')}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button type="submit" isLoading={isLoading} disabled={!isDirty}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
