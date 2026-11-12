import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  TenantInfo,
  User,
  Branch,
} from '@/types/auth';

export const authApi = {
  /**
   * Autenticação via email e senha
   * POST /api/v1/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response.data;
  },

  /**
   * Rotação de Refresh Token
   * POST /api/v1/auth/refresh
   */
  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Resolução Dinâmica de Tenant & Branding
   * GET /api/v1/auth/tenant-info
   */
  async getTenantInfo(): Promise<TenantInfo> {
    const response = await apiClient.get<TenantInfo>('/api/v1/auth/tenant-info');
    return response.data;
  },

  /**
   * Perfil do usuário autenticado
   * GET /api/v1/users/me
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/users/me');
    return response.data;
  },

  /**
   * Atualização do perfil
   * PUT /api/v1/users/me
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/api/v1/users/me', data);
    return response.data;
  },

  /**
   * Listagem de filiais permitidas para o tenant
   * GET /api/v1/companies
   */
  async getCompanies(): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/api/v1/companies');
    return response.data;
  },
};

