import { apiClient } from './client';
import type { User } from '@/types/auth';

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: User['role'];
  allowedBranchIds?: string[];
  active?: boolean;
}

export const usersApi = {
  async listUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/api/v1/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/api/v1/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>('/api/v1/users', data);
    return response.data;
  },

  async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    const response = await apiClient.put<User>(`/api/v1/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`);
  },
};

