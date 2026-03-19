
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';

export type Permission =
  | 'users:read'   | 'users:write'   | 'users:delete'
  | 'reports:read' | 'reports:export'
  | 'settings:read'| 'settings:write';

export interface AuthUser {
  id:          string;
  email:       string;
  name:        string;
  firstName:   string;
  lastName:    string;
  avatar?:     string;
  roles:       UserRole[];
  permissions: Permission[];
}

export interface AuthTokens {
  accessToken: string;
  tokenType:   'Bearer';
  expiresIn:   number; // seconds
}

export interface LoginRequest {
  email:       string;
  password:    string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user:   AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  user:   AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// RBAC matrix: role → allowed permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['users:read','users:write','users:delete','reports:read','reports:export','settings:read','settings:write'],
  ADMIN:       ['users:read','users:write','reports:read','reports:export','settings:read','settings:write'],
  MANAGER:     ['users:read','reports:read','reports:export','settings:read'],
  USER:        ['users:read','reports:read'],
  VIEWER:      ['users:read'],
};
