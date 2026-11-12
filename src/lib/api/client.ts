import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { generateUUID } from '../utils/formatters';
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredTenantId,
  setStoredTokens,
  clearStoredAuth,
} from './tokens';
import type { RefreshTokenResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag and queue for handling concurrent 401s during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Injects X-Tenant-ID, X-Correlation-ID, and Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Injeta X-Correlation-ID (UUID v4)
    if (!config.headers['X-Correlation-ID']) {
      config.headers['X-Correlation-ID'] = generateUUID();
    }

    // 2. Injeta X-Tenant-ID
    if (!config.headers['X-Tenant-ID']) {
      const tenantId = getStoredTenantId();
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }

    // 3. Injeta Authorization Bearer Token (se existir e não for login/refresh público)
    const token = getStoredAccessToken();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Refresh Token Queue & Auto-Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se o erro não for 401 ou se a requisição não tiver config
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Se a requisição 401 for o próprio endpoint de login ou refresh, não tenta refrescar
    const requestUrl = originalRequest.url || '';
    if (requestUrl.includes('/api/v1/auth/login') || requestUrl.includes('/api/v1/auth/refresh')) {
      return Promise.reject(error);
    }

    // Se já tentou refrescar essa requisição específica, rejeita para evitar loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearStoredAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Se já estiver no meio do processo de refresh, enfileira a requisição concorrente
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Executa rotação de token via POST /api/v1/auth/refresh
      const response = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}/api/v1/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': getStoredTenantId(),
            'X-Correlation-ID': generateUUID(),
          },
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      setStoredTokens(newAccessToken, newRefreshToken);

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearStoredAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

