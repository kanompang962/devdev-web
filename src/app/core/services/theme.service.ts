import { Injectable, signal, computed, effect, inject, DOCUMENT } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly _theme   = signal<Theme>(this.loadSavedTheme());

    readonly theme        = this._theme.asReadonly();
    readonly isDark       = computed(() => this.resolveIsDark(this._theme()));
    
    readonly effectiveTheme = computed((): 'light' | 'dark' => {
        const t = this._theme();
        if (t === 'light' || t === 'dark') return t;
        return this.prefersDark() ? 'dark' : 'light';
    });

  constructor() {
    // Apply theme whenever signal changes
    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });

    // Listen to OS theme change
    this.watchSystemTheme();
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  toggleDark(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private resolveIsDark(theme: Theme): boolean {
    if (theme === 'dark')   return true;
    if (theme === 'light')  return false;
    return this.prefersDark();
  }

  private prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private loadSavedTheme(): Theme {
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
  }

  private watchSystemTheme(): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this._theme() === 'system') {
          this.applyTheme(this.prefersDark() ? 'dark' : 'light');
        }
      });
  }
}