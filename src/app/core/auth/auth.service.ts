import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError, Observable, map, of, switchMap } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, AuthTokens, AuthUser, LoginResponse, RefreshResponse, UserRole, Permission } from './auth.model';
import { ApiResponse } from '@shared/models/api-response.model';

const TOKEN_KEY = 'auth_access_token';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api    = `${environment.apiUrl}/auth`;

  // ── Private writable signals ──────────────────────
  private readonly _user        = signal<AuthUser | null>(null);
  private readonly _accessToken = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  private readonly _loading = signal(false);

  // ── Public readonly signals ───────────────────────
  readonly user           = this._user.asReadonly();
  readonly accessToken    = this._accessToken.asReadonly();
  readonly loading        = this._loading.asReadonly();
  readonly isAuthenticated   = computed(() => !!this._accessToken());
  readonly currentRoles      = computed(() => this._user()?.roles ?? []);
  readonly currentPermissions = computed(() => this._user()?.permissions ?? []);
  readonly displayName = computed(() => {
    const u = this._user();
    if (!u) return '';
    return `${u.firstName} ${u.lastName}`.trim();
  });

  // ── Auth actions ──────────────────────────────────

  login(payload: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    this._loading.set(true);
    return this.http.post<ApiResponse<LoginResponse>>(`${this.api}/login`, payload).pipe(
      tap(({ data }) => {
        const {accessToken, user} = data;
        this.setToken(accessToken);
        this._user.set(user);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    this.http
      .post(`${this.api}/logout`, {}, { withCredentials: true })
      .subscribe({
        complete: () => this.clearAndRedirect(),
        error:    () => this.clearAndRedirect(),
      });
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${this.api}/refresh-token`,
        {},
        { withCredentials: true },
      )
      .pipe(
        map((res) => res.data.accessToken),
        tap((token) => this.setToken(token)),
        catchError((err) => {
          this.clearAndRedirect();
          return throwError(() => err);
        }),
      );
  }

  restoreSession(): Observable<AuthUser | null> {
    const token = this.getToken();
    if (!token) return of(null);

    return this.loadProfile().pipe(
      map((res) => res.data),
      catchError(() =>
        // access token หมดอายุ → ลอง refresh
        this.refreshToken().pipe(
          switchMap(() => this.loadProfile()),
          map((res) => res.data),
          catchError(() => {
            this.clearAndRedirect();
            return of(null);
          }),
        ),
      ),
    );
  }

  loadProfile(): Observable<ApiResponse<AuthUser>> {
    return this.http
      .get<ApiResponse<AuthUser>>(`${this.api}/me`)
      .pipe(tap(({data}) => this._user.set(data)));
  }

  // ── RBAC helpers ──────────────────────────────────

  hasRole(role: UserRole): boolean {
    return this.currentRoles().includes(role);
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    return roles.some((r) => this.hasRole(r));
  }

  hasPermission(permission: Permission): boolean {
    return this.currentPermissions().includes(permission);
  }

  hasAllPermissions(...permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  getToken(): string | null {
    return this._accessToken();
  }

  // ── Private ───────────────────────────────────────

  private setToken(token: string): void {
    this._accessToken.set(token);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  private clearAndRedirect(): void {
    this._user.set(null);
    this._accessToken.set(null);
    sessionStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }
}