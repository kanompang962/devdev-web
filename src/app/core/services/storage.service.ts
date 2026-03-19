// Type-safe wrapper สำหรับ localStorage / sessionStorage
// ใส่ prefix เพื่อป้องกัน key collision กับ lib อื่น

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

const PREFIX = `${environment.appName}:`;

@Injectable({ providedIn: 'root' })
export class StorageService {
  setLocal<T>(key: string, value: T): void {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch { /* quota exceeded */ }
  }

  getLocal<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  }

  removeLocal(key: string): void {
    localStorage.removeItem(PREFIX + key);
  }

  setSession<T>(key: string, value: T): void {
    try { sessionStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch { /* quota exceeded */ }
  }

  getSession<T>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(PREFIX + key);
  }

  clearAll(): void {
    [localStorage, sessionStorage].forEach((s) => {
      Object.keys(s)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => s.removeItem(k));
    });
  }
}