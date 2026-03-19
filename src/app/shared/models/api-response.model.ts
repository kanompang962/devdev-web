export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
}

export function initAsyncState<T>(): AsyncState<T> {
  return { data: null, status: 'idle', error: null };
}
