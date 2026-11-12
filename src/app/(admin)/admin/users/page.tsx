'use client';

import React, { useState, useEffect } from 'react';
import { usersApi, CreateUserData } from '@/lib/api/users';
import { authApi } from '@/lib/api/auth';
import type { User, UserRole, Branch } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  Building2,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
} from 'lucide-react';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'TENANT_ADMIN', label: 'Administrador do Tenant', description: 'Acesso total a todas as filiais e módulos' },
  { value: 'STORE_MANAGER', label: 'Gerente de Filial', description: 'Gestão de catálogo, transferências e equipe' },
  { value: 'ATTENDANT', label: 'Operador de Caixa / PDV', description: 'Acesso exclusivo ao PDV balcão e feiras' },
  { value: 'CUSTOMER', label: 'Cliente E-Commerce', description: 'Acesso a pedidos e downloads de e-books' },
  { value: 'SUPER_ADMIN', label: 'Super Admin Plataforma', description: 'Gestão multi-tenant global' },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'ATTENDANT',
    allowedBranchIds: [],
    active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, branchesData] = await Promise.all([
        usersApi.listUsers().catch(() => [
          // Fallback demo data se endpoint ainda não tiver dados
          {
            id: 'usr-01',
            name: 'Administrador Matriz',
            email: 'admin@livrariamatriz.com.br',
            role: 'TENANT_ADMIN' as UserRole,
            tenantId: '00000000-0000-0000-0000-000000000001',
            allowedBranchIds: ['filial-matriz-01'],
            active: true,
          },
          {
            id: 'usr-02',
            name: 'Carlos Oliveira (Operador)',
            email: 'carlos.pdv@livrariamatriz.com.br',
            role: 'ATTENDANT' as UserRole,
            tenantId: '00000000-0000-0000-0000-000000000001',
            allowedBranchIds: ['filial-matriz-01'],
            active: true,
          },
        ]),
        authApi.getCompanies().catch(() => [
          {
            id: 'filial-matriz-01',
            tenantId: '00000000-0000-0000-0000-000000000001',
            name: 'Livraria Matriz - Jardins',
            cnpj: '12.345.678/0001-90',
            isHeadquarters: true,
            active: true,
          },
          {
            id: 'filial-stand-bienal',
            tenantId: '00000000-0000-0000-0000-000000000001',
            name: 'Stand Bienal do Livro',
            cnpj: '12.345.678/0002-71',
            isHeadquarters: false,
            active: true,
          },
        ]),
      ]);

      setUsers(usersData);
      setBranches(branchesData);
    } catch {
      // Ignora erro geral
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'ATTENDANT',
      allowedBranchIds: branches.map((b) => b.id),
      active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      allowedBranchIds: user.allowedBranchIds || [],
      active: user.active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await usersApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert('Falha ao remover usuário.');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingUser) {
        const payload: Partial<CreateUserData> = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          allowedBranchIds: formData.allowedBranchIds,
          active: formData.active,
        };
        if (formData.password) payload.password = formData.password;

        const updated = await usersApi.updateUser(editingUser.id, payload);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await usersApi.createUser(formData);
        setUsers((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? // @ts-expect-error axios message
            err.response?.data?.message || 'Erro ao salvar usuário'
          : 'Falha ao salvar dados.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBranchSelection = (branchId: string) => {
    const current = formData.allowedBranchIds || [];
    if (current.includes(branchId)) {
      setFormData({
        ...formData,
        allowedBranchIds: current.filter((id) => id !== branchId),
      });
    } else {
      setFormData({
        ...formData,
        allowedBranchIds: [...current, branchId],
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Gestão de Usuários & Equipe
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de acesso por papel (RBAC) e vinculação de filiais autorizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleOpenCreate}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail ou perfil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base">Colaboradores Cadastrados</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrados para o tenant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-y border-border">
                <tr>
                  <th className="px-6 py-3">Colaborador</th>
                  <th className="px-6 py-3">Papel / Role</th>
                  <th className="px-6 py-3">Filiais Autorizadas</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum usuário encontrado com os filtros informados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.role === 'SUPER_ADMIN' || user.role === 'TENANT_ADMIN'
                              ? 'default'
                              : 'secondary'
                          }
                          className="font-mono text-xs"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {user.allowedBranchIds && user.allowedBranchIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.allowedBranchIds.map((bid) => {
                              const b = branches.find((item) => item.id === bid);
                              return (
                                <span
                                  key={bid}
                                  className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[11px]"
                                >
                                  <Building2 className="w-3 h-3 text-primary" />
                                  {b?.name || bid}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="italic text-emerald-600 dark:text-emerald-400">
                            Acesso a todas as filiais
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-destructive text-xs font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenEdit(user)}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(user.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {editingUser ? 'Editar Colaborador' : 'Cadastrar Novo Colaborador'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="overflow-y-auto p-6 space-y-4 flex-1">
              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="form-name">Nome Completo</Label>
                <Input
                  id="form-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maria dos Santos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-email">E-mail Profissional</Label>
                <Input
                  id="form-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maria@livrariamatriz.com.br"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-password">
                  {editingUser ? 'Senha (deixe em branco para não alterar)' : 'Senha de Acesso'}
                </Label>
                <Input
                  id="form-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  required={!editingUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-role">Papel no Sistema (RBAC)</Label>
                <select
                  id="form-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filiais Permitidas */}
              <div className="space-y-2 pt-2">
                <Label>Filiais com Acesso Autorizado</Label>
                <div className="space-y-2 border border-border rounded-lg p-3 max-h-36 overflow-y-auto">
                  {branches.map((b) => {
                    const isChecked = formData.allowedBranchIds?.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:bg-muted/50 p-1.5 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBranchSelection(b.id)}
                          className="rounded border-input text-primary focus:ring-primary"
                        />
                        <span>{b.name}</span>
                        {b.isHeadquarters && (
                          <Badge variant="outline" className="text-[10px] py-0">
                            Matriz
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="form-active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <Label htmlFor="form-active" className="cursor-pointer text-xs">
                  Colaborador ativo (habilitado para autenticar)
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {editingUser ? 'Salvar Modificações' : 'Criar Colaborador'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
