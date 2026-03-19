// Signal-based toast notifications
// Usage: inject(ToastService).success('บันทึกสำเร็จ')

import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id:       string;
  type:     ToastType;
  title:    string;
  message?: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  success(title: string, message?: string, duration = 3000) {
    this.add({ type: 'success', title, message, duration });
  }
  error(title: string, message?: string, duration = 5000) {
    this.add({ type: 'error', title, message, duration });
  }
  warning(title: string, message?: string, duration = 4000) {
    this.add({ type: 'warning', title, message, duration });
  }
  info(title: string, message?: string, duration = 3000) {
    this.add({ type: 'info', title, message, duration });
  }

  dismiss(id: string): void {
    this._toasts.update((ts) => ts.filter((t) => t.id !== id));
  }

  private add(opts: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    this._toasts.update((ts) => [...ts, { ...opts, id }]);
    setTimeout(() => this.dismiss(id), opts.duration);
  }
}