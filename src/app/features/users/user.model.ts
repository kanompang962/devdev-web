import { UserRole } from '../../core/auth/auth.model';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export interface User {
  id:           string;
  email:        string;
  name:         string;
  firstName:    string;
  lastName:     string;
  avatar?:      string;
  role:         UserRole;
  status:       UserStatus;
  department?:  string;
  phone?:       string;
  createdAt:    string;
  updatedAt:    string;
  lastLoginAt?: string;
}

export interface CreateUserDto {
  email:       string;
  firstName:   string;
  lastName:    string;
  role:        UserRole;
  department?: string;
  phone?:      string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  status?: UserStatus;
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE:    'ใช้งานอยู่',
  INACTIVE:  'ปิดใช้งาน',
  PENDING:   'รอการยืนยัน',
  SUSPENDED: 'ถูกระงับ',
};

export const USER_STATUS_VARIANT: Record<UserStatus, 'success' | 'error' | 'warning' | 'neutral'> = {
  ACTIVE:    'success',
  INACTIVE:  'neutral',
  PENDING:   'warning',
  SUSPENDED: 'error',
};