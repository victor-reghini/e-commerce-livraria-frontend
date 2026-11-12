const ACCESS_TOKEN_KEY = 'ecommerce_access_token';
const REFRESH_TOKEN_KEY = 'ecommerce_refresh_token';
const TENANT_ID_KEY = 'ecommerce_tenant_id';
const ACTIVE_BRANCH_ID_KEY = 'ecommerce_active_branch_id';

export const DEFAULT_TENANT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '00000000-0000-0000-0000-000000000001';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredTenantId(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_ID;
  return localStorage.getItem(TENANT_ID_KEY) || DEFAULT_TENANT_ID;
}

export function getStoredBranchId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_BRANCH_ID_KEY);
}

export function setStoredTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  // Sync access token to cookie for SSR middleware/hydration if needed
  document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

export function setStoredTenantId(tenantId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TENANT_ID_KEY, tenantId);
  document.cookie = `tenant_id=${tenantId}; path=/; max-age=31536000; SameSite=Lax`;
}

export function setStoredBranchId(branchId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_BRANCH_ID_KEY, branchId);
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
}

